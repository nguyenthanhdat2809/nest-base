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
import { QualityPlan } from '@entities/quality-plan/quality-plan.entity';
import { QualityPlanIOqcDetail } from '@entities/quality-plan/quality-plan-ioqc-detail.entity';

export enum QcCheck {
  unChecked,
  checked
}

@Entity({ name: 'quality_plan_ioqcs' })
export class QualityPlanIOqc {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  qualityPlanId: number;

  @Column('int')
  orderId: number;

  @Column('int')
  warehouseId: number;

  @Column('int')
  itemId: number;

  @Column('int')
  qualityPointId: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  actualQuantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  planQuantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  qcRejectQuantity: number;

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
  errorQuantity: number;

  @Column({ type: 'enum', enum: QcCheck })
  qcCheck: number;

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
    () => QualityPlan,
    (qualityPlan) => qualityPlan.qualityPlanIOqcs,
  )
  qualityPlan: QualityPlan;

  @OneToMany(
    () => QualityPlanIOqcDetail,
    (qualityPlanIOqcDetail) => qualityPlanIOqcDetail.qualityPlanIOqc,
  )
  qualityPlanIOqcDetails: QualityPlanIOqcDetail[];
}
