import { ResponsePayload } from '@utils/response-payload';
import { GetListProducingStepsTransactionHistoryRequestDto } from '../dto/request/get-list-producing-steps-transaction-history.request.dto';
import { GetListProducingStepsTransactionHistoryResponseDto } from '@components/transaction-history/dto/response/get-list-producing-steps-transaction-history.response.dto';
import { ProducingStepsTransactionHistoryResponseDto } from '@components/transaction-history/dto/response/producing-steps-transaction-history.response.dto';
import { CreateProducingStepsTransactionHistoryRequestDto } from '@components/transaction-history/dto/request/create-producing-steps-transaction-history-request.dto';
import { GetWOSummaryScanRequestDto } from '@components/transaction-history/dto/request/get-wo-summary-scan-request.dto';
import { GetMoListRequestDto } from '@components/produce/dto/request/get-mo-list-request.dto';
import { GetPlanItemMoListRequestDto } from '@components/produce/dto/request/get-plan-item-mo-list-request.dto';
import { GetMoItemDetailRequestDto } from '@components/produce/dto/request/get-mo-item-detail-request.dto';
import { GetListIoqcOrderRequestDto } from '@components/item/dto/request/get-list-ioqc-order.request.dto';
import { GetListIoqcOrderResponseDto } from '@components/item/dto/response/get-list-ioqc-order.response.dto';
import { GetListIoqcWarehouseByOrderRequestDto } from '@components/item/dto/request/get-list-ioqc-warehouse-by-order.request.dto';
import { GetListIoqcWarehouseByOrderResponseDto } from '@components/item/dto/response/get-list-ioqc-warehouse-by-order.response.dto';
import { GetListIoqcItemByWarehouseAndOrderRequestDto } from '@components/item/dto/request/get-list-ioqc-item-by-warehouse-and-order.request.dto';
import { GetListIoqcItemByWarehouseAndOrderResponseDto } from '@components/item/dto/response/get-list-ioqc-item-by-warehouse-and-order.response.dto';
import { TransactionHistoryTypeEnum, TransactionHistoryIOqcTypeEnum } from '../transaction-history.constant';
import {
  DetailTransactionHistoryForAppResponseDto,
  TransactionHistoryForAppResponseDto,
} from '@components/transaction-history/dto/response/transaction-history-for-app.response.dto';
import { GetListQcTransactionInitDataRequestDto } from '@components/transaction-history/dto/request/get-list-qc-transaction-init-data.request.dto';
import { TransactionHistoryForWebResponseDto } from '@components/transaction-history/dto/response/transaction-history-for-web.response.dto';
import { GetListQcTransactionInitDataForWebRequestDto } from '@components/transaction-history/dto/request/get-list-qc-transaction-init-data-for-web.request.dto';
import { ProducingStepsTransactionHistoryDetailResponseDto } from '@components/transaction-history/dto/response/producing-steps-transaction-history-detail.response.dto';
import { CreateTransactionHistoryLogTimeRequestDto } from "@components/transaction-history/dto/request/create-transaction-history-log-time.request.dto";
import { UpdateTransactionHistoryLogTimeRequestDto } from "@components/transaction-history/dto/request/update-transaction-history-log-time.request.dto";
import { UpdateTransactionHistoryLogTimeAdditionRequestDto } from "@components/transaction-history/dto/request/update-transaction-history-log-time-addition.request.dto";
import { CreateInputProducingStepsTransactionHistoryRequestDto } from "@components/transaction-history/dto/request/create-input-producing-steps-transaction-history.request.dto";
import { PagingResponse } from '@utils/paging.response';
import { GetDashboardIoQcProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-io-qc-progress-request.dto";
import { ValidateWcQcPlanForWorkOrderRequestDto } from "@components/transaction-history/dto/request/validate-wc-qc-plan-for-work-order.request.dto";
import { GetMaximumQcQuantityRequestDto } from "@components/transaction-history/dto/request/get-maximum-qc-quantity.request.dto";
import { GetListTransactionHistoryOverallRequestDto } from "@components/transaction-history/dto/request/get-list-transaction-history-overall.request.dto";
import { GetDashboardFinishedItemProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-finished-item-progress.request.dto";

export interface TransactionHistoryServiceInterface {
  getListProducingStepsQCHistory(
    request: GetListProducingStepsTransactionHistoryRequestDto,
  ): Promise<
    ResponsePayload<GetListProducingStepsTransactionHistoryResponseDto | any>
  >;
  getDetailProducingStepsQCHistory(
    id: number,
  ): Promise<
    ResponsePayload<ProducingStepsTransactionHistoryResponseDto | any>
  >;
  createProducingStepTransactionHistory(
    request: CreateProducingStepsTransactionHistoryRequestDto,
  ): Promise<ResponsePayload<any>>;
  getWOSummaryOfProducingStepsTransactionHistory(
    request: GetWOSummaryScanRequestDto,
  ): Promise<ResponsePayload<any>>;
  getMoList(request: GetMoListRequestDto): Promise<any>;
  getPlanItemMoList(request: GetPlanItemMoListRequestDto): Promise<any>;
  getMoItemDetail(request: GetMoItemDetailRequestDto): Promise<any>;
  getListIoqcOrder(
    request: GetListIoqcOrderRequestDto,
  ): Promise<GetListIoqcOrderResponseDto | any>;
  getListIoqcWarehouseByOrder(
    request: GetListIoqcWarehouseByOrderRequestDto,
  ): Promise<GetListIoqcWarehouseByOrderResponseDto | any>;
  getListIoqcItemByWarehouseAndOrder(
    request: GetListIoqcItemByWarehouseAndOrderRequestDto,
  ): Promise<GetListIoqcItemByWarehouseAndOrderResponseDto | any>;
  getInitData(type: TransactionHistoryTypeEnum): Promise<ResponsePayload<any>>;
  delete(transactionHistoryId: number): Promise<any>;
  detail(id: number): Promise<any>;
  getTransactionHistory(
    request: GetListQcTransactionInitDataRequestDto,
    type: TransactionHistoryIOqcTypeEnum,
  ): Promise<ResponsePayload<TransactionHistoryForAppResponseDto>>;
  getTransactionHistoryForWeb(
    request: GetListQcTransactionInitDataForWebRequestDto,
    type: TransactionHistoryIOqcTypeEnum,
  ): Promise<ResponsePayload<TransactionHistoryForWebResponseDto>>;
  getDetailTransactionHistory(
    id: number,
  ): Promise<ResponsePayload<DetailTransactionHistoryForAppResponseDto>>;
  getDetailTransactionHistory(id: number): Promise<ResponsePayload<DetailTransactionHistoryForAppResponseDto>>;
  getListOrder(type: number): Promise<ResponsePayload<any>>;
  getNotReportedProducingTransactionHistory(createdBy: number): Promise<any>;
  createProduceStepQcLogTime(
    request: CreateTransactionHistoryLogTimeRequestDto,
  ): Promise<any>;
  updateProduceStepQcLogTime(
    request: UpdateTransactionHistoryLogTimeRequestDto,
  ): Promise<any>;
  getNotReportedOutputQcTransactionHistory(
    createdBy: number,
  ): Promise<any>;
  getNotReportedInputQcTransactionHistory(
    createdBy: number,
  ): Promise<any>;
  createProduceStepQcLogTimeAddition(request: any): Promise<any>;
  getLogTimeEntityByTransactionHistoryId(transactionHistoryId: number): Promise<any>;
  getProduceStepQcLogTimeDetail(id: number): Promise<any>;
  updateProduceStepQcLogTimeAddition(request: UpdateTransactionHistoryLogTimeAdditionRequestDto): Promise<any>;
  getDetailTransactionHistoryIOqcWeb(id: number): Promise<ResponsePayload<any>>;
  createInputProducingStepTransactionHistory(request: CreateInputProducingStepsTransactionHistoryRequestDto): Promise<ResponsePayload<any>>;
  updateWoQcQuantity(request: any): Promise<any>;
  updateWoMaterialQcQuantity(request: any): Promise<any>;
  updateWoPreviousBomQcQuantity(request: any): Promise<any>;
  getListTransactionHistoryIOqcForWeb(
    request: GetListQcTransactionInitDataRequestDto,
    type: number,
  ): Promise<ResponsePayload<PagingResponse>>
  getListTransactionHistoryIOqcForApp(
    request: GetListQcTransactionInitDataRequestDto,
  ): Promise<ResponsePayload<PagingResponse>>
  getIoQcProgressItems(
    request: GetDashboardIoQcProgressRequestDto,
    type: TransactionHistoryIOqcTypeEnum,
  ): Promise<any>;
  getNotFinishedQcLogTime(): Promise<any>;
  validateWcQcPlanForWorkOrder(request: ValidateWcQcPlanForWorkOrderRequestDto): Promise<any>;
  getMaximumProduceStepQcQuantity(request: GetMaximumQcQuantityRequestDto): Promise<any>;
  getListTransactionHistoryOverall(request: GetListTransactionHistoryOverallRequestDto): Promise<any>;
  getProducingStepsQcProgressItems(request: GetDashboardFinishedItemProgressRequestDto): Promise<any>;
}
