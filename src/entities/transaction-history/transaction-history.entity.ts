import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  TransactionHistoryItemTypeEnum,
  TransactionHistoryTypeEnum,
} from '@components/transaction-history/transaction-history.constant';
import { TransactionHistoryCheckListDetail } from '@entities/transaction-history/transaction-history-check-list-detail.entity';
import { ErrorReport } from '@entities/error-report/error-report.entity';
import { TransactionHistoryLogTime } from '@entities/transaction-history/transaction-history-log-time.entity';
import { TransactionHistoryIOqc } from '@entities/transaction-history/transaction-history-ioqc.entity';
import { TransactionHistoryProduceStep } from '@entities/transaction-history/transaction-history-produce-step.entity';
import * as moment from 'moment';
import { now } from "moment";

export enum TransactionHistoryNumberOfTimeQc {
  theFirstTime = 1,
  theSecondTime = 2,
}

@Entity({ name: 'transaction_histories' })
export class TransactionHistory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: TransactionHistoryNumberOfTimeQc,
    nullable: true,
  })
  numberOfTimeQc: number;

  @Column({
    type: 'int',
  })
  orderId: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  warehouseId: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  itemId: number;

  @Column({
    type: 'int',
  })
  createdByUserId: number;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 50,
  })
  code: string;

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

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  qcQuantity: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  note: string;

  @Column({
    type: 'enum',
    enum: TransactionHistoryTypeEnum,
    default: TransactionHistoryTypeEnum.OutputProducingStep,
  })
  type: number;

  @Column({
    type: 'enum',
    enum: TransactionHistoryItemTypeEnum,
    nullable: true,
  })
  itemType: number;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
  })
  deletedAt: Date;

  @Column({
    type: 'int',
    nullable: true
  })
  workCenterId: number;

  @Column({
    type: 'int',
    nullable: true
  })
  previousBomId: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  consignmentName: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  qcQuantityRule: number;

  @Column({
    type: 'timestamptz',
    default: () => 'now()',
  })
  executionDateByPlan: Date;

  @Column({
    type: 'int',
    nullable: true,
  })
  qualityPointId: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  moId: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  producingStepId: number;

  @OneToMany(
    () => TransactionHistoryCheckListDetail,
    (transactionHistoryCheckListDetail) =>
      transactionHistoryCheckListDetail.transactionHistory,
  )
  transactionHistoryCheckListDetails: TransactionHistoryCheckListDetail[];

  @OneToOne(() => ErrorReport, (errorReport) => errorReport.transactionHistory)
  errorReport: ErrorReport;

  @OneToOne(
    () => TransactionHistoryLogTime,
    (logTime) => logTime.transactionHistory,
  )
  transactionHistoryLogTime: TransactionHistoryLogTime;

  @OneToOne(
    () => TransactionHistoryIOqc,
    (transactionHistoryIOqc) => transactionHistoryIOqc.transactionHistory,
  )
  transactionHistoryIOqc: TransactionHistoryIOqc;

  @OneToOne(
    () => TransactionHistoryProduceStep,
    (transactionHistoryProduceStep) =>
      transactionHistoryProduceStep.transactionHistory,
  )
  transactionHistoryProduceStep: TransactionHistoryProduceStep;
}
