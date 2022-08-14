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
import { ErrorReportErrorList } from '@entities/error-report/error-report-error-list.entity';
import { ErrorReport } from '@entities/error-report/error-report.entity';

@Entity({ name: 'error_report_stage_details' })
export class ErrorReportStageDetail {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  errorReportId: number;

  @Column('int')
  itemId: number;

  @Column('int')
  routingId: number;

  @Column('int')
  producingStepId: number;

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
  workOrderId: number;

  @Column({ type: 'int', nullable: true })
  moId: number;

  @Column({ type: 'int', nullable: true })
  moDetailId: number;

  @OneToOne(
    () => ErrorReport,
    (errorReport) => errorReport.errorReportStageDetail,
  )
  @JoinColumn({ name: 'error_report_id' })
  errorReport: ErrorReport;

  @OneToOne(
    () => ErrorReportErrorList,
    (errorReportErrorList) => errorReportErrorList.errorReportStageDetail,
  )
  errorReportErrorList: ErrorReportErrorList;
}
