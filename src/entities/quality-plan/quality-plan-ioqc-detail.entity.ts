import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { QualityPlanIOqc } from '@entities/quality-plan/quality-plan-ioqc.entity';
import { QualityPlanIOqcQualityPointUser } from '@entities/quality-plan/quality-plan-ioqc-quality-point-user.entity';

@Entity({ name: 'quality_plan_ioqc_details' })
export class QualityPlanIOqcDetail {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  qualityPlanIOqcId: number;

  @Column('int')
  ordinalNumber: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  planErrorRate: number;

  @Column('timestamptz')
  planFrom: Date;

  @Column('timestamptz')
  planTo: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  planQcQuantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  qcPassQuantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  qcDoneQuantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  qcRejectQuantity: number;

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
    () => QualityPlanIOqc,
    (qualityPlanIOqc) => qualityPlanIOqc.qualityPlanIOqcDetails,
  )
  qualityPlanIOqc: QualityPlanIOqc;

  @OneToMany(
    () => QualityPlanIOqcQualityPointUser,
    (qualityPlanIOqcQualityPointUser) => qualityPlanIOqcQualityPointUser.qualityPlanIOqcDetail,
  )
  qualityPlanIOqcQualityPointUsers: QualityPlanIOqcQualityPointUser[];
}
