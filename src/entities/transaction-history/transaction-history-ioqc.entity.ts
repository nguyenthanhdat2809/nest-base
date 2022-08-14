import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { TransactionHistory } from '@entities/transaction-history/transaction-history.entity';

@Entity({ name: 'transaction_histories_ioqcs' })
export class TransactionHistoryIOqc {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  transactionHistoryId: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  planQuantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  qcNeedQuantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  qcDoneQuantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  qcPassQuantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  qcRejectQuantity: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @OneToOne(() => TransactionHistory, (transactionHistory) => transactionHistory.transactionHistoryIOqc)
  @JoinColumn()
  transactionHistory: TransactionHistory;
}
