import { Body, Controller, Inject } from '@nestjs/common';
import { TransactionHistoryServiceInterface } from '@components/transaction-history/interface/transaction-history.service.interface';
import { MessagePattern } from '@nestjs/microservices';
import { GetListProducingStepsTransactionHistoryRequestDto } from '@components/transaction-history/dto/request/get-list-producing-steps-transaction-history.request.dto';
import { isEmpty } from 'lodash';
import { ResponsePayload } from '@utils/response-payload';
import { GetListProducingStepsTransactionHistoryResponseDto } from '@components/transaction-history/dto/response/get-list-producing-steps-transaction-history.response.dto';
import { ProducingStepsTransactionHistoryResponseDto } from '@components/transaction-history/dto/response/producing-steps-transaction-history.response.dto';
import { CreateProducingStepsTransactionHistoryRequestDto } from '@components/transaction-history/dto/request/create-producing-steps-transaction-history-request.dto';
import { GetMoListRequestDto } from '@components/produce/dto/request/get-mo-list-request.dto';
import { GetPlanItemMoListRequestDto } from '@components/produce/dto/request/get-plan-item-mo-list-request.dto';
import { GetMoItemDetailRequestDto } from '@components/produce/dto/request/get-mo-item-detail-request.dto';
import { GetWOSummaryScanRequestDto } from '@components/transaction-history/dto/request/get-wo-summary-scan-request.dto';
import { GetWoSummaryScanResponseDto } from '@components/transaction-history/dto/response/get-wo-summary-scan-response.dto';
import { GetListIoqcOrderResponseDto } from '@components/item/dto/response/get-list-ioqc-order.response.dto';
import { GetListIoqcWarehouseByOrderResponseDto } from '@components/item/dto/response/get-list-ioqc-warehouse-by-order.response.dto';
import { GetListIoqcItemByWarehouseAndOrderResponseDto } from '@components/item/dto/response/get-list-ioqc-item-by-warehouse-and-order.response.dto';
import {
  TransactionHistoryTypeEnum,
  TransactionHistoryIOqcTypeEnum,
} from './transaction-history.constant';
import { GetListQcInputOrderRequestDto } from '@components/item/dto/request/get-list-qc-input-order.request.dto';
import { GetListQcOutputOrderRequestDto } from '@components/item/dto/request/get-list-qc-output-order.request.dto';
import { GetListQcInputWarehouseByOrderRequestDto } from '@components/item/dto/request/get-list-qc-input-warehouse-by-order.request.dto';
import { GetListQcOutputWarehouseByOrderRequestDto } from '@components/item/dto/request/get-list-qc-output-warehouse-by-order.request.dto';
import { GetListQcInputItemByWarehouseAndOrderRequestDto } from '@components/item/dto/request/get-list-qc-input-item-by-warehouse-and-order.request.dto';
import { GetListQcOutputItemByWarehouseAndOrderRequestDto } from '@components/item/dto/request/get-list-qc-output-item-by-warehouse-and-order.request.dto';
import {
  DetailTransactionHistoryForAppResponseDto,
  TransactionHistoryForAppResponseDto,
} from '@components/transaction-history/dto/response/transaction-history-for-app.response.dto';
import { ProducingStepsTransactionHistoryDetailResponseDto } from '@components/transaction-history/dto/response/producing-steps-transaction-history-detail.response.dto';
import { GetListQcTransactionInitDataRequestDto } from '@components/transaction-history/dto/request/get-list-qc-transaction-init-data.request.dto';
import { CreateTransactionHistoryLogTimeRequestDto } from '@components/transaction-history/dto/request/create-transaction-history-log-time.request.dto';
import { UpdateTransactionHistoryLogTimeRequestDto } from '@components/transaction-history/dto/request/update-transaction-history-log-time.request.dto';
import { CreateTransactionHistoryLogTimeAdditionRequestDto } from '@components/transaction-history/dto/request/create-transaction-history-log-time-addition.request.dto';
import { UpdateTransactionHistoryLogTimeAdditionRequestDto } from '@components/transaction-history/dto/request/update-transaction-history-log-time-addition.request.dto';
import { DetailTransactionHistoryForWebResponseDto } from '@components/transaction-history/dto/response/transaction-history-for-web.response.dto';
import { CreateInputProducingStepsTransactionHistoryRequestDto } from "@components/transaction-history/dto/request/create-input-producing-steps-transaction-history.request.dto";
import { ValidateWcQcPlanForWorkOrderRequestDto } from "@components/transaction-history/dto/request/validate-wc-qc-plan-for-work-order.request.dto";
import { GetMaximumQcQuantityRequestDto } from "@components/transaction-history/dto/request/get-maximum-qc-quantity.request.dto";
import { PermissionCode } from "@core/decorator/get-code.decorator";
import { VIEW_TRANSACTION_HISTORY_PERMISSION } from "@utils/permissions/web/transaction-history";
import { GetDetailProducingStepsQcHistoryRequestDto } from "@components/transaction-history/dto/request/get-detail-producing-steps-qc-history.request.dto";
import {
  CREATE_HISTORY_PRODUCE_STEP_QC_PERMISSION,
  PRODUCE_STEP_QC_PROGRESS_PERMISSION,
} from '@utils/permissions/app/produce-step-qc';
import {
  INPUT_QC_PROGRESS_PERMISSION,
  VIEW_HISTORY_INPUT_QC_PERMISSION,
} from '@utils/permissions/app/input-qc';
import { GetDetailQcInputTransactionInitDataRequestDto } from '@components/transaction-history/dto/request/get-detail-qc-input-transaction-history-init-data.request.dto';
import { OUTPUT_QC_PROGRESS_PERMISSION, VIEW_HISTORY_OUTPUT_QC_PERMISSION } from "@utils/permissions/app/output-qc";
import { GetDetailQcOutputTransactionInitDataRequestDto } from '@components/transaction-history/dto/request/get-detail-qc-output-transaction-history-init-data.request.dto';
import { GetListTransactionHistoryOverallRequestDto } from "@components/transaction-history/dto/request/get-list-transaction-history-overall.request.dto";
import { TRANSACTION_HOME_PERMISSION } from "@utils/permissions/app/home";

