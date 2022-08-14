import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ErrorReportErrorDetail } from '@entities/error-report/error-report-error-detail.entity';
import { CAUSE_GROUP_CONST } from '@components/cause-group/cause-group.constant';

@Entity({ name: 'cause_groups' })
export class CauseGroup {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', {
    length: CAUSE_GROUP_CONST.CODE.MAX_LENGTH,
    unique: true,
  })
  code: string;

  @Column('varchar', {
    length: CAUSE_GROUP_CONST.NAME.MAX_LENGTH,
    unique: true,
  })
  name: string;

  @Column('varchar', {
    length: CAUSE_GROUP_CONST.DESCRIPTION.MAX_LENGTH,
  })
  description: string;

  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
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
    (errorGroupErrorDetail) => errorGroupErrorDetail.causeGroup,
  )
  errorGroupErrorDetails: ErrorReportErrorDetail[];

  @Column({ type: 'int', nullable: true })
  createdBy: number;
}
