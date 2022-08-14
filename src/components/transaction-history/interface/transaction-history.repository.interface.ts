import { TransactionHistory } from '@entities/transaction-history/transaction-history.entity';
import { TransactionHistoryCheckListDetail } from '@entities/transaction-history/transaction-history-check-list-detail.entity';
import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { UpdateQcProgressRequestDto } from '@components/quality-progress/dto/request/update-qc-progress.request.dto';
import {
  TransactionHistoryIOqcTypeEnum,
  TransactionHistoryTypeEnum
} from "@components/transaction-history/transaction-history.constant";
import { GetListProducingStepsTransactionHistoryRequestDto } from '@components/transaction-history/dto/request/get-list-producing-steps-transaction-history.request.dto';
import { TransactionHistoryListRequestDto } from '../dto/request/transaction-history-list.request.dto';
import { GetListQcTransactionInitDataRequestDto } from '@components/transaction-history/dto/request/get-list-qc-transaction-init-data.request.dto';
import { GetDashboardIoQcProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-io-qc-progress-request.dto";
import { GetListTransactionHistoryOverallRequestDto } from "@components/transaction-history/dto/request/get-list-transaction-history-overall.request.dto";
import { GetDashboardFinishedItemProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-finished-item-progress.request.dto";

export interface TransactionHistoryRepositoryInterface
  extends BaseInterfaceRepository<TransactionHistory> {
  createEntity(request: any): TransactionHistory;
  createTransactionHistoryCheckListDetailEntity(
    request: any,
  ): TransactionHistoryCheckListDetail;
  findTransactionHistoryById(id: number): Promise<TransactionHistory>;
  updateQualityProgress(
    request: UpdateQcProgressRequestDto,
    type: TransactionHistoryTypeEnum,
  ): Promise<TransactionHistory>;
  getListProducingStepsQC(
    request: GetListProducingStepsTransactionHistoryRequestDto,
    woFilterMoIds?: number[],
    woFilterKwIds?: number[],
    filterItemIds?: number[],
    itemFilterKwIds?: number[],
  ): Promise<any>;
  getProducingStepsQCDetail(id: number): Promise<any>;
  getDataQCDetailShowCreateForm(id: number): Promise<any>
  getCheckListDetailsByTransactionHistory(id: number): Promise<any>;
  getList(request: TransactionHistoryListRequestDto);
  getDetail(id: number): Promise<any>;
  getNotReportedProducingTransactionHistory(createdBy: number): Promise<any>;
  getNotReportedInputQcTransactionHistory(
    createdBy: number,
  ): Promise<any>;
  getNotReportedOutputQcTransactionHistory(
    createdBy: number,
  ): Promise<any>;
  getListTransactionHistoryIOqcForWeb(
    request: GetListQcTransactionInitDataRequestDto,
    type: number,
    filterItemIds: number[],
    filterStageIds: number[],
    poIds: number[],
    proIds: number[],
    soIds: number[],
  ): Promise<any>;
  getListTransactionHistoryIOqcForApp(
    request: GetListQcTransactionInitDataRequestDto,
    keywordOrderIds: number[],
    keywordItemIds: number[],
    filterOrderIds: number[],
    filteredArrayOrderIds: number[],
  ): Promise<any>;
  getTransactionQcDetail(id: number): Promise<any>;
  getIoQcProgressItems(
    request: GetDashboardIoQcProgressRequestDto,
    type: TransactionHistoryIOqcTypeEnum,
  ): Promise<any>;
  checkExecutionDateByQualityPlan(
    qcStageId: number,
    orderId: number,
    warehouseId: number,
    itemId: number,
    executionDateByPlan: any,
  ): Promise<any>;
  getListTransactionHistoryOverall(
    request: GetListTransactionHistoryOverallRequestDto,
    poIds: number[],
    soIds: number[],
    proImportIds: number[],
    proExportIds: number[],
    itemIds: number[],
  ): Promise<any>;
  totalQuantityForWC(
    orderId: number,
    type: number,
    numberOfTimeQc: number,
    workCenterIds: number[],
  ): Promise<any>;
  totalQuantityForItem(
    orderId: number,
    warehouseId: number,
    itemId: number,
    type: number,
    numberOfTimeQc: number,
  ): Promise<any>;
  totalQuantityForWCInputProduction(
    orderId: number,
    type: number,
    numberOfTimeQc: number,
    workCenterIds: number[],
  ): Promise<any>;

  getProducingStepsQcProgressItems(
    request: GetDashboardFinishedItemProgressRequestDto,
  ): Promise<any>;
}
