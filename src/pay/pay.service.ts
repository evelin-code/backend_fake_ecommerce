import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pay } from './entity/pay.entity';
import { User } from './../user/entity/user';
import { Order } from './../order/entity/order'; 
import { PayConstants, ErrorConstants } from './config/pay.constants';
import { Keys } from './config/gateway-keys.constants';
import { Urls } from './config/gateway-urls.constants';
import axios from 'axios';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PayService {
  
  constructor(
    @InjectRepository(Pay)
    private readonly payRepository: Repository<Pay>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createTransaction(orderId: number): Promise<any> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
  
    if (!order) {
      return PayConstants.ORDER_NOT_FOUND;
    }
  
    try {
      const transaction = new Pay();
      transaction.total_cost = order.total_cost;
      transaction.status = 0; // 0 para pendiente
      transaction.order_id = orderId;
  
      const uniqueReference = `eve${uuidv4()}`;
      transaction.reference = uniqueReference;
  
      const savedTransaction = await this.payRepository.save(transaction);
  
      return PayConstants.TRANSACTION_CREATED(savedTransaction.id, savedTransaction.reference);
    } catch (error) {
      return PayConstants.TRANSACTION_CREATION_FAILED;
    }
  }

  async getAcceptanceToken(): Promise<any> {
    try {
      const url = Urls.URL_ACCEPTANCE_TOKEN + Keys.PUBLIC_KEY;
      const response = await axios.get(url);
      
      const { acceptance_token, permalink } = response.data.data.presigned_acceptance;
      return { acceptance_token, permalink };
    } catch {
      return PayConstants.REQUEST_ACCEPTANCE_TOKEN_FAILED;
    }
  }

  async tokenizeCard(cardDetails: { number: string, cvc: string, exp_month: string, exp_year: string, card_holder: string }): Promise<any> {
    try {
      const response = await axios.post(Urls.URL_TOKENIZE_CARD, cardDetails, {
        headers: {
          Authorization: `Bearer ${Keys.PUBLIC_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const { id } = response.data.data;
      return { id };
    } catch {
      return PayConstants.CARD_TOKENIZATION_FAILED;
    }
  }

  async createGatewayTransaction(data: { reference: string, installments: number, acceptance_token: string, id_tokenizacion: string }): Promise<any> {
    const { reference, installments, acceptance_token, id_tokenizacion } = data;

    const transaction = await this.payRepository.findOne({
      where: { reference },
      relations: ['order', 'order.user'],
    });

    if (!transaction || !transaction.order) {
      return PayConstants.ORDER_NOT_FOUND;
    }

    const order = transaction.order;

    if (!order.user) {
      return PayConstants.ORDER_NOT_FOUND;
    }

    const user = await this.userRepository.findOne({
      where: { id: order.user.id },
    });

    if (!user) {
      return PayConstants.ORDER_NOT_FOUND;
    }

    const totalInCents = order.total_cost * 100;
    const currency = 'COP';
    const signature = this.generateSignature(reference, totalInCents, currency);

    const url = Urls.URL_CREATE_TRANSACTION;

    try {
      const response = await axios.post(url, {
        acceptance_token,
        amount_in_cents: totalInCents,
        currency,
        signature,
        customer_email: user.email,
        reference,
        payment_method: {
          type: 'CARD',
          installments,
          token: id_tokenizacion,
          sandbox_status: 'APPROVED',
        },
      }, {
        headers: {
          'Authorization': `Bearer ${Keys.PUBLIC_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const responseData = response.data;

      if (responseData && responseData.data && responseData.data.id) {
        return { id: responseData.data.id };
      }

      return responseData;
    } catch (error) {
      return this.handleAxiosError(error);
    }
  }

  private generateSignature(reference: string, amountInCents: number, currency: string): string {
    const integrityKey = Keys.INTEGRITY_KEY;
    const cadenaConcatenada = `${reference}${amountInCents}${currency}${integrityKey}`;
  
    const hash = createHash('sha256');
    hash.update(cadenaConcatenada);
  
    return hash.digest('hex');
  }

  private handleAxiosError(error: any): any {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 422 && data.error && data.error.messages) {
        return {
          ...ErrorConstants.VALIDATION_ERROR,
          details: data.error.messages,
        };
      }

      if (status >= 400 && status < 500) {
        return {
          ...ErrorConstants.CLIENT_ERROR,
          message: data.message || ErrorConstants.CLIENT_ERROR.message,
        };
      }

      if (status >= 500) {
        return ErrorConstants.SERVER_ERROR;
      }
    } else if (error.request) {
      return ErrorConstants.NO_RESPONSE;
    } else {
      return {
        ...ErrorConstants.REQUEST_SETUP_ERROR,
        message: `${ErrorConstants.REQUEST_SETUP_ERROR.message}: ${error.message}`,
      };
    }

    return ErrorConstants.CREATE_GATEWAY_TRANSACTION_FAILED;
  }
}
