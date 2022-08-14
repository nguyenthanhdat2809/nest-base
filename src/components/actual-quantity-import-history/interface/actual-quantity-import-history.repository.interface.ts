import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { ActualQuantityImportHistory } from '@entities/actual-quantity-import-history/actual-quantity-import-history.entity';
import {
  TransactionHistoryIOqcTypeEnum, TransactionHistoryProduceStepTypeEnum,
  TransactionHistoryTypeEnum
} from "@components/transaction-history/transaction-history.constant";
import { GetDashboardIoQcProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-io-qc-progress-request.dto";
import { GetDashboardFinishedItemProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-finished-item-progress.request.dto";

export interface ActualQuantityImportHistoryRepositoryInterface
  extends BaseInterfaceRepository<ActualQuantityImportHistory> {
  getImportQuantityHistoriesByCreatedDate(
    request: GetDashboardIoQcProgressRequestDto,
    type: TransactionHistoryIOqcTypeEnum,
  ): Promise<any>;

  getImportQuantityHistoriesByCreatedDateForProducingSteps(
    request: GetDashboardFinishedItemProgressRequestDto,
  ): Promise<any>;
}
