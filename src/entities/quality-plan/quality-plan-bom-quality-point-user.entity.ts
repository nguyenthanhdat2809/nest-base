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
import { QualityPlanBom } from '@entities/quality-plan/quality-plan-bom.entity';

export enum userStageNumberOfTimeQc {
  theFirstTime = 1,
  theSecondTime = 2,
}

@Entity({ name: 'quality_plan_bom_quality_point_users' })
export class QualityPlanBomQualityPointUser {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  qualityPlanBomId: number;

  @Column('int')
  userId: number;

  @Column({
    type: 'enum',
    enum: userStageNumberOfTimeQc,
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
    () => QualityPlanBom,
    (qualityPlanBom) => qualityPlanBom.qualityPlanBomQualityPointUsers,
  )
  @JoinColumn()
  qualityPlanBom: QualityPlanBom;
}
