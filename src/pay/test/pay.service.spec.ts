import { Test, TestingModule } from '@nestjs/testing';
import { PayService } from './../pay.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pay } from './../entity/pay.entity';
import { Order } from './../../order/entity/order';
import { User } from './../../user/entity/user';
import { PayLog } from './../entity/pay-log.entity';
import { PayConstants, ErrorConstants } from '../config/pay.constants';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PayService', () => {
  let service: PayService;
  let payRepository: Repository<Pay>;
  let orderRepository: Repository<Order>;
  let userRepository: Repository<User>;
  let payLogRepository: Repository<PayLog>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayService,
        {
          provide: getRepositoryToken(Pay),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PayLog),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PayService>(PayService);
    payRepository = module.get<Repository<Pay>>(getRepositoryToken(Pay));
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    payLogRepository = module.get<Repository<PayLog>>(getRepositoryToken(PayLog));
  });

  describe('createTransaction', () => {
    it('should create a transaction and return success response', async () => {
      const order = { id: 1, total_cost: 1000 } as Order;
      const transaction = { id: 1, reference: 'eve-1234', total_cost: 1000, status: 0 } as Pay;

      jest.spyOn(orderRepository, 'findOneBy').mockResolvedValue(order);
      jest.spyOn(payRepository, 'save').mockResolvedValue(transaction);

      const result = await service.createTransaction(1);
      expect(result).toEqual(PayConstants.TRANSACTION_CREATED(transaction.id, transaction.reference));
    });

    it('should return ORDER_NOT_FOUND if order does not exist', async () => {
      jest.spyOn(orderRepository, 'findOneBy').mockResolvedValue(null);
      
      const result = await service.createTransaction(1);
      expect(result).toEqual(PayConstants.ORDER_NOT_FOUND);
    });

    it('should return TRANSACTION_CREATION_FAILED on error', async () => {
      jest.spyOn(orderRepository, 'findOneBy').mockResolvedValue({ id: 1, total_cost: 1000 } as Order);
      jest.spyOn(payRepository, 'save').mockRejectedValue(new Error('Some error'));

      const result = await service.createTransaction(1);
      expect(result).toEqual(PayConstants.TRANSACTION_CREATION_FAILED);
    });
  });

  describe('getAcceptanceToken', () => {
    it('should return acceptance token from API', async () => {
      const data = { data: { presigned_acceptance: { acceptance_token: 'token', permalink: 'link' } } };
      mockedAxios.get.mockResolvedValue({ data });

      const result = await service.getAcceptanceToken();
      expect(result).toEqual({ acceptance_token: 'token', permalink: 'link' });
    });

    it('should return REQUEST_ACCEPTANCE_TOKEN_FAILED on error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Some error'));

      const result = await service.getAcceptanceToken();
      expect(result).toEqual(PayConstants.REQUEST_ACCEPTANCE_TOKEN_FAILED);
    });
  });

  describe('tokenizeCard', () => {
    it('should return card token from API', async () => {
      const cardDetails = { number: '4111111111111111', cvc: '123', exp_month: '12', exp_year: '2024', card_holder: 'John Doe' };
      const response = { data: { data: { id: 'card-token' } } };
      mockedAxios.post.mockResolvedValue(response);

      const result = await service.tokenizeCard(cardDetails);
      expect(result).toEqual({ id: 'card-token' });
    });

    it('should return CARD_TOKENIZATION_FAILED on error', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Some error'));

      const result = await service.tokenizeCard({ number: '4111111111111111', cvc: '123', exp_month: '12', exp_year: '2024', card_holder: 'John Doe' });
      expect(result).toEqual(PayConstants.CARD_TOKENIZATION_FAILED);
    });
  });

  describe('createGatewayTransaction', () => {
    it('should create a gateway transaction and return the ID', async () => {
      const transaction = {
        id: 'trans-id',
        reference: 'ref-123',
        total_cost: 1000,
        status: 0,
        payment_method: 'CARD',
        payment_date: new Date(),
        order: {
          user: { email: 'test@example.com' },
          total_cost: 1000
        }
      } as unknown as Pay;
  
      const user = { email: 'test@example.com' } as User;
      const response = { data: { data: { id: 'gateway-id' } } };
  
      jest.spyOn(payRepository, 'findOne').mockResolvedValue(transaction);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      mockedAxios.post.mockResolvedValue(response);
  
      const result = await service.createGatewayTransaction({
        reference: 'ref-123',
        installments: 1,
        acceptance_token: 'acceptance-token',
        id_tokenizacion: 'token-id'
      });
  
      expect(result).toEqual({ id: 'gateway-id' });
    });
  });
  
  describe('getTransactionDetails', () => {
    it('should handle errors and return appropriate error response', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue({
        response: {
          status: 500,
          data: { message: 'Some error' }
        }
      });
  
      const result = await service.getTransactionDetails({ idTransaction: 'trans-id' });
  
      expect(result).toEqual({
        status: 500,
        result: false,
        message: 'Server error occurred on Wompi API'
      });
    });
  });

  describe('updateTransaction', () => {
    it('should update transaction and return success response', async () => {
      const transaction = { reference: 'ref-123', payment_method: '', payment_date: new Date(), franchise: '', cus: '', status: 0 } as Pay;
      jest.spyOn(payRepository, 'findOneBy').mockResolvedValue(transaction);
      jest.spyOn(payRepository, 'save').mockResolvedValue(transaction);

      const result = await service.updateTransaction({
        reference: 'ref-123',
        type: 'CARD',
        finalized_at: '2024-07-31T20:00:42.296Z',
        brand: 'VISA',
        id: 'trans-id',
        status: 'APPROVED'
      });

      expect(result).toEqual(PayConstants.TRANSACTION_UPDATE_SUCCESS);
    });

    it('should return TRANSACTION_NOT_FOUND if transaction does not exist', async () => {
      jest.spyOn(payRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.updateTransaction({
        reference: 'ref-123',
        type: 'CARD',
        finalized_at: '2024-07-31T20:00:42.296Z',
        brand: 'VISA',
        id: 'trans-id',
        status: 'APPROVED'
      });

      expect(result).toEqual(PayConstants.TRANSACTION_NOT_FOUND);
    });

    it('should handle errors and return TRANSACTION_UPDATE_FAILED', async () => {
      jest.spyOn(payRepository, 'findOneBy').mockResolvedValue({ reference: 'ref-123' } as Pay);
      jest.spyOn(payRepository, 'save').mockRejectedValue(new Error('Some error'));

      const result = await service.updateTransaction({
        reference: 'ref-123',
        type: 'CARD',
        finalized_at: '2024-07-31T20:00:42.296Z',
        brand: 'VISA',
        id: 'trans-id',
        status: 'APPROVED'
      });

      expect(result).toEqual({
        ...PayConstants.TRANSACTION_UPDATE_FAILED,
        message: `${ErrorConstants.REQUEST_SETUP_ERROR.message}: Some error`
      });
    });
  });

});
