import { ResponsePayload } from '@utils/response-payload';
import {
  TransactionHistoryIOqcTypeEnum, TransactionHistoryProduceStepTypeEnum,
  TransactionHistoryTypeEnum
} from "@components/transaction-history/transaction-history.constant";
import { GetDashboardIoQcProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-io-qc-progress-request.dto";
import { CreateActualQuantityProduceStepsImportHistoryRequestDto } from "@components/actual-quantity-import-history/dto/request/create-actual-quantity-produce-steps-import-history.request.dto";
import { GetDashboardFinishedItemProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-finished-item-progress.request.dto";

export interface ActualQuantityImportHistoryServiceInterface {
  getImportQuantityHistoriesByCreatedDate(
    request: GetDashboardIoQcProgressRequestDto,
    type: TransactionHistoryIOqcTypeEnum,
  ): Promise<any>;
  createActualQuantityProduceStepsImportHistory(
    request: CreateActualQuantityProduceStepsImportHistoryRequestDto,
  ): Promise<any>;
  
  getImportQuantityHistoriesByCreatedDateForProducingSteps(
    request: GetDashboardFinishedItemProgressRequestDto,
  ): Promise<any>
}
