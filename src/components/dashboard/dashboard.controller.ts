import { Body, Controller, Inject } from "@nestjs/common";
import { DashboardServiceInterface } from "@components/dashboard/interface/dashboard.service.interface";
import { MessagePattern } from "@nestjs/microservices";
import { isEmpty } from "@utils/object.util";
import { GetDashboardFinishedItemProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-finished-item-progress.request.dto";
import { GetProduceStepsByMoAndItemRequestDto } from "@components/dashboard/dto/request/get-produce-steps-by-mo-and-item.request.dto";
import { GetDashboardIoQcProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-io-qc-progress-request.dto";
import { TransactionHistoryIOqcTypeEnum } from "@components/transaction-history/transaction-history.constant";
import { GetDashboardOverallQcProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-overall-qc-progress.request.dto";
import { GetDashboardErrorRequestDto } from '@components/dashboard/dto/request/get-dashboard-error.request.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(
    @Inject('DashboardServiceInterface')
    private readonly dashboardService: DashboardServiceInterface,
  ) {}

  @MessagePattern('qmsx_dashboard_producing_step_qc_progress')
  public async getDashboardProducingStepQCProgress(
    @Body() payload: GetDashboardFinishedItemProgressRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.dashboardService.getDashboardProducingStepQCProgress(
      request,
    );
  }

  @MessagePattern('mo_in_progress_list')
  public async getInProgressMoList(): Promise<any> {
    return await this.dashboardService.getInProgressMoList();
  }

  @MessagePattern('get_items_by_mo')
  public async getItemsByMo(id: number): Promise<any> {
    return await this.dashboardService.getItemsByMo(id);
  }

  @MessagePattern('get_produce_steps_by_mo_and_item')
  public async getProduceStepsByMoAndItem(
    @Body() payload: GetProduceStepsByMoAndItemRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.dashboardService.getProduceStepsByMoAndItem(request);
  }

  @MessagePattern('qmsx_dashboard_input_qc_progress')
  public async getDashboardInputQcProgress(
    @Body() payload: GetDashboardIoQcProgressRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.dashboardService.getDashboardIOQcProgress(
      request,
      TransactionHistoryIOqcTypeEnum.input,
    );
  }

  @MessagePattern('qmsx_dashboard_output_qc_progress')
  public async getDashboardOutputProgress(
    @Body() payload: GetDashboardIoQcProgressRequestDto
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.dashboardService.getDashboardIOQcProgress(
      request,
      TransactionHistoryIOqcTypeEnum.output,
    );
  }
  
  @MessagePattern('qmsx_dashboard_overall_qc_progress')
  public async getDashboardOverallProgress(
    @Body() payload: GetDashboardOverallQcProgressRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.dashboardService.getDashboardOverallProgress(request);
  }
  
  @MessagePattern('qmsx_dashboard_summary')
  public async getDashboardSummary(): Promise<any> {
    return await this.dashboardService.getDashboardSummary();
  }

  @MessagePattern('qmsx_dashboard_error_type')
  public async getDashboardByErrorId(
    @Body() payload: GetDashboardErrorRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.dashboardService.getDashboardByErrorType(request);
  }

  @MessagePattern('qmsx_dashboard_cause_group')
  public async getDashboardByCauseGroup(
    @Body() payload: GetDashboardErrorRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.dashboardService.getDashboardByCauseGroup(request);
  }

  @MessagePattern('qmsx_dashboard_error_status')
  public async getDashboardErrorReportByStatus(
    @Body() payload: GetDashboardErrorRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.dashboardService.getDashboardByStatus(request);
  }

  @MessagePattern('qmsx_dashboard_action_category')
  public async getDashboardActionCategory(
    @Body() payload: GetDashboardErrorRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.dashboardService.getDashboardByActionCategory(request);
  }
}
