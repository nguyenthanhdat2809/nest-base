import { Body, Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ResponsePayload } from '@utils/response-payload';
import { isEmpty } from 'lodash';
import { QualityPlanServiceInterface } from '@components/quality-plan/interface/quality-plan.service.interface';
import {
  QualityPlanListRequestDto,
  QualityPlanQcWcRequestDto,
 } from '@components/quality-plan/dto/request/quality-plan-list.request.dto';
import { QualityPlanListResponseDto } from '@components/quality-plan/dto/response/quality-plan-list.response.dto';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { QualityPlanRequestDto } from '@components/quality-plan/dto/request/quality-plan.request.dto';
import { ProduceServiceInterface } from '@components/produce/interface/produce.service.interface';
import { UpdateQualityPlanRequestDto } from '@components/quality-plan/dto/request/update-quality-plan.request.dto';
import { STAGES_OPTION } from '@constant/qc-stage.constant';
import { SuccessResponse } from '@utils/success.response.dto';
import { TypeQualityPlan } from '@entities/quality-plan/quality-plan.entity';
import { QualityPlanOrderRequestDto } from '@components/quality-plan/dto/request/quality-plan-ioqc.request.dto';
import { UpdateQualityPlanOrderRequestDto } from '@components/quality-plan/dto/request/update-quality-plan-ioqc.request.dto';
import { SaleServiceInterface } from '@components/sale/interface/sale.service.interface';
import { TypeDetailOrder } from '@components/quality-plan/quality-plan.constant';
import { GetListOrderByQualityPlanIOqcRequestDto } from '@components/quality-plan/dto/request/get-list-order-by-quality-plan-ioqc.request.dto';
import { ListQualityPlanBomRequestDto } from '@components/quality-plan/dto/request/list-quality-plan-bom.request.dto';
import { ListQualityPlanBomResponseDto } from '@components/quality-plan/dto/response/list-quality-plan-bom.response.dto';
import { UpdateActualQualityPlanIOqcRequestDto } from '@components/quality-plan/dto/request/update-actual-quality-plan-ioqc.request.dto';
import { PermissionCode } from "@core/decorator/get-code.decorator";
import {
  CONFIRM_QC_PLAN_PERMISSSION,
  CREATE_QC_PLAN_PERMISSSION,
  DELETE_QC_PLAN_PERMISSSION,
  UPDATE_QC_PLAN_PERMISSSION, VIEW_QC_PLAN_PERMISSSION
} from "@utils/permissions/web/qc-plan";
import { DeleteQualityPlanOrderRequestDto } from "@components/quality-plan/dto/request/delete-quality-plan-order.request.dto";
import { ConfirmQualityPlanOrderRequestDto } from "@components/quality-plan/dto/request/confirm-quality-plan-order.request.dto";
import { DeleteQualityPlanRequestDto } from "@components/quality-plan/dto/request/delete-quality-plan.request.dto";
import { ConfirmQualityPlanRequestDto } from "@components/quality-plan/dto/request/confirm-quality-plan.request.dto";
import { VIEW_WORK_CENTER_QC_PLAN_PERMISSION } from "@utils/permissions/web/work-center-qc-plan";
import { QualityPlanGetDetailSoRequestDto } from "@components/quality-plan/dto/request/quality-plan-get-detail-so.request.dto";
import { QualityPlanGetDetailProRequestDto } from "@components/quality-plan/dto/request/quality-plan-get-detail-pro.request.dto";
import { QualityPlanGetDetailPoRequestDto } from "@components/quality-plan/dto/request/quality-plan-get-detail-po.request.dto";
import { QualityPlanOrderDetailRequestDto } from "@components/quality-plan/dto/request/quality-plan-order-detail.request.dto";
import { QualityPlanDetailRequestDto } from "@components/quality-plan/dto/request/quality-plan-detail.request.dto";

@Controller('quality-plan')
export class QualityPlanController {
  constructor(
    @Inject('QualityPlanServiceInterface')
    private readonly qualityPlanService: QualityPlanServiceInterface,

    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceServiceInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
  ) {}

