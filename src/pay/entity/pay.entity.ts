import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Order } from 'src/order/entity/order';

@Entity('tw_transactions')
export class Pay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 250, unique: true })
  reference: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total_cost: number;

  @Column({ type: 'int' })
  status: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  payment_method: string | null;

  @Column({ type: 'timestamp', nullable: true })
  payment_date: Date | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  franchise: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bank: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cus: string | null;

  @Column({ type: 'int', nullable: false })
  order_id: number;

  @OneToOne(() => Order, order => order.transaction)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
