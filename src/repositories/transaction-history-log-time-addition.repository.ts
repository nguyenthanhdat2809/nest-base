import { Injectable } from "@nestjs/common";
import { BaseAbstractRepository } from "@core/repository/base.abstract.repository";
import { TransactionHistoryLogTime } from "@entities/transaction-history/transaction-history-log-time.entity";
import { TransactionHistoryLogTimeRepositoryInterface } from "@components/transaction-history/interface/transaction-history-log-time.repository.interface";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { TransactionHistoryLogTimeAddition } from "@entities/transaction-history/transaction-history-log-time-addition.entity";
import { TransactionHistoryLogTimeAdditionRepositoryInterface } from "@components/transaction-history/interface/transaction-history-log-time-addition-repository.interface";

@Injectable()
export class TransactionHistoryLogTimeAdditionRepository
  extends BaseAbstractRepository<TransactionHistoryLogTimeAddition>
  implements TransactionHistoryLogTimeAdditionRepositoryInterface
{
  constructor(
    @InjectRepository(TransactionHistoryLogTimeAddition)
    private readonly transactionHistoryLogTimeDetailRepository: Repository<TransactionHistoryLogTimeAddition>,

    @InjectConnection()
    private readonly connection: Connection,
  ) {
    super(transactionHistoryLogTimeDetailRepository);
  }

  createEntity(request: any): TransactionHistoryLogTimeAddition {
    const entity = new TransactionHistoryLogTimeAddition();
    entity.startTime = request.startTime;
    entity.endTime = request.endTime;
    entity.duration = request.duration;
    entity.transactionHistoryLogTimeId = request.transactionHistoryLogTimeId;
    return entity;
  }
}