@Controller('/producing-steps/transaction-histories/')
export class TransactionHistoryController {
  constructor(
    @Inject('TransactionHistoryServiceInterface')
    private readonly transactionHistoryService: TransactionHistoryServiceInterface,
  ) {}

  @PermissionCode(VIEW_TRANSACTION_HISTORY_PERMISSION.code)
  @MessagePattern('producing_steps_transaction_history_list')
  public async getListProducingStepsQCHistory(
    @Body() payload: GetListProducingStepsTransactionHistoryRequestDto,
  ): Promise<
    ResponsePayload<GetListProducingStepsTransactionHistoryResponseDto | any>
  > {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.transactionHistoryService.getListProducingStepsQCHistory(
      request,
    );
  }

  @PermissionCode(VIEW_TRANSACTION_HISTORY_PERMISSION.code)
  @MessagePattern('producing_steps_transaction_history_detail')
  public async getDetailProducingStepsQCHistory(
    @Body() payload: GetDetailProducingStepsQcHistoryRequestDto,
  ): Promise<
    ResponsePayload<ProducingStepsTransactionHistoryResponseDto | any>
  > {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.transactionHistoryService.getDetailProducingStepsQCHistory(
      request.id,
    );
  }

  @PermissionCode(CREATE_HISTORY_PRODUCE_STEP_QC_PERMISSION.code)
  @MessagePattern('create_producing_steps_transaction_history')
  public async createProducingStepsQCHistory(
    @Body() payload: CreateProducingStepsTransactionHistoryRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.transactionHistoryService.createProducingStepTransactionHistory(
      request,
    );
  }

