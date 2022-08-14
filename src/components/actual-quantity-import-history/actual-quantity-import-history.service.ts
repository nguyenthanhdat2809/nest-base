import { Inject, Injectable } from "@nestjs/common";
import { ResponseCodeEnum } from "@constant/response-code.enum";
import { ResponseBuilder } from "@utils/response-builder";
import { I18nService } from "nestjs-i18n";
import { ActualQuantityImportHistoryServiceInterface } from "@components/actual-quantity-import-history/interface/actual-quantity-import-history.service.interface";
import { ActualQuantityImportHistoryRepositoryInterface } from "@components/actual-quantity-import-history/interface/actual-quantity-import-history.repository.interface";
import {
  TransactionHistoryIOqcTypeEnum,
  TransactionHistoryProduceStepTypeEnum
} from "@components/transaction-history/transaction-history.constant";
import { GetDashboardIoQcProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-io-qc-progress-request.dto";
import { CreateActualQuantityProduceStepsImportHistoryRequestDto } from "@components/actual-quantity-import-history/dto/request/create-actual-quantity-produce-steps-import-history.request.dto";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection } from "typeorm";
import { GetDashboardFinishedItemProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-finished-item-progress.request.dto";
import { TransactionHistoryProduceStep } from "@entities/transaction-history/transaction-history-produce-step.entity";

@Injectable()
export class ActualQuantityImportHistoryService
  implements ActualQuantityImportHistoryServiceInterface
{
  constructor(
    @Inject('ActualQuantityImportHistoryRepositoryInterface')
    private readonly actualQuantityImportHistoryRepository: ActualQuantityImportHistoryRepositoryInterface,

    private readonly i18n: I18nService,

    @InjectConnection()
    private readonly connection: Connection,
  ) {}
  public async getImportQuantityHistoriesByCreatedDate(
    request: GetDashboardIoQcProgressRequestDto,
    type: TransactionHistoryIOqcTypeEnum,
  ): Promise<any> {
    const result =
      await this.actualQuantityImportHistoryRepository.getImportQuantityHistoriesByCreatedDate(
        request,
        type,
      );
    return result;
  }

  public async getImportQuantityHistoriesByCreatedDateForProducingSteps(
    request: GetDashboardFinishedItemProgressRequestDto,
  ): Promise<any> {
    const result =
      await this.actualQuantityImportHistoryRepository.getImportQuantityHistoriesByCreatedDateForProducingSteps(
        request,
      );
    return result;
  }

  public async createActualQuantityProduceStepsImportHistory(
    request: CreateActualQuantityProduceStepsImportHistoryRequestDto,
  ): Promise<any> {
    const queryRunner = this.connection.createQueryRunner();
    try {
      const entity =
        this.actualQuantityImportHistoryRepository.createEntity(request);
      await queryRunner.manager.save(entity);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();
    } catch (error) {
      console.log(error);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CANNOT_CREATE'))
        .build();
    }
  }
}
