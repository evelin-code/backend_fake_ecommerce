import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './../../user/entity/user';
import { OrderItem } from './order-item.entity';

@Entity('tw_orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, default: 'lq', nullable: false })
  status: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  total_cost: number;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];
}