  @MessagePattern('quality_plan_bom_list')
  public async getListQualityPlanBom(
    @Body() payload: ListQualityPlanBomRequestDto,
  ): Promise<ResponsePayload<ListQualityPlanBomResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.qualityPlanService.getListQualityPlanBom(request);
  }

  @MessagePattern('quality_plan_detail_by_mo_id')
  public async qualityPlanDetailByMoId(
    moId: number,
  ): Promise<ResponsePayload<any>> {
    return await this.qualityPlanService.qualityPlanDetailByMoId(moId);
  }

  @PermissionCode(VIEW_QC_PLAN_PERMISSSION.code)
  @MessagePattern('quality_plan_list')
  public async getList(
    @Body() payload: QualityPlanListRequestDto,
  ): Promise<ResponsePayload<QualityPlanListResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.qualityPlanService.getList(request);
  }

  @PermissionCode(CREATE_QC_PLAN_PERMISSSION.code)
  @MessagePattern('quality_plan_create')
  public async create(
    @Body() payload: QualityPlanRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.qcStageId = STAGES_OPTION.OUTPUT_PRODUCTION;
    request.type = TypeQualityPlan.OP;

    return await this.qualityPlanService.create(request);
  }

  // CRUD ORDER IOQC
  @PermissionCode(VIEW_QC_PLAN_PERMISSSION.code)
  @MessagePattern('quality_plan_get_detail_so')
  public async qualityPlanGetDetailSO(
    @Body() payload: QualityPlanGetDetailSoRequestDto
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.qualityPlanService.qualityPlanGetDetailOrder(
      request.id,
      TypeDetailOrder.SO
    );
  }

  @PermissionCode(VIEW_QC_PLAN_PERMISSSION.code)
  @MessagePattern('quality_plan_get_detail_pro')
  public async qualityPlanGetDetailPRO(
    @Body() payload: QualityPlanGetDetailProRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.qualityPlanService.qualityPlanGetDetailOrder(
      request.id,
      TypeDetailOrder.PRO
    );
  }

  @PermissionCode(VIEW_QC_PLAN_PERMISSSION.code)
  @MessagePattern('quality_plan_get_detail_po')
  public async qualityPlanGetDetailPO(
    @Body() payload: QualityPlanGetDetailPoRequestDto
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.qualityPlanService.qualityPlanGetDetailOrder(
      request.id,
      TypeDetailOrder.PO
    );
  }

  @PermissionCode(CREATE_QC_PLAN_PERMISSSION.code)
  @MessagePattern('quality_plan_order_create')
  public async createQualityPlanOrder(
    @Body() payload: QualityPlanOrderRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    switch(request.qcStageId){
      case STAGES_OPTION.PO_IMPORT:
        request.type = TypeQualityPlan.INPUT;
        break;
      case STAGES_OPTION.PRO_IMPORT:
        request.type = TypeQualityPlan.INPUT;
        break;
      case STAGES_OPTION.PRO_EXPORT:
        request.type = TypeQualityPlan.OUTPUT;
        break;
      case STAGES_OPTION.SO_EXPORT:
        request.type = TypeQualityPlan.OUTPUT;
        break;
      default:
        break;
    }

    return await this.qualityPlanService.createQualityPlanOrder(request);
  }

  @PermissionCode(UPDATE_QC_PLAN_PERMISSSION.code)
  @MessagePattern('quality_plan_order_update')
  public async updateQualityPlanOrder(
    @Body() payload: UpdateQualityPlanOrderRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    switch(request.qcStageId){
      case STAGES_OPTION.PO_IMPORT:
        request.type = TypeQualityPlan.INPUT;
        break;
      case STAGES_OPTION.PRO_IMPORT:
        request.type = TypeQualityPlan.INPUT;
        break;
      case STAGES_OPTION.PRO_EXPORT:
        request.type = TypeQualityPlan.OUTPUT;
        break;
      case STAGES_OPTION.SO_EXPORT:
        request.type = TypeQualityPlan.OUTPUT;
        break;
      default:
        break;
    }

    return await this.qualityPlanService.updateQualityPlanOrder(request);
  }

  @PermissionCode(VIEW_QC_PLAN_PERMISSSION.code)
  @MessagePattern('quality_plan_order_detail')
  public async getDetailQualityPlanOrder(
    @Body() payload: QualityPlanOrderDetailRequestDto
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.qualityPlanService.getDetailQualityPlanOrder(request.id);
  }

  @PermissionCode(DELETE_QC_PLAN_PERMISSSION.code)
  @MessagePattern('quality_plan_order_delete')
  public async deleteQualityPlanOrder(
    @Body() payload: DeleteQualityPlanOrderRequestDto,
  ): Promise<ResponsePayload<SuccessResponse | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.qualityPlanService.deleteQualityPlanOrder(request);
  }

  @PermissionCode(CONFIRM_QC_PLAN_PERMISSSION.code)
  @MessagePattern('quality_plan_order_confirm')
  public async confirmQualityPlanOrder(
    @Body() payload: ConfirmQualityPlanOrderRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.qualityPlanService.confirm(request);
  }

  @MessagePattern('actual_quality_plan_ioqc_update')
  public async updateActualQualityPlanIOqc(
    @Body() payload: UpdateActualQualityPlanIOqcRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.qualityPlanService.updateActualQualityPlanIOqc(request);
  }
  // END

  @PermissionCode(UPDATE_QC_PLAN_PERMISSSION.code)
  @MessagePattern('quality_plan_update')
  public async update(
    @Body() payload: UpdateQualityPlanRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.qualityPlanService.update(request);
  }

  @PermissionCode(DELETE_QC_PLAN_PERMISSSION.code)
  @MessagePattern('quality_plan_delete')
  public async delete(
    @Body() payload: DeleteQualityPlanRequestDto,
  ): Promise<ResponsePayload<SuccessResponse | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.qualityPlanService.delete(request);
  }

  @PermissionCode(CONFIRM_QC_PLAN_PERMISSSION.code)
  @MessagePattern('quality_plan_confirm')
  public async confirm(
    @Body() payload: ConfirmQualityPlanRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.qualityPlanService.confirm(request);
  }

  @MessagePattern('quality_plan_get_all_mos')
  public async getAllMos(): Promise<ResponsePayload<any>> {
    return await this.produceService.getAvailableMos();
  }

  @MessagePattern('quality_plan_get_confirmed_mo_plans')
  public async getConfirmedPlansByMoId(
    moId: number,
  ): Promise<ResponsePayload<any>> {
    return await this.produceService.getConfirmedPlansByMoId(moId);
  }

  @PermissionCode(VIEW_QC_PLAN_PERMISSSION.code)
  @MessagePattern('quality_plan_detail')
  public async getDetail(
    @Body() payload: QualityPlanDetailRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.qualityPlanService.getDetail(request?.id);
  }

  @MessagePattern('quality_plan_get_mo_plan_detail')
  public async getMoPlanDetail(id: number): Promise<ResponsePayload<any>> {
    return await this.qualityPlanService.getMoPlanDetail(id);
  }

  @MessagePattern('get_list_order_ioqc_quality_plan')
  public async getListOrderByQualityPlanIOqc(
    @Body() payload: GetListOrderByQualityPlanIOqcRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.qualityPlanService.getListOrderByQualityPlanIOqc(request);
  }

  // Lấy dữ liệu xưởng từ PLAN
  @PermissionCode(VIEW_WORK_CENTER_QC_PLAN_PERMISSION.code)
  @MessagePattern('quality_plan_get_work_centers_schedule')
  public async qualityPlanGetListWorkCenterSchedule(
    @Body() payload: QualityPlanQcWcRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.qualityPlanService.qualityPlanGetListWorkCenterSchedule(
      request
    );
  }

  @PermissionCode(VIEW_WORK_CENTER_QC_PLAN_PERMISSION.code)
  @MessagePattern('quality_plan_get_work_centers_schedule_detail')
  public async qualityPlanGetWorkCenterScheduleDetail(
    payload: any,
  ): Promise<ResponsePayload<any>> {
    return await this.qualityPlanService.qualityPlanGetWorkCenterScheduleDetail(
      payload,
    );
  }
}
