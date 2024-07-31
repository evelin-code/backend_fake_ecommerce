import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('tw_transactions_log')
export class PayLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  data_out: string;

  @Column('varchar', { length: 255 })
  reference: string;

  @Column('varchar', { length: 50 })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
