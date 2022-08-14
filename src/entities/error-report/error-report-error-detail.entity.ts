import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ErrorReportErrorList } from '@entities/error-report/error-report-error-list.entity';
import { ErrorGroup } from '@entities/error-group/error-group.entity';
import { CauseGroup } from '@entities/cause-group/cause-group.entity';
import { ActionCategory } from "@entities/action-category/action-category.entity";

@Entity({ name: 'error_report_error_details' })
export class ErrorReportErrorDetail {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  errorReportErrorListId: number;

  @Column('int')
  errorGroupId: number;

  @Column('int')
  causeGroupId: number;

  @Column({ type: 'int', nullable: true })
  actionCategoryId: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  errorItemQuantity: number;

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

  @Column({ type: 'int', nullable: true, default: 0 })
  repairItemQuantity: number;

  @ManyToOne(
    () => ErrorGroup,
    (errorGroup) => errorGroup.errorGroupErrorDetails,
  )
  @JoinColumn({ name: 'error_group_id' })
  errorGroup: ErrorGroup;

  @ManyToOne(
    () => CauseGroup,
    (causeGroup) => causeGroup.errorGroupErrorDetails,
  )
  @JoinColumn({ name: 'cause_group_id' })
  causeGroup: CauseGroup;

  @ManyToOne(
    () => ErrorReportErrorList,
    (errorReportErrorList) => errorReportErrorList.errorReportErrorDetails,
  )
  errorReportErrorList: ErrorReportErrorList;
  @ManyToOne(
    () => ActionCategory,
    (actionCategory) => actionCategory.errorReportErrorDetails,
  )
  @JoinColumn({ name: 'action_category_id' })
  actionCategory: ActionCategory;
}
