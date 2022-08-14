import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'actual_quantity_import_histories' })
export class ActualQuantityImportHistory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  qcStageId: number;

  @Column('int')
  orderId: number;

  @Column({ type: 'int', nullable: true })
  warehouseId: number;

  @Column({ type: 'int', nullable: true })
  itemId: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  actualQuantity: number;

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
  moId: number;

  @Column({ type: 'int', nullable: true })
  producingStepId: number;
}
