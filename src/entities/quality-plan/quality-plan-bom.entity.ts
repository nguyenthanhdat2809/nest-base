import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { QualityPlanDetail } from '@entities/quality-plan/quality-plan-detail.entity';
import { QualityPlanBomQualityPointUser } from '@entities/quality-plan/quality-plan-bom-quality-point-user.entity';

@Entity({ name: 'quality_plan_boms' })
export class QualityPlanBom {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  qualityPlanDetailId: number;

  @Column({
    type:'int',
    nullable: true,
  })
  workOrderId: number;

  @Column({type:'int'})
  bomId: number;

  @Column('int')
  producingStepId: number;

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
  planErrorRate: number;

  @Column({ type: 'int', default: 0 })
  planQcQuantity: number;

  @Column({ type: 'varchar' })
  keyBomTree: string;

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
    () => QualityPlanDetail,
    (qualityPlanDetail) => qualityPlanDetail.qualityPlanBoms,
  )
  @JoinColumn()
  qualityPlanDetail: QualityPlanDetail;

  @OneToMany(
    () => QualityPlanBomQualityPointUser,
    (qualityPlanBomQualityPointUser) => qualityPlanBomQualityPointUser.qualityPlanBom,
  )
  qualityPlanBomQualityPointUsers: QualityPlanBomQualityPointUser[];
}
