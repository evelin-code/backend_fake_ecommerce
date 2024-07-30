import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './entity/order';
import { OrderItem } from './entity/order-item.entity';
import { User } from './../user/entity/user';
import { Product } from './../product/entity/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, User, Product]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})

export class OrderModule {}