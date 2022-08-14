import { ProducingStepsTransactionHistoryDetailRequestDto } from '@components/transaction-history/dto/request/producing-steps-transaction-history-detail.request.dto';
import { GetWOSummaryScanRequestDto } from '@components/transaction-history/dto/request/get-wo-summary-scan-request.dto';
import { ErrorReportStageDetail } from '@entities/error-report/error-report-stage-detail.entity';
import { GetProducingStepDetailRequestDto } from '@components/produce/dto/request/get-producing-step-detail.request.dto';
import { UpdateWOQcQuantityRequestDto } from '@components/produce/dto/request/update-wo-qc-quantity.request.dto';
import { GetMoListRequestDto } from '@components/produce/dto/request/get-mo-list-request.dto';
import { GetPlanItemMoListRequestDto } from '@components/produce/dto/request/get-plan-item-mo-list-request.dto';
import { GetMoItemDetailRequestDto } from '@components/produce/dto/request/get-mo-item-detail-request.dto';
import { WOPrintQrcodeRequestDto } from '@components/work-order/dto/request/wo-print-qr-code.request.dto';
import { GetDashboardFinishedItemProgressRequestDto } from '@components/dashboard/dto/request/get-dashboard-finished-item-progress.request.dto';
import { Filter } from '@utils/pagination.query';
import { GetWoListRequestDto } from '@components/work-order/dto/request/get-wo-list.request.dto';
import { UpdateWoMaterialInputQcQuantityRequestDto } from '@components/produce/dto/request/update-wo-material-input-qc-quantity.request.dto';
import { UpdateWoPreviousBomInputQcQuantityRequestDto } from '@components/produce/dto/request/update-wo-previous-bom-input-qc-quantity.request.dto';
import { GetProduceStepsByMoAndItemRequestDto } from "@components/dashboard/dto/request/get-produce-steps-by-mo-and-item.request.dto";

export interface ProduceServiceInterface {
  getListProducingStepsQC(request: any): Promise<any>;
  getListProducingStepsQCDetail(
    payload: ProducingStepsTransactionHistoryDetailRequestDto,
  ): Promise<any>;
  getWorkOrderById(id: number): Promise<any>;
  getWorkOrderByQrCode(request: GetWOSummaryScanRequestDto): Promise<any>;
  getProduceStepByID(id: number): Promise<any>;
  getProduceErrorReportStageDetail(
    errorReportStageDetail: ErrorReportStageDetail,
  ): Promise<any>;
  getProduceStepById(request: GetProducingStepDetailRequestDto): Promise<any>;
  updateWOQcQuantity(request: UpdateWOQcQuantityRequestDto): Promise<any>;
  getAvailableMos(): Promise<any>;
  getConfirmedPlansByMoId(boqId: number): Promise<any>;
  getMoDetail(id: number): Promise<any>;
  getMoPlanDetail(moPlanId: number): Promise<any>;
  getMoList(request: GetMoListRequestDto): Promise<any>;
  getPlanItemMoList(request: GetPlanItemMoListRequestDto): Promise<any>;
  getMoItemDetail(request: GetMoItemDetailRequestDto): Promise<any>;
  getAvailableBoqsForQCHistory(): Promise<any>;
  getBomDetailById(id: number): Promise<any>;
  printWOQrCode(request: WOPrintQrcodeRequestDto): Promise<any>;
  getWorkOrderByIds(ids: number[]): Promise<any>;
  getDashboardProducingStepQCProgress(
    request: GetDashboardFinishedItemProgressRequestDto,
  ): Promise<any>;
  getWorkOrderByMoId(filter: Filter[]): Promise<any>;
  getWorkOrderByKw(keyword: string): Promise<any>;
  getWorkOrderList(request: GetWoListRequestDto): Promise<any>;
  updateMaterialQuantityToRepairError(param: any): Promise<any>;
  qualityPlanGetListWorkCenterSchedule(id: number): Promise<any>;
  qualityPlanGetWorkCenterScheduleDetail(payload: any): Promise<any>;
  workOrderDetail(id: number): Promise<any>;
  updateWoMaterialQcQuantity(
    request: UpdateWoMaterialInputQcQuantityRequestDto,
  ): Promise<any>;
  qualityPlanGetWorkCenterScheduleDetail(
    payload: any
  ): Promise<any>;
  workOrderDetail(id: number): Promise<any>;
  workCenterDetail(id: number): Promise<any>;
  updateWoPreviousBomQcQuantity(
    request: UpdateWoPreviousBomInputQcQuantityRequestDto,
  ): Promise<any>;
  getInProgressMoList(): Promise<any>;
  getItemsByMo(id: number): Promise<any>;
  getProduceStepsByMoAndItem(
    request: GetProduceStepsByMoAndItemRequestDto,
  ): Promise<any>;
  getWorkOrderByMoIdForWeb(
    request: any,
  ): Promise<any>;
  getMoByConditions(
    request: any
  ): Promise<any>;
  getWoByConditions(
    request: any
  ): Promise<any>;
  updateAlertForMes(
    type: number,
    message: string,
    manufacturingOrderId: number,
  ): Promise<any>;
}
