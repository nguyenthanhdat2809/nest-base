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

@Entity({ name: 'error_report_ioqc_details' })
export class ErrorReportIoqcDetail {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  errorReportId: number;

  @Column('int')
  itemId: number;

  @Column({ type: 'int', nullable: true })
  customerId: number;

  @Column('int')
  orderId: number;

  @Column('int')
  warehouseId: number;

  @Column({ type: 'timestamptz', nullable: true })
  deliveredAt: Date;

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
    () => ErrorReport,
    (errorReport) => errorReport.errorReportIoqcDetail,
  )
  @JoinColumn({ name: 'error_report_id' })
  errorReport: ErrorReport;

  @OneToOne(
    () => ErrorReportErrorList,
    (errorReportErrorList) => errorReportErrorList.errorReportIoqcDetail,
  )
  errorReportErrorList: ErrorReportErrorList;
}
