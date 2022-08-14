import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { QualityPlan } from '@entities/quality-plan/quality-plan.entity';
import { QualityPlanBom } from '@entities/quality-plan/quality-plan-bom.entity';

@Entity({ name: 'quality_plan_details' })
export class QualityPlanDetail {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  qualityPlanId: number;

  @Column('int')
  moId: number;

  @Column('int')
  moPlanId: number;

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

  @OneToOne(() => QualityPlan, (qualityPlan) => qualityPlan.qualityPlanDetail)
  @JoinColumn()
  qualityPlan: QualityPlan;

  @OneToMany(
    () => QualityPlanBom,
    (qualityPlanBom) => qualityPlanBom.qualityPlanDetail,
  )
  qualityPlanBoms: QualityPlanBom[];
}
