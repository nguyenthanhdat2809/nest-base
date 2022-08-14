import { ResponsePayload } from '@utils/response-payload';
import { CreateWorkCenterPlanQcShiftRequestDto } from '@components/work-center-plan-qc-shift/dto/request/create-work-center-plan-qc-shift.request.dto';
import { DeleteWorkCenterPlanQcShiftByWoIdAndWcIdRequestDto } from '@components/work-center-plan-qc-shift/dto/request/delete-work-center-plan-qc-shift-by-wo-id-and-wc-id.request.dto';
import { SuccessResponse } from '@utils/success.response.dto';

export interface WorkCenterPlanQcShiftServiceInterface {
  workCenterPlanQcShiftByWoIdAndWcId(
    request: any
  ): Promise<any>;
  createWorkCenterPlanQcShift(
    request: CreateWorkCenterPlanQcShiftRequestDto,
  ): Promise<ResponsePayload<any>>;
  deleteWorkCenterPlanQcShift(
    request: DeleteWorkCenterPlanQcShiftByWoIdAndWcIdRequestDto,
  ): Promise<ResponsePayload<SuccessResponse | any>>;
  updateWcPlanQc(transactionHistoryEntity: any): Promise<any>;
}
