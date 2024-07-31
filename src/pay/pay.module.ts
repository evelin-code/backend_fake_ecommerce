import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pay } from './entity/pay.entity';
import { PayService } from './pay.service';
import { PayController } from './pay.controller';
import { Order } from '../order/entity/order';
import { OrderModule } from './../order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pay, Order]),
    OrderModule,
  ],
  providers: [PayService],
  controllers: [PayController],
})
export class PayModule {}
