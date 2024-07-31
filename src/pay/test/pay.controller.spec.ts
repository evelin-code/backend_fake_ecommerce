import { Test, TestingModule } from '@nestjs/testing';
import { PayController } from './../pay.controller';
import { PayService } from './../pay.service';

describe('PayController', () => {
  let controller: PayController;
  let service: PayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayController],
      providers: [
        {
          provide: PayService,
          useValue: {
            createTransaction: jest.fn(),
            getAcceptanceToken: jest.fn(),
            tokenizeCard: jest.fn(),
            createGatewayTransaction: jest.fn(),
            getTransactionDetails: jest.fn(),
            updateTransaction: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PayController>(PayController);
    service = module.get<PayService>(PayService);
  });

  describe('createTransaction', () => {
    it('should return result from PayService', async () => {
      const result = { success: true };
      jest.spyOn(service, 'createTransaction').mockResolvedValue(result);

      expect(await controller.createTransaction(1)).toBe(result);
    });
  });

  describe('getAcceptanceToken', () => {
    it('should return result from PayService', async () => {
      const result = { token: 'sample-token' };
      jest.spyOn(service, 'getAcceptanceToken').mockResolvedValue(result);

      expect(await controller.getAcceptanceToken()).toBe(result);
    });
  });

  describe('tokenizeCard', () => {
    it('should return result from PayService', async () => {
      const cardDetails = { number: '4111111111111111', cvc: '123', exp_month: '12', exp_year: '2024', card_holder: 'John Doe' };
      const result = { token: 'card-token' };
      jest.spyOn(service, 'tokenizeCard').mockResolvedValue(result);

      expect(await controller.tokenizeCard(cardDetails)).toBe(result);
    });
  });

  describe('createGatewayTransaction', () => {
    it('should return result from PayService', async () => {
      const data = { reference: 'ref-123', installments: 1, acceptance_token: 'acceptance-token', id_tokenizacion: 'token-id' };
      const result = { success: true };
      jest.spyOn(service, 'createGatewayTransaction').mockResolvedValue(result);

      expect(await controller.createGatewayTransaction(data)).toBe(result);
    });
  });

  describe('getTransactionDetails', () => {
    it('should return result from PayService', async () => {
      const body = { idTransaction: 'transaction-id' };
      const result = { details: 'transaction-details' };
      jest.spyOn(service, 'getTransactionDetails').mockResolvedValue(result);

      expect(await controller.getTransactionDetails(body)).toBe(result);
    });
  });

  describe('updateTransaction', () => {
    it('should return result from PayService', async () => {
      const body = { reference: 'ref-123', type: 'CARD', finalized_at: '2024-07-31T20:00:42.296Z', brand: 'VISA', id: 'transaction-id', status: 'APPROVED' };
      const result = { success: true };
      jest.spyOn(service, 'updateTransaction').mockResolvedValue(result);

      expect(await controller.updateTransaction(body)).toBe(result);
    });
  });
});
