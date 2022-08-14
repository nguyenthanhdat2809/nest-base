import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ACTION_CATEGORY_CONST } from '@components/action-category/action-category.constant';
import { ErrorReport } from '@entities/error-report/error-report.entity';
import { ErrorReportErrorDetail } from '@entities/error-report/error-report-error-detail.entity';

@Entity({ name: 'action_categories' })
export class ActionCategory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: ACTION_CATEGORY_CONST.CODE.MAX_LENGTH,
    unique: true,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: ACTION_CATEGORY_CONST.NAME.MAX_LENGTH,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: ACTION_CATEGORY_CONST.DESCRIPTION.MAX_LENGTH,
    nullable: true,
  })
  description: string;

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
  @OneToMany(
    () => ErrorReportErrorDetail,
    (errorReportErrorDetail) => errorReportErrorDetail.actionCategory,
  )
  errorReportErrorDetails: ErrorReportErrorDetail;

  @Column({ type: 'int', nullable: true })
  createdBy: number;
}
