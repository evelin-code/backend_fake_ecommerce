import { IsArray, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  user_id: number;

  @IsArray()
  items: { productId: number; quantity: number }[];
}
