import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'work_center_plan_qc_shifts' })
export class WorkCenterPlanQcShift {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  workOrderId: number;

  @Column('int')
  workCenterId: number;

  @Column('timestamptz')
  executionDay: Date;

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
  actualQuantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  moderationQuantity: number;

  @Column('int')
  numberOfShift: number;

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

  @Column({ type: 'int', nullable: true })
  createdBy: number;
}
