import { Controller, Post, Param, Get, Body } from '@nestjs/common';
import { PayService } from './pay.service';

@Controller('pay')
export class PayController {
  constructor(private readonly payService: PayService) {}

  @Post('createTransaction/:orderId')
  async createTransaction(@Param('orderId') orderId: number): Promise<any> {
    return this.payService.createTransaction(orderId);
  }

  @Get('getAcceptanceToken')
  async getAcceptanceToken(): Promise<any> {
    return this.payService.getAcceptanceToken();
  }

  @Post('tokenizeCard')
  async tokenizeCard(@Body() cardDetails: { number: string, cvc: string, exp_month: string, exp_year: string, card_holder: string }): Promise<any> {
    return this.payService.tokenizeCard(cardDetails);
  }

  @Post('createGatewayTransaction')
  async createGatewayTransaction(@Body() data: { reference: string, installments: number, acceptance_token: string, id_tokenizacion: string }): Promise<any> {
    return this.payService.createGatewayTransaction(data);
  }
}
