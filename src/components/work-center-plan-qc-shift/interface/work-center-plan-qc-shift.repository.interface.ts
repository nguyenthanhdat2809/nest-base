import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { WorkCenterPlanQcShift } from '@entities/work-center-plan-qc-shift/work-center-plan-qc-shift.entity';
import { CreateWorkCenterPlanQcShiftRequestDto } from '@components/work-center-plan-qc-shift/dto/request/create-work-center-plan-qc-shift.request.dto';

export interface WorkCenterPlanQcShiftRepositoryInterface
  extends BaseInterfaceRepository<WorkCenterPlanQcShift> {
  workCenterPlanQcShiftByWoIdAndWcId(request: any): Promise<any>;
  createWorkCenterPlanQcShiftEntity(
    request: CreateWorkCenterPlanQcShiftRequestDto,
  ): WorkCenterPlanQcShift[];
  getQualityPlanBomUsers(workOrderId: number): Promise<any>;
  getQualityPlanBomByUserAndWo(woIds: number[], userId: number): Promise<any>;
}
