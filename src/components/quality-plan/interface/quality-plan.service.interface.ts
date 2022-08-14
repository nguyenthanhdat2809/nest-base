import { ResponsePayload } from '@utils/response-payload';
import {
  QualityPlanListRequestDto,
  QualityPlanQcWcRequestDto,
} from '@components/quality-plan/dto/request/quality-plan-list.request.dto';
import { PagingResponse } from '@utils/paging.response';
import { QualityPlanRequestDto } from '@components/quality-plan/dto/request/quality-plan.request.dto';
import { UpdateQualityPlanRequestDto } from '@components/quality-plan/dto/request/update-quality-plan.request.dto';
import { SuccessResponse } from '@utils/success.response.dto';
import { QualityPlanOrderRequestDto } from '@components/quality-plan/dto/request/quality-plan-ioqc.request.dto';
import { UpdateQualityPlanOrderRequestDto } from '@components/quality-plan/dto/request/update-quality-plan-ioqc.request.dto';
import { GetListOrderByQualityPlanIOqcRequestDto } from '@components/quality-plan/dto/request/get-list-order-by-quality-plan-ioqc.request.dto';
import { ListQualityPlanBomRequestDto } from '@components/quality-plan/dto/request/list-quality-plan-bom.request.dto';
import { UpdateActualQualityPlanIOqcRequestDto } from '@components/quality-plan/dto/request/update-actual-quality-plan-ioqc.request.dto';
import { GetDashboardIoQcProgressRequestDto } from '@components/dashboard/dto/request/get-dashboard-io-qc-progress-request.dto';
import { TransactionHistoryIOqcTypeEnum } from '@components/transaction-history/transaction-history.constant';
import { DeleteQualityPlanOrderRequestDto } from '@components/quality-plan/dto/request/delete-quality-plan-order.request.dto';
import { ConfirmQualityPlanRequestDto } from '@components/quality-plan/dto/request/confirm-quality-plan.request.dto';
import { DeleteQualityPlanRequestDto } from '@components/quality-plan/dto/request/delete-quality-plan.request.dto';
import { GetDashboardFinishedItemProgressRequestDto } from '@components/dashboard/dto/request/get-dashboard-finished-item-progress.request.dto';
import { ConfirmQualityPlanOrderRequestDto } from '@components/quality-plan/dto/request/confirm-quality-plan-order.request.dto';

export interface QualityPlanServiceInterface {
  confirm(request: ConfirmQualityPlanOrderRequestDto): Promise<any>;
  getListQualityPlanBom(
    request: ListQualityPlanBomRequestDto,
  ): Promise<ResponsePayload<PagingResponse | any>>;
  getList(
    request: QualityPlanListRequestDto,
  ): Promise<ResponsePayload<PagingResponse>>;
  getDetail(id: number): Promise<ResponsePayload<any>>;
  getDetailQualityPlanOrder(id: number): Promise<ResponsePayload<any>>;
  create(
    createQualityPlanRequestDto: QualityPlanRequestDto,
  ): Promise<ResponsePayload<any>>;
  createQualityPlanOrder(
    request: QualityPlanOrderRequestDto,
  ): Promise<ResponsePayload<any>>;
  getMoPlanDetail(id: number): Promise<any>;
  update(request: UpdateQualityPlanRequestDto): Promise<ResponsePayload<any>>;
  updateActualQualityPlanIOqc(
    request: UpdateActualQualityPlanIOqcRequestDto,
  ): Promise<ResponsePayload<any>>;
  updateQualityPlanOrder(
    request: UpdateQualityPlanOrderRequestDto,
  ): Promise<ResponsePayload<any>>;
  delete(
    request: DeleteQualityPlanRequestDto,
  ): Promise<ResponsePayload<SuccessResponse | any>>;
  deleteQualityPlanOrder(
    request: DeleteQualityPlanOrderRequestDto,
  ): Promise<ResponsePayload<SuccessResponse | any>>;
  qualityPlanGetDetailOrder(id: number, type: number): Promise<any>;
  getListOrderByQualityPlanIOqc(
    request: GetListOrderByQualityPlanIOqcRequestDto,
  ): Promise<any>;
  qualityPlanGetListWorkCenterSchedule(
    request: QualityPlanQcWcRequestDto,
  ): Promise<any>;
  qualityPlanGetWorkCenterScheduleDetail(payload: any): Promise<any>;
  getListInProgressInputPlans(
    request: GetDashboardIoQcProgressRequestDto,
    type: TransactionHistoryIOqcTypeEnum,
  ): Promise<any>;
  qualityPlanDetailByMoId(moId: number): Promise<ResponsePayload<any>>;
  getListProducingStepsQcPlans(
    request: GetDashboardFinishedItemProgressRequestDto,
  ): Promise<any>;
}
