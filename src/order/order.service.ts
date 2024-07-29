import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './../user/entity/user';
import { Product } from './../product/entity/product.entity';
import { Order } from './entity/order';
import { OrderItem } from './entity/order-item.entity';
import { OrderConstants } from './config/order.constants';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrder(userId: number, items: { productId: number; quantity: number }[]): Promise<any> {
    try {
      const user = await this.findUserById(userId);
      if (!user) return OrderConstants.USER_NOT_FOUND;

      const stockCheckResult = await this.checkStockAvailability(items);
      if (!stockCheckResult.result) return stockCheckResult.response;

      const savedOrder = await this.createOrderEntity(user);
      const { totalCost, orderItemsResult } = await this.processOrderItems(items, savedOrder);

      if (!orderItemsResult) return OrderConstants.ORDER_CREATION_FAILED;

      savedOrder.total_cost = totalCost;
      await this.orderRepository.save(savedOrder);

      return OrderConstants.ORDER_CREATED(savedOrder.id);
    } catch (error) {
      return OrderConstants.ORDER_CREATION_FAILED;
    }
  }

  private async findUserById(userId: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id: userId });
  }

  private async createOrderEntity(user: User): Promise<Order> {
    const order = this.orderRepository.create({
      user,
      status: 'lq',
      total_cost: 0,
    });
    return this.orderRepository.save(order);
  }

  private async checkStockAvailability(items: { productId: number; quantity: number }[]): Promise<{ result: boolean, response: any }> {
    const outOfStockProducts = [];

    for (const { productId, quantity } of items) {
      const product = await this.productRepository.findOneBy({ id: productId });
      if (!product) return { result: false, response: OrderConstants.PRODUCT_NOT_FOUND };
      if (product.stock < quantity) outOfStockProducts.push(productId);
    }

    if (outOfStockProducts.length > 0) {
      return { 
        result: false, 
        response: OrderConstants.OUT_OF_STOCK(outOfStockProducts)
      };
    }

    return { result: true, response: null };
  }

  private async processOrderItems(items: { productId: number; quantity: number }[], order: Order): Promise<{ totalCost: number, orderItemsResult: boolean }> {
    let totalCost = 0;

    for (const { productId, quantity } of items) {
      const product = await this.productRepository.findOneBy({ id: productId });
      if (!product || product.stock < quantity) return { totalCost, orderItemsResult: false };

      await this.saveOrderItem(order, product, quantity);
      totalCost += product.price * quantity;
      product.stock -= quantity;
      await this.productRepository.save(product);
    }

    return { totalCost, orderItemsResult: true };
  }

  private async saveOrderItem(order: Order, product: Product, quantity: number): Promise<void> {
    const orderItem = this.orderItemRepository.create({
      quantity,
      product,
      order,
    });
    await this.orderItemRepository.save(orderItem);
  }

  async updateOrderStatus(orderId: number): Promise<any> {
    try {
      const order = await this.orderRepository.findOneBy({ id: orderId });
      if (!order) return OrderConstants.ORDER_NOT_FOUND;

      order.status = 'P';
      await this.orderRepository.save(order);

      return OrderConstants.ORDER_UPDATED(orderId);
    } catch (error) {
      return OrderConstants.ORDER_UPDATE_FAILED;
    }
  }
}