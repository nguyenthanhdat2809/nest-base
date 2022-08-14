import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { TransactionHistoryLogTimeAddition } from '@entities/transaction-history/transaction-history-log-time-addition.entity';

export interface TransactionHistoryLogTimeAdditionRepositoryInterface
  extends BaseInterfaceRepository<TransactionHistoryLogTimeAddition> {
  createEntity(request: any): TransactionHistoryLogTimeAddition;
}
