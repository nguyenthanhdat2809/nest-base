import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionHistory } from '@entities/transaction-history/transaction-history.entity';
import {
  TransactionHistoryLogTimeStatusEnum,
  TransactionHistoryLogTimeTypeEnum,
} from '@components/transaction-history/transaction-history.constant';
import { TransactionHistoryLogTimeAddition } from '@entities/transaction-history/transaction-history-log-time-addition.entity';

@Entity('transaction_history_log_times')
export class TransactionHistoryLogTime {
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
    type: 'timestamptz',
    nullable: true,
  })
  playTime: Date;

  @Column({
    type: 'decimal',
    precision: 30,
    scale: 2,
    nullable: true,
    default: 0,
  })
  duration: number;

  @Column({
    type: 'enum',
    enum: TransactionHistoryLogTimeStatusEnum,
    nullable: true,
  })
  status: number;

  @Column({
    type: 'enum',
    enum: TransactionHistoryLogTimeTypeEnum,
    nullable: true,
  })
  type: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  transactionHistoryId: number;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;

  @OneToOne(
    () => TransactionHistory,
    (transactionHistory) => transactionHistory.transactionHistoryLogTime,
  )
  @JoinColumn({ name: 'transaction_history_id', referencedColumnName: 'id' })
  transactionHistory: TransactionHistory;

  @OneToMany(
    () => TransactionHistoryLogTimeAddition,
    (transactionHistoryLogTimeAddition) =>
      transactionHistoryLogTimeAddition.transactionHistoryLogTime,
  )
  transactionHistoryLogTimeAddition: TransactionHistoryLogTimeAddition;
}
