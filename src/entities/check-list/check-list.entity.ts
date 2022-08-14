import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { QualityPoint } from '../quality-point/quality-point.entity';
import { CheckListDetail } from '../check-list/check-list-detail.entity';

export enum status {
  ACTIVE = 1,
  IN_ACTIVE = 0,
}

@Entity({ name: 'check_lists' })
export class CheckList {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description: string;

  @Column()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: status,
    default: status.IN_ACTIVE,
  })
  status: number;

  @OneToMany(() => QualityPoint, (qualityPoint) => qualityPoint.checkList)
  qualityPoints: QualityPoint[];

  @OneToMany(
    () => CheckListDetail,
    (checkListDetail) => checkListDetail.checkList,
  )
  checkListDetails: CheckList[];

  @Column({ type: 'int', nullable: true })
  createdBy: number;
}
