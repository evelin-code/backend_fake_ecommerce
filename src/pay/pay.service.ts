import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pay } from './entity/pay.entity';
import { Order } from './../order/entity/order'; 
import { PayConstants } from './config/pay.constants';

@Injectable()
export class PayService {
  
  constructor(
    @InjectRepository(Pay)
    private readonly payRepository: Repository<Pay>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createInitialTransaction(orderId: number): Promise<any> {
    const order = await this.orderRepository.findOneBy({ id: orderId });

    if (!order) {
      return PayConstants.ORDER_NOT_FOUND;
    }

    try {
      const transaction = new Pay();
      transaction.total_cost = order.total_cost;
      transaction.status = 0; // 0 para pendiente
      transaction.order_id = orderId;

      const savedTransaction = await this.payRepository.save(transaction);

      savedTransaction.reference = savedTransaction.id.toString();
      await this.payRepository.save(savedTransaction);

      return PayConstants.TRANSACTION_CREATED(savedTransaction.id, savedTransaction.reference);
    } catch (error) {
      return PayConstants.TRANSACTION_CREATION_FAILED;
    }
  }
}
