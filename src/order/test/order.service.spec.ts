import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderService } from './../order.service';
import { User } from './../../user/entity/user';
import { Product } from './../../product/entity/product.entity';
import { Order } from './../entity/order';
import { OrderItem } from './../entity/order-item.entity';
import { OrderConstants } from './../config/order.constants';

describe('OrderService', () => {
  let service: OrderService;
  let userRepository: Repository<User>;
  let productRepository: Repository<Product>;
  let orderRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;

  const mockUserRepository = () => ({
    findOneBy: jest.fn(),
  });

  const mockProductRepository = () => ({
    findOneBy: jest.fn(),
    save: jest.fn(),
  });

  const mockOrderRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  });

  const mockOrderItemRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository() },
        { provide: getRepositoryToken(Product), useValue: mockProductRepository() },
        { provide: getRepositoryToken(Order), useValue: mockOrderRepository() },
        { provide: getRepositoryToken(OrderItem), useValue: mockOrderItemRepository() },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderItemRepository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const userId = 1;
      const items = [{ productId: 1, quantity: 2 }];
      const mockUser = { id: userId } as User;
      const mockProduct = { id: 1, stock: 10, price: 100 } as Product;
      const mockOrder = { id: 1, total_cost: 200, status: 'lq' } as Order;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(mockProduct);
      jest.spyOn(orderRepository, 'create').mockReturnValue(mockOrder);
      jest.spyOn(orderRepository, 'save').mockResolvedValue(mockOrder);
      jest.spyOn(productRepository, 'save').mockResolvedValue(mockProduct);
      jest.spyOn(orderItemRepository, 'create').mockImplementation(() => ({} as OrderItem));
      jest.spyOn(orderItemRepository, 'save').mockResolvedValue({} as OrderItem);

      const result = await service.createOrder(userId, items);
      expect(result).toEqual(OrderConstants.ORDER_CREATED(mockOrder.id));
    });

    it('should return USER_NOT_FOUND if the user does not exist', async () => {
      const userId = 1;
      const items = [{ productId: 1, quantity: 2 }];

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.createOrder(userId, items);
      expect(result).toEqual(OrderConstants.USER_NOT_FOUND);
    });

    it('should return PRODUCT_NOT_FOUND if a product does not exist', async () => {
      const userId = 1;
      const items = [{ productId: 1, quantity: 2 }];
      const mockUser = { id: userId } as User;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.createOrder(userId, items);
      expect(result).toEqual(OrderConstants.PRODUCT_NOT_FOUND);
    });

    it('should return OUT_OF_STOCK if there are out-of-stock products', async () => {
      const userId = 1;
      const items = [{ productId: 1, quantity: 2 }];
      const mockUser = { id: userId } as User;
      const mockProduct = { id: 1, stock: 1, price: 100 } as Product;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(mockProduct);

      const result = await service.createOrder(userId, items);
      expect(result).toEqual(OrderConstants.OUT_OF_STOCK([1]));
    });

    it('should return ORDER_CREATION_FAILED if saving the order fails', async () => {
      const userId = 1;
      const items = [{ productId: 1, quantity: 2 }];
      const mockUser = { id: userId } as User;
      const mockProduct = { id: 1, stock: 10, price: 100 } as Product;
      const mockOrder = { id: 1, total_cost: 200, status: 'lq' } as Order;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(mockProduct);
      jest.spyOn(orderRepository, 'create').mockReturnValue(mockOrder);
      jest.spyOn(orderRepository, 'save').mockRejectedValue(new Error('Save failed'));

      const result = await service.createOrder(userId, items);
      expect(result).toEqual(OrderConstants.ORDER_CREATION_FAILED);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      const orderId = 1;
      const mockOrder = { id: orderId, status: 'lq' } as Order;

      jest.spyOn(orderRepository, 'findOneBy').mockResolvedValue(mockOrder);
      jest.spyOn(orderRepository, 'save').mockResolvedValue({ ...mockOrder, status: 'P' });

      const result = await service.updateOrderStatus(orderId);
      expect(result).toEqual(OrderConstants.ORDER_UPDATED(orderId));
    });

    it('should return ORDER_NOT_FOUND if the order does not exist', async () => {
      const orderId = 1;

      jest.spyOn(orderRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.updateOrderStatus(orderId);
      expect(result).toEqual(OrderConstants.ORDER_NOT_FOUND);
    });

    it('should return ORDER_UPDATE_FAILED if updating the order fails', async () => {
      const orderId = 1;
      const mockOrder = { id: orderId, status: 'lq' } as Order;

      jest.spyOn(orderRepository, 'findOneBy').mockResolvedValue(mockOrder);
      jest.spyOn(orderRepository, 'save').mockRejectedValue(new Error('Save failed'));

      const result = await service.updateOrderStatus(orderId);
      expect(result).toEqual(OrderConstants.ORDER_UPDATE_FAILED);
    });
  });
});
