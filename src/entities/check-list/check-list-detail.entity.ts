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
import { CheckList } from '../check-list/check-list.entity';
import { ErrorGroup } from '../error-group/error-group.entity';
import { TransactionHistoryCheckListDetail } from '@entities/transaction-history/transaction-history-check-list-detail.entity';

@Entity({ name: 'check_list_details' })
export class CheckListDetail {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'int',
  })
  checkListId: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  descriptionContent: string;

  @Column({
    type: 'int',
  })
  checkType: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  norm: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  valueTop: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  valueBottom: number;

  @Column({
    type: 'int',
  })
  errorGroupId: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  itemUnitId: number;

  @Column()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => ErrorGroup, (errorGroup) => errorGroup.checkListDetails)
  @JoinColumn()
  errorGroup: ErrorGroup;

  @ManyToOne(() => CheckList, (checkList) => checkList.checkListDetails)
  @JoinColumn()
  checkList: CheckList;

  @OneToMany(
    () => TransactionHistoryCheckListDetail,
    (transactionHistoryCheckListDetail) =>
      transactionHistoryCheckListDetail.checkListDetail,
  )
  transactionHistoryCheckListDetails: TransactionHistoryCheckListDetail[];
}
