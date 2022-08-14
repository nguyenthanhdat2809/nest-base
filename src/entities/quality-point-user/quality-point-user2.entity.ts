import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { QualityPoint } from '../quality-point/quality-point.entity';

@Entity({ name: 'quality_point_user2s' })
export class QualityPointUser2 {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'int',
  })
  qualityPointId: number;

  @Column({
    type: 'int',
  })
  userId: number;

  @Column()
  @UpdateDateColumn({type: 'timestamptz'})
  updatedAt: Date;

  @Column()
  @CreateDateColumn({type: 'timestamptz'})
  createdAt: Date;

  @ManyToOne(
    () => QualityPoint,
    (qualityPoint) => qualityPoint.qualityPointUser2s,
  )
  @JoinColumn()
  qualityPoint: QualityPoint;
}
