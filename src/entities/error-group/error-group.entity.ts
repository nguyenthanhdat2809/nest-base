import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { CheckListDetail } from '../check-list/check-list-detail.entity';
import { ErrorReportErrorDetail } from '@entities/error-report/error-report-error-detail.entity';
import { ERROR_GROUP_CONST } from '@components/error-group/error-group.constant';

@Entity({ name: 'error_groups' })
export class ErrorGroup {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', {
    length: ERROR_GROUP_CONST.CODE.MAX_LENGTH,
    unique: true,
  })
  code: string;

  @Column('varchar', {
    length: ERROR_GROUP_CONST.NAME.MAX_LENGTH,
    unique: true,
  })
  name: string;

  @Column('varchar', {
    length: ERROR_GROUP_CONST.DESCRIPTION.MAX_LENGTH,
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
    () => CheckListDetail,
    (checkListDetail) => checkListDetail.errorGroup,
  )
  checkListDetails: CheckListDetail[];

  @OneToMany(
    () => ErrorReportErrorDetail,
    (errorGroupErrorDetail) => errorGroupErrorDetail.errorGroup,
  )
  errorGroupErrorDetails: ErrorReportErrorDetail[];

  @Column({ type: 'int', nullable: true })
  createdBy: number;
}
