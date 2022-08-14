import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { TransactionHistory } from '@entities/transaction-history/transaction-history.entity';
import { TransactionHistoryLogTime } from '@entities/transaction-history/transaction-history-log-time.entity';

export interface TransactionHistoryLogTimeRepositoryInterface
  extends BaseInterfaceRepository<TransactionHistoryLogTime> {
  createEntity(request: any): TransactionHistoryLogTime;
  getProduceStepQcLogTimeDetail(id: number): Promise<any>;
  getNotFinishedQcLogTime(): Promise<any>;
}
