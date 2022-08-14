import { GetDashboardFinishedItemProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-finished-item-progress.request.dto";
import { GetProduceStepsByMoAndItemRequestDto } from "@components/dashboard/dto/request/get-produce-steps-by-mo-and-item.request.dto";
import { GetDashboardIoQcProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-io-qc-progress-request.dto";
import { TransactionHistoryIOqcTypeEnum } from "@components/transaction-history/transaction-history.constant";
import { GetDashboardOverallQcProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-overall-qc-progress.request.dto";
import { GetDashboardErrorRequestDto } from '@components/dashboard/dto/request/get-dashboard-error.request.dto';

export interface DashboardServiceInterface {
  getDashboardProducingStepQCProgress(
    request: GetDashboardFinishedItemProgressRequestDto,
  ): Promise<any>;
  getInProgressMoList(): Promise<any>;
  getItemsByMo(id: number): Promise<any>;
  getProduceStepsByMoAndItem(
    request: GetProduceStepsByMoAndItemRequestDto,
  ): Promise<any>;
  getDashboardIOQcProgress(
    request: GetDashboardIoQcProgressRequestDto,
    type: TransactionHistoryIOqcTypeEnum,
  ): Promise<any>;
  getDashboardOverallProgress(
    request: GetDashboardOverallQcProgressRequestDto,
  ): Promise<any>;
  getDashboardSummary(): Promise<any>;
  getDashboardByErrorType(request: GetDashboardErrorRequestDto): Promise<any>;
  getDashboardByCauseGroup(request: GetDashboardErrorRequestDto): Promise<any>;
  getDashboardByStatus(request: GetDashboardErrorRequestDto): Promise<any>;
  getDashboardByActionCategory(
    request: GetDashboardErrorRequestDto,
  ): Promise<any>;
}
