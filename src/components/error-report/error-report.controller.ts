import { Body, Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ResponsePayload } from '@utils/response-payload';
import { isEmpty } from 'lodash';
import { ErrorReportServiceInterface } from '@components/error-report/interface/error-report.service.interface';
import { ErrorReportListRequestDto } from '@components/error-report/dto/request/error-report-list.request.dto';
import { ErrorReportListResponseDto } from '@components/error-report/dto/response/error-report-list.response.dto';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { UpdateErrorReportRequestDto } from '@components/error-report/dto/request/update-error-report.request.dto';
import { ErrorReportByCommandItemWarehouseRequestDto } from '@components/error-report/dto/request/error-report-by-command-item-warehouse.request.dto';
import { CreateErrorReportRequestDto } from '@components/error-report/dto/request/create-error-report.request.dto';
import { STAGES_OPTION } from '@components/quality-point/quality-point.constant';
import { UpdateErrorReportsAfterRepairRequestDto } from '@components/error-report/dto/request/update-error-reports-after-repair.request.dto';
import { ErrorReportListIOForAppRequestDto } from '@components/error-report/dto/request/error-report-list-io-for-app.request.dto';
import { ErrorReportListIOForAppResponseDto } from '@components/error-report/dto/response/error-report-list-io-for-app.response.dto';
import { OrderTypeProductionOrderEnum } from '@components/sale/sale.constant';
import { RejectErrorReportRequestDto } from '@components/error-report/dto/request/reject-error-report.request.dto';
import { ConfirmProduceStepErrorReportRequestDto } from '@components/error-report/dto/request/confirm-produce-step-error-report.request.dto';
import { QCType } from '@entities/error-report/error-report.entity';
import { CreateErrorReportIOqcRequestDto } from '@components/error-report/dto/request/create-error-report-ioqc.request.dto';
import { ConfirmIOqcErrorReportRequestDto } from '@components/error-report/dto/request/confirm-ioqc-error-report.request.dto';
import { DetailErrorReportResponseDto } from '@components/error-report/dto/response/error-report-detail-io-for-app.response.dto';
import { PermissionCode } from '@core/decorator/get-code.decorator';
import {
  CONFIRM_PRODUCE_STEP_QC_ERROR_REPORT_PERMISSION,
  REJECT_PRODUCE_STEP_QC_ERROR_REPORT_PERMISSION,
  VIEW_PRODUCE_STEP_QC_ERROR_REPORT_PERMISSION,
} from '@utils/permissions/app/produce-step-qc';
import {
  CONFIRM_INPUT_QC_ERROR_REPORT_PERMISSION, CREATE_INPUT_QC_ERROR_REPORT_PERMISSION,
  REJECT_INPUT_QC_ERROR_REPORT_PERMISSION,
  VIEW_INPUT_QC_ERROR_REPORT_PERMISSION
} from "@utils/permissions/app/input-qc";
import {
  CONFIRM_OUTPUT_QC_ERROR_REPORT_PERMISSION, CREATE_OUTPUT_QC_ERROR_REPORT_PERMISSION,
  REJECT_OUTPUT_QC_ERROR_REPORT_PERMISSION,
  VIEW_OUTPUT_QC_ERROR_REPORT_PERMISSION
} from "@utils/permissions/app/output-qc";
import { generatePermissionCodes } from '@utils/common';
import {
  CONFIRM_ERROR_REPORT_PERMISSION,
  REJECT_ERROR_REPORT_PERMISSION,
  VIEW_ERROR_REPORT_PERMISSION,
} from '@utils/permissions/web/error-report';
import { ErrorReportDetailWebRequestDto } from '@components/error-report/dto/request/error-report-detail-web.request.dto';
import { ProducingStepErrorReportDetailForAppRequestDto } from '@components/error-report/dto/request/producing-step-error-report-detail-for-app.request.dto';
import { GetDetailErrorReportIOqcForAppRequestDto } from '@components/error-report/dto/request/get-detail-error-report-i-oqc-for-app.request.dto';
import { IS_EXPORT } from '@constant/common';

const CONFIRM_IO_QC_ERROR_REPORT_PERMISSION = generatePermissionCodes([
  CONFIRM_INPUT_QC_ERROR_REPORT_PERMISSION.code,
  CONFIRM_OUTPUT_QC_ERROR_REPORT_PERMISSION.code,
  CONFIRM_ERROR_REPORT_PERMISSION.code,
]);

