import { BaseInterfaceRepository } from "@core/repository/base.interface.repository";
import { TransactionHistory } from "@entities/transaction-history/transaction-history.entity";
import { TransactionHistoryProduceStep } from "@entities/transaction-history/transaction-history-produce-step.entity";

export interface TransactionHistoryProduceStepRepositoryInterface
  extends BaseInterfaceRepository<TransactionHistoryProduceStep> {
  createEntity(request: any): TransactionHistoryProduceStep;
}