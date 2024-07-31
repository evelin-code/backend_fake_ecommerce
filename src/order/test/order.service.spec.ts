import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './../order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../../user/entity/user';
import { Product } from './../../product/entity/product.entity';
import { Order } from './../entity/order';
import { OrderItem } from './../entity/order-item.entity';
import { Pay } from './../../pay/entity/pay.entity';
import { OrderConstants } from './../config/order.constants';

describe('OrderService', () => {
  let service: OrderService;
  let userRepository: Repository<User>;
  let productRepository: Repository<Product>;
  let orderRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;
  let payRepository: Repository<Pay>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Pay),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderItemRepository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
    payRepository = module.get<Repository<Pay>>(getRepositoryToken(Pay));
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const userId = 1;
      const items = [{ productId: 1, quantity: 2 }];
      const user = { id: userId } as User;
      const product = { id: 1, stock: 10, price: 100 } as Product;
      const order = { id: 1, total_cost: 200 } as Order;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(product);
      jest.spyOn(orderRepository, 'create').mockReturnValue(order as any);
      jest.spyOn(orderRepository, 'save').mockResolvedValue(order);
      jest.spyOn(orderItemRepository, 'create').mockReturnValue({} as any);
      jest.spyOn(orderItemRepository, 'save').mockResolvedValue(undefined);
      jest.spyOn(productRepository, 'save').mockResolvedValue(undefined);

      const result = await service.createOrder(userId, items);
      expect(result).toEqual(OrderConstants.ORDER_CREATED(order.id));
    });

    it('should return USER_NOT_FOUND if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      const result = await service.createOrder(1, []);
      expect(result).toEqual(OrderConstants.USER_NOT_FOUND);
    });

    it('should return PRODUCT_NOT_FOUND if product does not exist', async () => {
      const user = { id: 1 } as User;
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);
      const result = await service.createOrder(1, [{ productId: 1, quantity: 1 }]);
      expect(result).toEqual(OrderConstants.PRODUCT_NOT_FOUND);
    });

    it('should return OUT_OF_STOCK if product stock is insufficient', async () => {
      const user = { id: 1 } as User;
      const product = { id: 1, stock: 0 } as Product;
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(product);
      const result = await service.createOrder(1, [{ productId: 1, quantity: 1 }]);
      expect(result).toEqual(OrderConstants.OUT_OF_STOCK([1]));
    });

    it('should return ORDER_CREATION_FAILED if order creation fails', async () => {
      const user = { id: 1 } as User;
      const product = { id: 1, stock: 10, price: 100 } as Product;
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(product);
      jest.spyOn(orderRepository, 'create').mockReturnValue(null);
      const result = await service.createOrder(1, [{ productId: 1, quantity: 1 }]);
      expect(result).toEqual(OrderConstants.ORDER_CREATION_FAILED);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      const orderId = 1;
      const order = { id: orderId, status: 'lq', total_cost: 200 } as Order;
      const transaction = { id: orderId, status: 1 } as Pay;

      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(order);
      jest.spyOn(payRepository, 'findOne').mockResolvedValue(transaction);
      jest.spyOn(orderRepository, 'save').mockResolvedValue(order);

      const result = await service.updateOrderStatus(orderId);
      expect(result).toEqual(OrderConstants.ORDER_UPDATED(orderId));
    });

    it('should return ORDER_NOT_FOUND if order does not exist', async () => {
      const orderId = 1;
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(null);
      const result = await service.updateOrderStatus(orderId);
      expect(result).toEqual(OrderConstants.ORDER_NOT_FOUND);
    });

    it('should return TRANSACTION_NOT_FOUND if transaction does not exist', async () => {
      const orderId = 1;
      const order = { id: orderId, status: 'lq', total_cost: 200 } as Order;
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(order);
      jest.spyOn(payRepository, 'findOne').mockResolvedValue(null);
      const result = await service.updateOrderStatus(orderId);
      expect(result).toEqual(OrderConstants.TRANSACTION_NOT_FOUND);
    });

    it('should return TRANSACTION_STATUS_INVALID if transaction status is invalid', async () => {
      const orderId = 1;
      const order = { id: orderId, status: 'lq', total_cost: 200 } as Order;
      const transaction = { id: orderId, status: 0 } as Pay;
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(order);
      jest.spyOn(payRepository, 'findOne').mockResolvedValue(transaction);
      const result = await service.updateOrderStatus(orderId);
      expect(result).toEqual(OrderConstants.TRANSACTION_STATUS_INVALID);
    });

    it('should return ORDER_UPDATE_FAILED if updating the order fails', async () => {
      const orderId = 1;
      const order = { id: orderId, status: 'lq', total_cost: 200 } as Order;
      const transaction = { id: orderId, status: 1 } as Pay;
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(order);
      jest.spyOn(payRepository, 'findOne').mockResolvedValue(transaction);
      jest.spyOn(orderRepository, 'save').mockRejectedValue(new Error('Error'));

      const result = await service.updateOrderStatus(orderId);
      expect(result).toEqual(OrderConstants.ORDER_UPDATE_FAILED);
    });
  });
});
