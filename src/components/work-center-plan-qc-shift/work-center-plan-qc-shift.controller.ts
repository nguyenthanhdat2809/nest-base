import { Body, Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ResponsePayload } from '@utils/response-payload';
import { isEmpty } from 'lodash';
import { SuccessResponse } from '@utils/success.response.dto';
import { WorkCenterPlanQcShiftServiceInterface } from '@components/work-center-plan-qc-shift/interface/work-center-plan-qc-shift.service.interface';
import { GetWorkCenterPlanQcShiftByWoIdAndWcIdRequestDto } from '@components/work-center-plan-qc-shift/dto/request/get-work-center-plan-qc-shift-by-wo-id-and-wc-id.request.dto';
import { CreateWorkCenterPlanQcShiftRequestDto } from '@components/work-center-plan-qc-shift/dto/request/create-work-center-plan-qc-shift.request.dto';
import { CreateWorkCenterPlanQcShiftResponseDto } from '@components/work-center-plan-qc-shift/dto/response/create-work-center-plan-qc-shift.response.dto';
import { DeleteWorkCenterPlanQcShiftByWoIdAndWcIdRequestDto } from '@components/work-center-plan-qc-shift/dto/request/delete-work-center-plan-qc-shift-by-wo-id-and-wc-id.request.dto';
import { generate } from 'rxjs';
import { generatePermissionCodes } from '@utils/common';
import {
  CREATE_WORK_CENTER_QC_PLAN_PERMISSION,
  UPDATE_WORK_CENTER_QC_PLAN_PERMISSION,
} from '@utils/permissions/web/work-center-qc-plan';
import { PermissionCode } from '@core/decorator/get-code.decorator';

const CREATE_AND_EDIT_WORK_CENTER_QC_PLAN_PERMISSION = generatePermissionCodes([
  CREATE_WORK_CENTER_QC_PLAN_PERMISSION.code,
  UPDATE_WORK_CENTER_QC_PLAN_PERMISSION.code,
]);

@Controller('work-center-plan-qc-shifts')
export class WorkCenterPlanQcShiftController {
  constructor(
    @Inject('WorkCenterPlanQcShiftServiceInterface')
    private readonly workCenterPlanQcShiftService: WorkCenterPlanQcShiftServiceInterface,
  ) {}

  @PermissionCode(CREATE_AND_EDIT_WORK_CENTER_QC_PLAN_PERMISSION)
  @MessagePattern('work_center_plan_qc_shift_create')
  public async createWorkCenterPlanQcShift(
    @Body() payload: CreateWorkCenterPlanQcShiftRequestDto,
  ): Promise<ResponsePayload<CreateWorkCenterPlanQcShiftResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.workCenterPlanQcShiftService.createWorkCenterPlanQcShift(
      request,
    );
  }

  @MessagePattern('get_work_center_plan_qc_shift_by_wo_id_and_wc_id')
  public async workCenterPlanQcShiftByWoIdAndWcId(
    payload: GetWorkCenterPlanQcShiftByWoIdAndWcIdRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.workCenterPlanQcShiftService.workCenterPlanQcShiftByWoIdAndWcId(
      request,
    );
  }

  @MessagePattern('work_center_plan_qc_shift_delete')
  public async deleteWorkCenterPlanQcShift(
    payload: DeleteWorkCenterPlanQcShiftByWoIdAndWcIdRequestDto,
  ): Promise<ResponsePayload<SuccessResponse | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.workCenterPlanQcShiftService.deleteWorkCenterPlanQcShift(
      request,
    );
  }
}
