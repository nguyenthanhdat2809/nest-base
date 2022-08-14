import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany, OneToOne,
} from 'typeorm';
import { QualityPlanDetail } from '@entities/quality-plan/quality-plan-detail.entity';
import { QualityPlanIOqc } from '@entities/quality-plan/quality-plan-ioqc.entity';

export enum QCPlanStatus {
  Awaiting,
  Confirmed,
  InProgress,
  Completed,
}

export enum TypeQualityPlan {
  OP = 1,
  INPUT = 2,
  OUTPUT = 3,
}

export const STATUS_TO_CONFIRM_QUALITY_PLAN: number[] = [
  QCPlanStatus.Awaiting,
  QCPlanStatus.Confirmed,
  QCPlanStatus.InProgress,
  QCPlanStatus.Completed,
];

@Entity({ name: 'quality_plans' })
export class QualityPlan {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description: string;

  @Column('int')
  qcStageId: number;

  @Column({
    type: 'enum',
    enum: TypeQualityPlan,
  })
  type: number;

  @Column({
    type: 'enum',
    enum: QCPlanStatus,
  })
  status: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  createdBy: number;

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
    () => QualityPlanDetail,
    (qualityPlanDetail) => qualityPlanDetail.qualityPlan,
  )
  qualityPlanDetail: QualityPlanDetail;

  @OneToMany(
    () => QualityPlanIOqc,
    (qualityPlanIOqc) => qualityPlanIOqc.qualityPlan,
  )
  qualityPlanIOqcs: QualityPlanIOqc[];
}
