import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ERROR_REPORT_CONST } from '@constant/entity.constant';
import { ErrorReportStageDetail } from '@entities/error-report/error-report-stage-detail.entity';
import { ErrorReportIoqcDetail } from '@entities/error-report/error-report-ioqc-detail.entity';
import { TransactionHistory } from '@entities/transaction-history/transaction-history.entity';

export enum ErrorReportStatus {
  Awaiting,
  Confirmed,
  Rejected,
  Completed,
}

export enum QCType {
  StageQC,
  InputQC,
  OutputQC,
}

@Entity({ name: 'error_reports' })
export class ErrorReport {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', {
    length: ERROR_REPORT_CONST.ERROR_REPORT.CODE.MAX_LENGTH,
    unique: true,
    nullable: true,
  })
  code: string;

  @Column('varchar', {
    length: ERROR_REPORT_CONST.ERROR_REPORT.NAME.MAX_LENGTH,
  })
  name: string;

  @Column('int')
  qcStageId: number;

  @Column('int')
  createdBy: number;

  @Column({
    type: 'enum',
    enum: ErrorReportStatus,
  })
  status: number;

  @Column({ type: 'int', nullable: true })
  confirmedBy: number;

  @Column({ type: 'timestamptz', nullable: true })
  confirmedAt: Date;

  @Column({ type: 'int', nullable: true })
  rejectedBy: number;

  @Column({ type: 'timestamptz', nullable: true })
  rejectedAt: Date;

  @Column({
    type: 'enum',
    enum: QCType,
    nullable: true,
  })
  reportType: number;

  @DeleteDateColumn({
    type: 'timestamptz',
  })
  deletedAt: Date;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;

  @Column({ type: 'int', nullable: true })
  transactionHistoryId: number;

  @OneToOne(
    () => ErrorReportStageDetail,

    (errorReportStageDetail) => errorReportStageDetail.errorReport,
    {
      eager: true,
      cascade: true,
    },
  )
  errorReportStageDetail: ErrorReportStageDetail;

  @OneToOne(
    () => ErrorReportIoqcDetail,
    (errorReportIoqcDetail) => errorReportIoqcDetail.errorReport,
    {
      eager: true,
      cascade: true,
    },
  )
  errorReportIoqcDetail: ErrorReportIoqcDetail;

  @OneToOne(
    () => TransactionHistory,
    (transactionHistory) => transactionHistory.errorReport,
  )
  @JoinColumn({ name: 'transaction_history_id', referencedColumnName: 'id' })
  transactionHistory: TransactionHistory;
}
