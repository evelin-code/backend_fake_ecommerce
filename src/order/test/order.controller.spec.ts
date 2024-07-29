import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './../order.controller';
import { OrderService } from './../order.service';
import { CreateOrderDto } from './../dto/create-order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderService = () => ({
    createOrder: jest.fn(),
    updateOrderStatus: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        { provide: OrderService, useValue: mockOrderService() },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  describe('createOrder', () => {
    it('should call createOrder on the service with correct parameters', async () => {
      const createOrderDto: CreateOrderDto = {
        user_id: 1,
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ],
      };
      const result = { status: 'success', orderId: 1 };
      jest.spyOn(service, 'createOrder').mockResolvedValue(result);

      expect(await controller.createOrder(createOrderDto)).toBe(result);
      expect(service.createOrder).toHaveBeenCalledWith(createOrderDto.user_id, createOrderDto.items);
    });
  });

  describe('updateOrderStatus', () => {
    it('should call updateOrderStatus on the service with the correct parameter', async () => {
      const id = '1';
      const result = { status: 'success' };
      jest.spyOn(service, 'updateOrderStatus').mockResolvedValue(result);

      expect(await controller.updateOrderStatus(id)).toBe(result);
      expect(service.updateOrderStatus).toHaveBeenCalledWith(+id);
    });
  });
});
