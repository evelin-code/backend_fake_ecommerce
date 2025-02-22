import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsEmail } from 'class-validator';
import { Order } from './../../order/entity/order';

@Entity('tw_users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  created_at: string;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];
}
