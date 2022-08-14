import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ErrorReportStageDetail } from '@entities/error-report/error-report-stage-detail.entity';
import { ErrorReportIoqcDetail } from '@entities/error-report/error-report-ioqc-detail.entity';
import { ErrorReportErrorDetail } from '@entities/error-report/error-report-error-detail.entity';
import { ERROR_REPORT_CONST } from '@constant/entity.constant';

export enum Priority {
  Low = 1,
  Medium,
  High,
}

@Entity({ name: 'error_report_error_lists' })
export class ErrorReportErrorList {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  errorReportStageDetailId: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  errorReportIoqcDetailId: number;

  @Column('int')
  assignedTo: number;

  @Column({
    type: 'varchar',
    length:
      ERROR_REPORT_CONST.ERROR_REPORT_ERROR_LIST.ERROR_DESCRIPTION.MAX_LENGTH,
  })
  errorDescription: string;

  @Column({ type: 'enum', enum: Priority })
  priority: number;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  repairDeadline: Date;

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

  @OneToOne(
    () => ErrorReportStageDetail,
    (errorReportStageDetail) => errorReportStageDetail.errorReportErrorList,
  )
  @JoinColumn({ name: 'error_report_stage_detail_id' })
  errorReportStageDetail: ErrorReportStageDetail;

  @OneToOne(
    () => ErrorReportIoqcDetail,
    (errorReportIoqcDetail) => errorReportIoqcDetail.errorReportErrorList,
  )
  @JoinColumn({ name: 'error_report_ioqc_detail_id' })
  errorReportIoqcDetail: ErrorReportIoqcDetail;

  @OneToMany(
    () => ErrorReportErrorDetail,
    (errorReportErrorDetail) => errorReportErrorDetail.errorReportErrorList,
  )
  errorReportErrorDetails: ErrorReportErrorDetail[];
}
