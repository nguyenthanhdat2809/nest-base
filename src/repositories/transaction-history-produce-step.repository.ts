import { Inject, Injectable } from "@nestjs/common";
import { BaseAbstractRepository } from "@core/repository/base.abstract.repository";
import { TransactionHistory } from "@entities/transaction-history/transaction-history.entity";
import { TransactionHistoryRepositoryInterface } from "@components/transaction-history/interface/transaction-history.repository.interface";
import { TransactionHistoryProduceStep } from "@entities/transaction-history/transaction-history-produce-step.entity";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { QualityPlanIOqcRepositoryInterface } from "@components/quality-plan/interface/quality-plan-ioqc.repository.interface";
import { SaleServiceInterface } from "@components/sale/interface/sale.service.interface";
import { I18nService } from "nestjs-i18n";
import { TransactionHistoryProduceStepRepositoryInterface } from '@components/transaction-history/interface/transaction-history-produce-step-repository.interface';

@Injectable()
export class TransactionHistoryProduceStepRepository
  extends BaseAbstractRepository<TransactionHistoryProduceStep>
  implements TransactionHistoryProduceStepRepositoryInterface
{
  constructor(
    @InjectRepository(TransactionHistory)
    private readonly transactionHistoryProduceStepRepository: Repository<TransactionHistoryProduceStep>,

    @InjectConnection()
    private readonly connection: Connection,

    private readonly i18n: I18nService,
  ) {
    super(transactionHistoryProduceStepRepository);
  }
  createEntity(request: any): TransactionHistoryProduceStep {
    const entity = new TransactionHistoryProduceStep();
    entity.totalPlanQuantity = request.totalPlanQuantity;
    entity.inputQuantity = request.inputQuantity;
    entity.producedQuantity = request.producedQuantity;
    entity.totalImportQuantity = request.totalImportQuantity;
    entity.totalQcPassQuantity = request.totalQcPassQuantity;
    entity.totalUnQcQuantity = request.totalUnQcQuantity;
    entity.totalQcQuantity = request.totalQcQuantity;
    entity.totalQcRejectQuantity = request.totalQcRejectQuantity;
    return entity;
  }
}
