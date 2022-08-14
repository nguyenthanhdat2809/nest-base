import {
  Column, CreateDateColumn,
  Entity,
  JoinColumn, ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { TransactionHistoryLogTime } from '@entities/transaction-history/transaction-history-log-time.entity';

@Entity('transaction_history_log_time_additions')
export class TransactionHistoryLogTimeAddition {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  startTime: Date;
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  endTime: Date;
  @Column({
    type: 'decimal',
    scale: 2,
    precision: 30,
    nullable: true,
    default: 0,
  })
  duration: number;
  @Column({ type: 'int', nullable: true })
  transactionHistoryLogTimeId: number;
  @ManyToOne(
    () => TransactionHistoryLogTime,
    (transactionHistoryLogTime) =>
      transactionHistoryLogTime.transactionHistoryLogTimeAddition,
  )
  @JoinColumn({
    name: 'transaction_history_log_time_id',
    referencedColumnName: 'id',
  })
  transactionHistoryLogTime: TransactionHistoryLogTime;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;
}