const REJECT_IO_QC_ERROR_REPORT_PERMISSION = generatePermissionCodes([
  REJECT_INPUT_QC_ERROR_REPORT_PERMISSION.code,
  REJECT_OUTPUT_QC_ERROR_REPORT_PERMISSION.code,
  REJECT_ERROR_REPORT_PERMISSION.code,
]);

const CONFIRM_PRODUCE_STEP_ERROR_REPORT_PERMISSION = generatePermissionCodes([
  CONFIRM_ERROR_REPORT_PERMISSION.code,
  CONFIRM_PRODUCE_STEP_QC_ERROR_REPORT_PERMISSION.code,
]);

const REJECT_PRODUCE_STEP_ERROR_REPORT_PERMISSION = generatePermissionCodes([
  REJECT_ERROR_REPORT_PERMISSION.code,
  REJECT_PRODUCE_STEP_QC_ERROR_REPORT_PERMISSION.code,
]);

@Controller('error-report')
export class ErrorReportController {
  constructor(
    @Inject('ErrorReportServiceInterface')
    private readonly errorReportService: ErrorReportServiceInterface,
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
  ) {}

  @PermissionCode(VIEW_ERROR_REPORT_PERMISSION.code)
  @MessagePattern('error_report_detail')
  public async getDetail(id: number): Promise<ResponsePayload<any>> {
    return await this.errorReportService.getDetail(id);
  }

  // Hiển thị detail trên web 8 9
  @PermissionCode(VIEW_ERROR_REPORT_PERMISSION.code)
  @MessagePattern('error_report_detail_web')
  public async getDetailWeb(
    @Body() payload: ErrorReportDetailWebRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.errorReportService.getDetailWeb(request.id);
  }

