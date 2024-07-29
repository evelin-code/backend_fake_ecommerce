import { Body, Controller, Post, Patch, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const { user_id, items } = createOrderDto;
    return this.orderService.createOrder(user_id, items);
  }

  @Patch(':id/status')
  async updateOrderStatus(@Param('id') id: string) {
    return this.orderService.updateOrderStatus(+id);
  }
}