  @PermissionCode(CREATE_HISTORY_PRODUCE_STEP_QC_PERMISSION.code)
  @MessagePattern('create_input_producing_steps_transaction_history')
  public async createInputProducingStepsQCHistory(
    @Body() payload: CreateInputProducingStepsTransactionHistoryRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.transactionHistoryService.createInputProducingStepTransactionHistory(
      request,
    );
  }

  @MessagePattern('get_producing_steps_transaction_history_WO_summary')
  public async getWOSummaryOfProducingStepsTransactionHistory(
    @Body() payload: GetWOSummaryScanRequestDto,
  ): Promise<ResponsePayload<GetWoSummaryScanResponseDto | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.transactionHistoryService.getWOSummaryOfProducingStepsTransactionHistory(
      request,
    );
  }

  @PermissionCode(PRODUCE_STEP_QC_PROGRESS_PERMISSION.code)
  @MessagePattern('get_mo_list_for_qc')
  public async getMoList(@Body() payload: GetMoListRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.transactionHistoryService.getMoList(request);
  }

  @PermissionCode(PRODUCE_STEP_QC_PROGRESS_PERMISSION.code)
  @MessagePattern('get_item_mo_list_for_qc')
  public async getPlanItemMoList(
    payload: GetPlanItemMoListRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.transactionHistoryService.getPlanItemMoList(request);
  }

  @PermissionCode(PRODUCE_STEP_QC_PROGRESS_PERMISSION.code)
  @MessagePattern('get_item_mo_detail_for_qc')
  public async getMoItemDetail(
    payload: GetMoItemDetailRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.transactionHistoryService.getMoItemDetail(request);
  }

  /**
   * Danh sách mã lệnh SO AND PRO công đoạn đầu ra (màn 1)
   */
  @PermissionCode(OUTPUT_QC_PROGRESS_PERMISSION.code)
  @MessagePattern('get_list_qc_output_order')
  public async getListQcOutputOrder(
    @Body() payload: GetListQcOutputOrderRequestDto,
  ): Promise<ResponsePayload<GetListIoqcOrderResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.transactionHistoryService.getListIoqcOrder(request);
  }

  /**
   * List Get Warehouse By Order OUTPUT 2
   */
  @PermissionCode(OUTPUT_QC_PROGRESS_PERMISSION.code)
  @MessagePattern('get_list_qc_output_warehouse_by_order')
  public async getListQcOutPutWarehouseByOrder(
    @Body() payload: GetListQcOutputWarehouseByOrderRequestDto,
  ): Promise<ResponsePayload<GetListIoqcWarehouseByOrderResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.transactionHistoryService.getListIoqcWarehouseByOrder(
      request,
    );
  }

  /**
   * List Get Item by Warehouse And Order OUTPUT 3
   */
  @PermissionCode(OUTPUT_QC_PROGRESS_PERMISSION.code)
  @MessagePattern('get_list_qc_output_item_by_warehouse_and_order')
  public async getListQcOutputItemByWarehouseAndOrder(
    @Body() payload: GetListQcOutputItemByWarehouseAndOrderRequestDto,
  ): Promise<
    ResponsePayload<GetListIoqcItemByWarehouseAndOrderResponseDto | any>
  > {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.transactionHistoryService.getListIoqcItemByWarehouseAndOrder(
      request,
    );
  }

  /**
   * List Get PO AND PRO INPUT 1
   */
  @PermissionCode(INPUT_QC_PROGRESS_PERMISSION.code)
  @MessagePattern('get_list_qc_input_order')
  public async getListQcInputOrder(
    @Body() payload: GetListQcInputOrderRequestDto,
  ): Promise<ResponsePayload<GetListIoqcOrderResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.transactionHistoryService.getListIoqcOrder(request);
  }

  /**
   * List Get Warehouse By Order INPUT 2
   */
  @PermissionCode(INPUT_QC_PROGRESS_PERMISSION.code)
  @MessagePattern('get_list_qc_input_warehouse_by_order')
  public async getListQcInputWarehouseByOrder(
    @Body() payload: GetListQcInputWarehouseByOrderRequestDto,
  ): Promise<ResponsePayload<GetListIoqcWarehouseByOrderResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.transactionHistoryService.getListIoqcWarehouseByOrder(
      request,
    );
  }

  /**
   * List Get Item by Warehouse And Order INPUT 3
   */
  @PermissionCode(INPUT_QC_PROGRESS_PERMISSION.code)
  @MessagePattern('get_list_qc_input_item_by_warehouse_and_order')
  public async getListQcInputItemByWarehouseAndOrder(
    @Body() payload: GetListQcInputItemByWarehouseAndOrderRequestDto,
  ): Promise<
    ResponsePayload<GetListIoqcItemByWarehouseAndOrderResponseDto | any>
  > {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.transactionHistoryService.getListIoqcItemByWarehouseAndOrder(
      request,
    );
  }

  @MessagePattern('init_input_qc_transaction')
  public async getInputQcTransactionInitData(): Promise<ResponsePayload<any>> {
    return await this.transactionHistoryService.getInitData(
      TransactionHistoryTypeEnum.OutputProducingStep,
    );
  }

  @PermissionCode(VIEW_HISTORY_OUTPUT_QC_PERMISSION.code)
  @MessagePattern('get_list_qc_output_transaction_for_app')
  public async getListQcOutputTransactionInitData(
    @Body() payload: GetListQcTransactionInitDataRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.type = TransactionHistoryIOqcTypeEnum.output;

    return await this.transactionHistoryService.getListTransactionHistoryIOqcForApp(
      request,
    );
  }

  @PermissionCode(VIEW_HISTORY_OUTPUT_QC_PERMISSION.code)
  @MessagePattern('get_detail_qc_output_transaction_for_app')
  public async getDetailQcOutputTransactionInitData(
    @Body() payload: GetDetailQcOutputTransactionInitDataRequestDto,
  ): Promise<ResponsePayload<DetailTransactionHistoryForAppResponseDto>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.transactionHistoryService.getDetailTransactionHistory(
      request.id,
    );
  }

  @PermissionCode(VIEW_HISTORY_INPUT_QC_PERMISSION.code)
  @MessagePattern('get_detail_qc_input_transaction_for_app')
  public async getDetailQcInputTransactionInitData(
    @Body() payload: GetDetailQcInputTransactionInitDataRequestDto,
  ): Promise<ResponsePayload<DetailTransactionHistoryForAppResponseDto>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.transactionHistoryService.getDetailTransactionHistory(
      request.id,
    );
  }

  @MessagePattern('get_detail_qc_output_transaction_for_web')
  public async getDetailQcOutputTransactionInitDataWeb(
    id: number,
  ): Promise<ResponsePayload<DetailTransactionHistoryForWebResponseDto>> {
    return await this.transactionHistoryService.getDetailTransactionHistoryIOqcWeb(
      id,
    );
  }

  @MessagePattern('get_detail_qc_input_transaction_for_web')
  public async getDetailQcInputTransactionInitDataWeb(
    id: number,
  ): Promise<ResponsePayload<DetailTransactionHistoryForWebResponseDto>> {
    return await this.transactionHistoryService.getDetailTransactionHistoryIOqcWeb(
      id,
    );
  }

  @PermissionCode(VIEW_HISTORY_INPUT_QC_PERMISSION.code)
  @MessagePattern('get_list_qc_input_transaction_for_app')
  public async getListQcInputTransactionInitData(
    @Body() payload: GetListQcTransactionInitDataRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.type = TransactionHistoryIOqcTypeEnum.input;

    return await this.transactionHistoryService.getListTransactionHistoryIOqcForApp(
      request,
    );
  }

  @MessagePattern('get_list_order_output_for_app')
  public async getListOrderOutputData(): Promise<ResponsePayload<any>> {
    return await this.transactionHistoryService.getListOrder(1);
  }

  @MessagePattern('get_list_order_input_for_app')
  public async getListOrderInputData(): Promise<ResponsePayload<any>> {
    return await this.transactionHistoryService.getListOrder(2);
  }

  @MessagePattern('not_reported_producing_steps_transaction_history')
  public async getNotReportedProducingTransactionHistory(
    createdBy: number,
  ): Promise<any> {
    return await this.transactionHistoryService.getNotReportedProducingTransactionHistory(
      createdBy,
    );
  }

  @MessagePattern('not_reported_output_qc_transaction_history')
  public async getNotReportedOutputQcTransactionHistory(
    createdBy: number,
  ): Promise<any> {
    return await this.transactionHistoryService.getNotReportedOutputQcTransactionHistory(
      createdBy,
    );
  }

  @MessagePattern('not_reported_input_qc_transaction_history')
  public async getNotReportedInputQcTransactionHistory(
    createdBy: number,
  ): Promise<any> {
    return await this.transactionHistoryService.getNotReportedInputQcTransactionHistory(
      createdBy,
    );
  }

  @MessagePattern('get_list_qc_output_transaction_for_web')
  public async getListQcOutputTransactionInitDataForWeb(
    @Body() payload: GetListQcTransactionInitDataRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.transactionHistoryService.getListTransactionHistoryIOqcForWeb(
      request,
      TransactionHistoryIOqcTypeEnum.output,
    );
  }

  @MessagePattern('get_list_qc_input_transaction_for_web')
  public async getListQcInputTransactionInitDataForWeb(
    @Body() payload: GetListQcTransactionInitDataRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.transactionHistoryService.getListTransactionHistoryIOqcForWeb(
      request,
      TransactionHistoryIOqcTypeEnum.input,
    );
  }

  @MessagePattern('create_produce_step_qc_log_time')
  public async createProduceStepQcLogTime(
    @Body() payload: CreateTransactionHistoryLogTimeRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.transactionHistoryService.createProduceStepQcLogTime(
      request,
    );
  }

  @MessagePattern('update_produce_step_qc_log_time')
  public async updateProduceStepQcLogTime(
    @Body() payload: UpdateTransactionHistoryLogTimeRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.transactionHistoryService.updateProduceStepQcLogTime(
      request,
    );
  }

  @MessagePattern('create_produce_step_qc_log_time_addition')
  public async createProduceStepQcLogTimeAddition(
    @Body() payload: CreateTransactionHistoryLogTimeAdditionRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.transactionHistoryService.createProduceStepQcLogTimeAddition(
      request,
    );
  }

  @MessagePattern('get_produce_step_qc_log_time_detail')
  public async getProduceStepQcLogTimeDetail(id: number): Promise<any> {
    return await this.transactionHistoryService.getProduceStepQcLogTimeDetail(
      id,
    );
  }

  @MessagePattern('update_produce_step_qc_log_time_addition')
  public async updateProduceStepQcLogTimeAddition(
    @Body() payload: UpdateTransactionHistoryLogTimeAdditionRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.transactionHistoryService.updateProduceStepQcLogTimeAddition(
      request,
    );
  }

  @MessagePattern('get_not_finished_qc_log_time')
  public async getNotFinishedQcLogTime(): Promise<any> {
    return await this.transactionHistoryService.getNotFinishedQcLogTime();
  }

  @MessagePattern('validate_wc_qc_plan_for_wo_before_qc')
  public async validateWcQcPlanForWorkOrder(
    @Body() payload: ValidateWcQcPlanForWorkOrderRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.transactionHistoryService.validateWcQcPlanForWorkOrder(
      request,
    );
  }

  @MessagePattern('get_maximum_produce_step_qc_quantity')
  public async getMaximumProduceStepQcQuantity(
    @Body() payload: GetMaximumQcQuantityRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.transactionHistoryService.getMaximumProduceStepQcQuantity(
      request,
    );
  }

  @PermissionCode(TRANSACTION_HOME_PERMISSION.code)
  @MessagePattern('get_list_transaction_history_overall')
  public async getListTransactionHistoryOverall(
    @Body() payload: GetListTransactionHistoryOverallRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.transactionHistoryService.getListTransactionHistoryOverall(
      request,
    );
  }
}
