import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionHistory } from '@entities/transaction-history/transaction-history.entity';
import { CheckListDetail } from '@entities/check-list/check-list-detail.entity';

@Entity({ name: 'transaction_histories_check_list_details' })
export class TransactionHistoryCheckListDetail {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({
    type: 'int',
  })
  transactionHistoryId: number;
  @Column({
    type: 'int',
  })
  checkListDetailId: number;
  @Column({
    type: 'int',
  })
  qcPassQuantity: number;
  @Column({
    type: 'int',
  })
  qcRejectQuantity: number;
  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @ManyToOne(
    () => TransactionHistory,
    (transactionHistory) =>
      transactionHistory.transactionHistoryCheckListDetails,
  )
  @JoinColumn()
  transactionHistory: TransactionHistory;
  @ManyToOne(
    () => CheckListDetail,
    (checkListDetail) => checkListDetail.transactionHistoryCheckListDetails,
  )
  @JoinColumn()
  checkListDetail: CheckListDetail;
}
