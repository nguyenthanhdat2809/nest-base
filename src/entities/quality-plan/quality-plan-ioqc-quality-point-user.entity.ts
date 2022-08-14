import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QualityPlanIOqcDetail } from '@entities/quality-plan/quality-plan-ioqc-detail.entity';

export enum userIOqcNumberOfTimeQc {
  theFirstTime = 1,
  theSecondTime = 2,
}


@Entity({ name: 'quality_plan_ioqc_quality_point_users' })
export class QualityPlanIOqcQualityPointUser {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  qualityPlanIOqcDetailId: number;

  @Column('int')
  userId: number;

  @Column({
    type: 'enum',
    enum: userIOqcNumberOfTimeQc,
    nullable: true,
  })
  numberOfTimeQc: number;

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

  @ManyToOne(
    () => QualityPlanIOqcDetail,
    (qualityPlanIOqcDetail) => qualityPlanIOqcDetail.qualityPlanIOqcQualityPointUsers,
  )
  @JoinColumn()
  qualityPlanIOqcDetail: QualityPlanIOqcDetail;
}
