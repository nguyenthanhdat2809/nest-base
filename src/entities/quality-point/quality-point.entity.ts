import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QualityPointUser1 } from '../quality-point-user/quality-point-user1.entity';
import { QualityPointUser2 } from '../quality-point-user/quality-point-user2.entity';
import { CheckList } from '../check-list/check-list.entity';

export enum status {
  ACTIVE = 1,
  IN_ACTIVE = 0,
}

export enum Formality {
  Fully,
  Partly,
}

export enum NumberOfTime {
  OneTimes,
  TwoTimes,
}

export type ProductType = {
  material: number;
  productPrevious: number;
};

@Entity({ name: 'quality_points' })
export class QualityPoint {
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
    type: 'int',
    nullable: true,
  })
  itemId: number;

  @Column({
    type: 'int',
  })
  stage: number;

  @Column({
    type: 'int',
  })
  checkListId: number;

  @Column({
    type: 'enum',
    enum: Formality,
  })
  formality: number;

  @Column({
    type: 'enum',
    enum: NumberOfTime,
  })
  numberOfTime: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  quantity: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  errorAcceptanceRate: number;

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

  @Column({
    type: 'json',
    nullable: true,
  })
  productType: ProductType;

  @Column({
    type: 'int',
    nullable: true,
  })
  createdBy: number;

  @OneToMany(
    () => QualityPointUser1,
    (qualityPointUser1) => qualityPointUser1.qualityPoint,
  )
  qualityPointUser1s: QualityPointUser1[];

  @OneToMany(
    () => QualityPointUser2,
    (qualityPointUser2) => qualityPointUser2.qualityPoint,
  )
  qualityPointUser2s: QualityPointUser2[];

  @ManyToOne(() => CheckList, (checkList) => checkList.qualityPoints)
  @JoinColumn()
  checkList: CheckList;
}