  @PermissionCode(VIEW_ERROR_REPORT_PERMISSION.code)
  @MessagePattern('error_report_list')
  public async getList(
    @Body() payload: ErrorReportListRequestDto,
  ): Promise<ResponsePayload<ErrorReportListResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.errorReportService.getList(request);
  }

  @MessagePattern('error_report_export')
  public async exportErrorReport(
    @Body() payload: ErrorReportListRequestDto,
  ): Promise<ResponsePayload<ErrorReportListResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.isExport = IS_EXPORT;

    return await this.errorReportService.getList(request);
  }

  @MessagePattern('error_report_update')
  public async update(
    @Body() payload: UpdateErrorReportRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.errorReportService.update(request);
  }

  @MessagePattern('error_report_delete')
  public async delete(id: number): Promise<ResponsePayload<any>> {
    return await this.errorReportService.delete(id);
  }

  @MessagePattern('error_report_by_stage_command_item_warehouse')
  public async getListErrorReportByCommandItemWarehouse(
    @Body() payload: ErrorReportByCommandItemWarehouseRequestDto,
  ): Promise<ResponsePayload<ErrorReportListResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.errorReportService.getListErrorReportByCommandItemWarehouse(
      request,
    );
  }

  @MessagePattern('error_report_show_create_form')
  public async showCreateForm(
    transactionHistoryId: number,
  ): Promise<ResponsePayload<any>> {
    return await this.errorReportService.showCreateForm(transactionHistoryId);
  }

  @MessagePattern('create_produce_step_error_report')
  public async createProduceStepsErrorReport(
    payload: CreateErrorReportRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.errorReportService.createProduceStepsErrorReport(request);
  }

  @PermissionCode(CREATE_INPUT_QC_ERROR_REPORT_PERMISSION.code)
  @MessagePattern('create_po_error_report')
  public async createPurchasedOrderErrorReport(
    payload: CreateErrorReportIOqcRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.errorReportService.createIoqcErrorReport(
      request,
      STAGES_OPTION.PO_IMPORT,
      QCType.InputQC,
    );
  }

  @PermissionCode(CREATE_OUTPUT_QC_ERROR_REPORT_PERMISSION.code)
  @MessagePattern('create_so_error_report')
  public async createSaleOrderErrorReport(
    payload: CreateErrorReportIOqcRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.errorReportService.createIoqcErrorReport(
      request,
      STAGES_OPTION.SO_EXPORT,
      QCType.OutputQC,
    );
  }

  @PermissionCode(CREATE_INPUT_QC_ERROR_REPORT_PERMISSION.code)
  @MessagePattern('create_pro_import_error_report')
  public async createProductionImportErrorReport(
    payload: CreateErrorReportIOqcRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.errorReportService.createIoqcErrorReport(
      request,
      STAGES_OPTION.PRO_IMPORT,
      QCType.InputQC,
    );
  }

  @PermissionCode(CREATE_OUTPUT_QC_ERROR_REPORT_PERMISSION.code)
  @MessagePattern('create_pro_export_error_report')
  public async createProductionExportErrorReport(
    payload: CreateErrorReportIOqcRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.errorReportService.createIoqcErrorReport(
      request,
      STAGES_OPTION.PRO_EXPORT,
      QCType.OutputQC,
    );
  }

  @MessagePattern('get_error_report_detail_by_work_order')
  public async getErrorReportDetailByWO(workOrderId: number): Promise<any> {
    return await this.errorReportService.getDetailByWO(workOrderId);
  }

  @MessagePattern('update_error_report_after_repair')
  public async updateErrorReportAfterRepair(
    payload: UpdateErrorReportsAfterRepairRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.errorReportService.updateErrorReportAfterRepair(request);
  }

  @PermissionCode(VIEW_PRODUCE_STEP_QC_ERROR_REPORT_PERMISSION.code)
  @MessagePattern('producing_step_error_report_list_for_app')
  public async getStageListForApp(
    payload: ErrorReportListRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.errorReportService.getStageListForApp(request);
  }

  @PermissionCode(VIEW_PRODUCE_STEP_QC_ERROR_REPORT_PERMISSION.code)
  @MessagePattern('producing_step_error_report_detail_for_app')
  public async getDetailForApp(
    @Body() payload: ProducingStepErrorReportDetailForAppRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.errorReportService.getStageDetailForApp(request.id);
  }

  // Danh sách phiếu báo cáo lỗi app đầu vào
  @PermissionCode(VIEW_INPUT_QC_ERROR_REPORT_PERMISSION.code)
  @MessagePattern('input_error_report_list_for_app')
  public async getListErrorReportInputForApp(
    payload: ErrorReportListIOForAppRequestDto,
  ): Promise<ResponsePayload<ErrorReportListIOForAppResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.type = OrderTypeProductionOrderEnum.Input;

    return await this.errorReportService.getListErrorReportIOqcForApp(request);
  }

  @PermissionCode(VIEW_INPUT_QC_ERROR_REPORT_PERMISSION.code)
  @MessagePattern('error_report_detail_for_app')
  public async getDetailErrorReportIOqcForApp(
    @Body() payload: GetDetailErrorReportIOqcForAppRequestDto,
  ): Promise<ResponsePayload<DetailErrorReportResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.errorReportService.getDetailErrorReportIOqcForApp(
      request.id,
    );
  }

  // Danh sách phiếu báo cáo lỗi app đầu ra
  @PermissionCode(VIEW_OUTPUT_QC_ERROR_REPORT_PERMISSION.code)
  @MessagePattern('output_error_report_list_for_app')
  public async getListErrorReportOutputForApp(
    payload: ErrorReportListIOForAppRequestDto,
  ): Promise<ResponsePayload<ErrorReportListIOForAppResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.type = OrderTypeProductionOrderEnum.Output;

    return await this.errorReportService.getListErrorReportIOqcForApp(request);
  }

  @PermissionCode(CONFIRM_PRODUCE_STEP_ERROR_REPORT_PERMISSION)
  @MessagePattern('produce_step_error_report_confirm')
  public async confirmProduceStepErrorReport(
    @Body() payload: ConfirmProduceStepErrorReportRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.errorReportService.confirmProduceStepErrorReport(request);
  }

  @PermissionCode(REJECT_PRODUCE_STEP_ERROR_REPORT_PERMISSION)
  @MessagePattern('produce_step_error_report_reject')
  public async rejectProduceStepErrorReport(
    @Body() payload: RejectErrorReportRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.errorReportService.rejectErrorReport(request);
  }

  @PermissionCode(CONFIRM_IO_QC_ERROR_REPORT_PERMISSION)
  @MessagePattern('ioqc_error_report_confirm')
  public async confirmIOqcErrorReport(
    @Body() payload: ConfirmIOqcErrorReportRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.errorReportService.confirmIOqcErrorReport(request);
  }

  @PermissionCode(REJECT_IO_QC_ERROR_REPORT_PERMISSION)
  @MessagePattern('ioqc_error_report_reject')
  public async rejectIOqcErrorReport(
    @Body() payload: RejectErrorReportRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.errorReportService.rejectErrorReport(request);
  }

  @MessagePattern('get_stage_error_report_list_by_wo')
  public async getStageErrorReportListByWO(workOrderId: number): Promise<any> {
    return await this.errorReportService.getListByWO(workOrderId);
  }
}
