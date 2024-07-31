import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { User } from './user/entity/user';
import { Order } from './order/entity/order';
import { Product } from './product/entity/product.entity';
import { OrderItem } from './order/entity/order-item.entity';
import { Pay } from './pay/entity/pay.entity';
import { PayLog } from './pay/entity/pay-log.entity';
import { PayModule } from './pay/pay.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Order, Product, OrderItem, Pay, PayLog],
    }),
    UserModule,
    OrderModule,
    ProductModule,
    PayModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}