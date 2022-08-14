import { ResponsePayload } from '@utils/response-payload';
import { ErrorReportDetailResponseDto } from '@components/error-report/dto/response/error-report-detail.response.dto';
import { ErrorReportListRequestDto } from '@components/error-report/dto/request/error-report-list.request.dto';
import { UpdateErrorReportRequestDto } from '@components/error-report/dto/request/update-error-report.request.dto';
import { PagingResponse } from '@utils/paging.response';
import { ErrorReportByCommandItemWarehouseRequestDto } from '@components/error-report/dto/request/error-report-by-command-item-warehouse.request.dto';
import { UpdateErrorReportsAfterRepairRequestDto } from '@components/error-report/dto/request/update-error-reports-after-repair.request.dto';
import { CreateErrorReportRequestDto } from '@components/error-report/dto/request/create-error-report.request.dto';
import { ErrorReportListIOForAppRequestDto } from '@components/error-report/dto/request/error-report-list-io-for-app.request.dto';
import { RejectErrorReportRequestDto } from '@components/error-report/dto/request/reject-error-report.request.dto';
import { ConfirmProduceStepErrorReportRequestDto } from '@components/error-report/dto/request/confirm-produce-step-error-report.request.dto';
import { CreateErrorReportIOqcRequestDto } from '@components/error-report/dto/request/create-error-report-ioqc.request.dto';
import { ConfirmIOqcErrorReportRequestDto } from '@components/error-report/dto/request/confirm-ioqc-error-report.request.dto';
import { DetailErrorReportResponseDto } from '@components/error-report/dto/response/error-report-detail-io-for-app.response.dto';
import { ErrorReportDetailForWebResponseDto } from '@components/error-report/dto/response/error-report-detail-for-web-response.dto';

export interface ErrorReportServiceInterface {
  getDetail(id: number): Promise<ResponsePayload<ErrorReportDetailResponseDto>>;
  getDetailWeb(
    id: number,
  ): Promise<ResponsePayload<ErrorReportDetailForWebResponseDto>>;
  getList(
    request: ErrorReportListRequestDto,
  ): Promise<ResponsePayload<PagingResponse>>;
  update(request: UpdateErrorReportRequestDto): Promise<ResponsePayload<any>>;
  confirm(id: number, confirmBy: number): Promise<ResponsePayload<any>>;
  delete(id: number): Promise<ResponsePayload<any>>;
  getListErrorReportByCommandItemWarehouse(
    request: ErrorReportByCommandItemWarehouseRequestDto,
  ): Promise<any>;
  showCreateForm(transactionHistoryId: number): Promise<any>;
  createProduceStepsErrorReport(
    request: CreateErrorReportRequestDto,
  ): Promise<any>;
  getDetailByWO(workOrderId: number): Promise<any>;
  updateErrorReportAfterRepair(
    request: UpdateErrorReportsAfterRepairRequestDto,
  ): Promise<any>;
  getStageListForApp(request: ErrorReportListRequestDto): Promise<any>;
  getStageDetailForApp(id: number): Promise<any>;
  createIoqcErrorReport(
    request: CreateErrorReportIOqcRequestDto,
    stage: number,
    reportType: number,
  ): Promise<any>;
  getListErrorReportIOqcForApp(
    request: ErrorReportListIOForAppRequestDto,
  ): Promise<ResponsePayload<PagingResponse>>;
  confirmProduceStepErrorReport(
    request: ConfirmProduceStepErrorReportRequestDto,
  ): Promise<ResponsePayload<any>>;
  rejectErrorReport(payload: RejectErrorReportRequestDto): Promise<any>;
  confirmIOqcErrorReport(
    request: ConfirmIOqcErrorReportRequestDto,
  ): Promise<ResponsePayload<any>>;

  getDetailErrorReportIOqcForApp(
    id: number,
  ): Promise<ResponsePayload<DetailErrorReportResponseDto>>;
  getListByWO(workOrderId: number): Promise<any>;
  updateStatusQualityPlanForCompleted(id: number): Promise<any>;
}
