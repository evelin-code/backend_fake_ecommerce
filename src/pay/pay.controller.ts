import { Controller, Post, Param } from '@nestjs/common';
import { PayService } from './pay.service';

@Controller('pay')
export class PayController {
  constructor(private readonly payService: PayService) {}

  @Post('createTransaction/:orderId')
  async createTransaction(@Param('orderId') orderId: number): Promise<any> {
    return this.payService.createInitialTransaction(orderId);
  }
}
