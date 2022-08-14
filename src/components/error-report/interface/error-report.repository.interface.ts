import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { ErrorReport } from '@entities/error-report/error-report.entity';
import { ErrorReportRequestDto } from '@components/error-report/dto/request/error-report.request.dto';
import { ErrorReportListRequestDto } from '@components/error-report/dto/request/error-report-list.request.dto';
import { UpdateErrorReportRequestDto } from '@components/error-report/dto/request/update-error-report.request.dto';
import { ErrorReportStageDetail } from '@entities/error-report/error-report-stage-detail.entity';
import { ErrorReportStageDetailRequestDto } from '@components/error-report/dto/request/error-report-stage-detail.request.dto';
import { ErrorReportErrorList } from '@entities/error-report/error-report-error-list.entity';
import { ErrorReportErrorListRequestDto } from '@components/error-report/dto/request/error-report-error-list.request.dto';
import { ErrorReportErrorDetail } from '@entities/error-report/error-report-error-detail.entity';
import { ErrorReportIoqcDetailRequestDto } from '@components/error-report/dto/request/error-report-ioqc-detail.request.dto';
import { ErrorReportIoqcDetail } from '@entities/error-report/error-report-ioqc-detail.entity';
import { CreateErrorReportRequestDto } from '@components/error-report/dto/request/create-error-report.request.dto';
import { UpdateErrorReportsAfterRepairRequestDto } from '@components/error-report/dto/request/update-error-reports-after-repair.request.dto';
import { ErrorReportListIOForAppRequestDto } from '@components/error-report/dto/request/error-report-list-io-for-app.request.dto';
import { CreateErrorReportIOqcRequestDto } from '@components/error-report/dto/request/create-error-report-ioqc.request.dto';
import { TransactionHistoryTypeEnum } from '@components/transaction-history/transaction-history.constant';

export interface ErrorReportRepositoryInterface
  extends BaseInterfaceRepository<ErrorReport> {
  createEntity(request: any): ErrorReport;
  getList(
    request: ErrorReportListRequestDto,
    filterStageSearch: any,
    filterUserIds: number[],
    poFilterIds: number[],
    proFilterIds: number[],
    soFilterIds: number[],
    woFilterIds: number[],
  );
  getExistedRecord(
    id: number,
    errorReportDto: ErrorReportRequestDto,
  ): Promise<[ErrorReport, ErrorReport]>;
  getDetail(errorReport: ErrorReport): Promise<ErrorReport>;
  findOneByCode(code: string): Promise<ErrorReport>;
  confirm(errorReport: ErrorReport, confirmBy: number): Promise<ErrorReport>;
  updateErrorReport(
    request: UpdateErrorReportRequestDto,
    errorReport: ErrorReport,
  ): Promise<ErrorReport>;
  createErrorReportStageDetailsEntity(
    errorReportStageDetailsDto: ErrorReportStageDetailRequestDto,
  ): ErrorReportStageDetail;
  createErrorReportErrorListEntity(
    errorReportErrorListDto: ErrorReportErrorListRequestDto,
  ): ErrorReportErrorList;
  createErrorReportErrorDetailsEntity(payload: any): ErrorReportErrorDetail;
  getListErrorReportStageDetailByStageId(stageId: number): Promise<any>;
  getDetailByWO(workOrderId: number): Promise<any>;
  getStageListForApp(
    request: ErrorReportListRequestDto,
    woFilterMoIds?: number[],
    woFilterKwIds?: number[],
    itemFilterKwIds?: number[],
  ): Promise<any>;
  getStageDetailForApp(id: number): Promise<any>;
  createErrorReportIoqcDetailEntity(
    errorReportIoqcDetailDto: ErrorReportIoqcDetailRequestDto,
  ): ErrorReportIoqcDetail;
  createProduceStepsErrorReport(
    request: CreateErrorReportRequestDto,
    workOrder: any,
    qcStageId: number,
    itemId: number,
    reportType: number,
  ): Promise<ErrorReport>;
  createIoqcErrorReport(
    request: CreateErrorReportIOqcRequestDto,
    qcStageId: number,
    reportType: number,
  ): Promise<ErrorReport>;
  getListErrorReportInputForApp(
    request: ErrorReportListIOForAppRequestDto,
    keywordOrderIds: number[],
    keywordItemIds: number[],
    filterOrderIds: number[],
    filteredArrayOrderIds: number[],
  );
  getDetailErrorReportForApp(id: number);
  getStageListByWOForApp(workOrderId: number): Promise<any>;
  getListErrorReportByStageIdAndOrderId(
    qcStageId: number,
    orderId: number,
  ): Promise<any>;
  getListErrorReportByStageIdAndOrderIdAndItemId(
    qcStageId: number,
    orderId: number,
    itemId: number,
  ): Promise<any>;
  getListErrorReportNotConfirmAndReject(
    qcStageId: number,
    orderId: number,
    warehouseId: number,
    itemId: number,
  ): Promise<any>;
  getProduceStepsSumQcQuantityByNotConfirmedStatus(
    orderId: number,
    workCenterId: number,
    type: TransactionHistoryTypeEnum,
    itemId?: number,
  ): Promise<any>;
  getListErrorReportByProduceStep(
    qcStageId: number,
    moId: number,
    itemId: number,
    producingStepId: number,
  ): Promise<any>;
  getListErrorReportIoqcStage(
    qcStageId: number,
    orderId: number,
    itemId: number,
  ): Promise<any>;
  getListAllErrorReport(): Promise<any>;
}
