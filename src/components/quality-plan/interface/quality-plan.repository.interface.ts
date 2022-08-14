import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { QualityPlan } from '@entities/quality-plan/quality-plan.entity';
import { QualityPlanListRequestDto } from '@components/quality-plan/dto/request/quality-plan-list.request.dto';
import { QualityPlanRequestDto } from '@components/quality-plan/dto/request/quality-plan.request.dto';
import { UpdateQualityPlanRequestDto } from '@components/quality-plan/dto/request/update-quality-plan.request.dto';
import { QualityPlanOrderRequestDto } from '@components/quality-plan/dto/request/quality-plan-ioqc.request.dto';
import { UpdateQualityPlanOrderRequestDto } from '@components/quality-plan/dto/request/update-quality-plan-ioqc.request.dto';
import { ReportQcRequestDto } from '@components/report/dto/request/report-qc.request.dto';
import { GetDashboardIoQcProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-io-qc-progress-request.dto";
import { TransactionHistoryIOqcTypeEnum } from "@components/transaction-history/transaction-history.constant";
import { GetDashboardFinishedItemProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-finished-item-progress.request.dto";

export interface QualityPlanRepositoryInterface
  extends BaseInterfaceRepository<QualityPlan> {
  getList(
    request: QualityPlanListRequestDto,
    filterStageSearch: any,
    poFilterIds: number[],
    proFilterIds: number[],
    soFilterIds: number[],
    moFilterIds: number[],
  );
  getDetail(qualityPlan: QualityPlan): Promise<QualityPlan>;
  getDetailQualityPlanOrder(qualityPlan: QualityPlan): Promise<any>;
  createQualityPlan(request: QualityPlanRequestDto);
  createQualityPlanOrder(request: QualityPlanOrderRequestDto);
  updateQualityPlan(request: UpdateQualityPlanRequestDto);
  updateQualityPlanOrder(request: UpdateQualityPlanOrderRequestDto);
  deleteQualityPlan(id: number);
  deleteQualityPlanOrder(id: number);
  getExistedRecord(
    id: number,
    qualityPlanDto: any,
  ): Promise<QualityPlan>;
  getListOfReportIOqc(
    request: ReportQcRequestDto,
    type: number,
    poFilterIds: number[],
    proFilterIds: number[],
    soFilterIds: number[],
    filterItemIds: number[],
    filterStageIds: number[],
    isExport?: boolean,
  ): Promise<any>
  getListInProgressInputPlans(
    request: GetDashboardIoQcProgressRequestDto,
    type: TransactionHistoryIOqcTypeEnum,
  ): Promise<any>;
  findQualityPlanByExecutionDate(
    qcStageId: number,
    orderId: number,
    warehouseId: number,
    itemId: number,
    executionDateByPlan?: any,
  ): Promise<any>;
  findProduceStepsQualityPlansByUser(userId: number): Promise<any>;
  findIoQcPlanByUser(userId: number, type: number): Promise<any>;
  getListInProgressProducingStepQcPlans(
    request: GetDashboardFinishedItemProgressRequestDto,
  ): Promise<any>;
}
