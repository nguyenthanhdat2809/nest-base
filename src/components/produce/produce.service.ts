import { ResponseCodeEnum } from "@constant/response-code.enum";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { isEmpty } from "lodash";
import { ProduceServiceInterface } from "./interface/produce.service.interface";
import { ProducingStepsTransactionHistoryDetailRequestDto } from "@components/transaction-history/dto/request/producing-steps-transaction-history-detail.request.dto";
import { GetWOSummaryScanRequestDto } from "@components/transaction-history/dto/request/get-wo-summary-scan-request.dto";
import { plainToClass } from "class-transformer";
import { ErrorReportStageDetail } from "@entities/error-report/error-report-stage-detail.entity";
import { ItemServiceInterface } from "@components/item/interface/item.service.interface";
import {
  AlertEnvCodeAndNameResponseDto,
  AlertEnvResponseDto
} from "@components/alert/dto/response/alert-env.response.dto";
import { GetProducingStepDetailRequestDto } from "@components/produce/dto/request/get-producing-step-detail.request.dto";
import { UpdateWOQcQuantityRequestDto } from "@components/produce/dto/request/update-wo-qc-quantity.request.dto";
import { ResponseBuilder } from "@utils/response-builder";
import { ReportQcRequestDto } from "@components/report/dto/request/report-qc.request.dto";
import { GetMoListRequestDto } from "@components/produce/dto/request/get-mo-list-request.dto";
import { GetPlanItemMoListRequestDto } from "@components/produce/dto/request/get-plan-item-mo-list-request.dto";
import { GetMoItemDetailRequestDto } from "@components/produce/dto/request/get-mo-item-detail-request.dto";
import {
  BoqStatusEnum,
  CAN_QC_MO_PLAN_STATUS,
  CAN_QC_MO_STATUS,
  ManufacturingOrderFilterColumn,
  ManufacturingOrderPlanFilterColumn,
  WorkOrderFilterColumn,
  ManufacturingOrderStatusEnum,
} from '@components/produce/produce.constant';
import { WOPrintQrcodeRequestDto } from '@components/work-order/dto/request/wo-print-qr-code.request.dto';
import { GetDashboardFinishedItemProgressRequestDto } from '@components/dashboard/dto/request/get-dashboard-finished-item-progress.request.dto';
import { Filter } from '@utils/pagination.query';
import { GetWoListRequestDto } from '@components/work-order/dto/request/get-wo-list.request.dto';
import {
  CAN_PRINT_WORK_ORDER_QR_CODE,
  CAN_QC_WORK_ORDER,
  QC_CHECK,
} from '@components/work-order/work-order.constant';
import { UpdateWoMaterialInputQcQuantityRequestDto } from '@components/produce/dto/request/update-wo-material-input-qc-quantity.request.dto';
import { UpdateWoPreviousBomInputQcQuantityRequestDto } from '@components/produce/dto/request/update-wo-previous-bom-input-qc-quantity.request.dto';
import { GetProduceStepsByMoAndItemRequestDto } from '@components/dashboard/dto/request/get-produce-steps-by-mo-and-item.request.dto';
import { MoPlanResponseDto } from '@components/produce/dto/response/mo-plan.response.dto';

@Injectable()
export class ProduceService implements ProduceServiceInterface {
  constructor(
    @Inject('PRODUCE_SERVICE_CLIENT')
    private readonly produceServiceClient: ClientProxy,
    @Inject('ItemServiceInterface')
    private readonly itemService: ItemServiceInterface,
  ) {}

  async getProduceStepAll(params: any): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('get_list_producing_step', params)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return '';
      }

      return response.data;
    } catch (err) {
      return '';
    }
  }

  async getProduceStepByID(id: number): Promise<any> {
    const payload = { id: id };
    try {
      const response = await this.produceServiceClient
        .send('get_producing_step_detail', payload)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return '';
      }

      return response.data;
    } catch (err) {
      return '';
    }
  }

  async getRoutingByID(id: number): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('routing_detail', { id: id })
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return '';
      }

      return response.data;
    } catch (err) {
      return '';
    }
  }

  async getRoutingVersionByID(id: number): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('routing_version_detail', id)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return '';
      }

      return response.data;
    } catch (err) {
      return '';
    }
  }

  async getManufacturingOrderDetail(id: number): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('get_mo_detail', { id: id })
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return '';
      }

      return response.data;
    } catch (err) {
      return '';
    }
  }

  async getListProducingStepsQC(request: any): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('qc_list', request)
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return '';
      }
      const listQualityControlsData = response.data.items;
      return listQualityControlsData;
    } catch (err) {
      return '';
    }
  }

  async getListProducingStepsQCDetail(
    payload: ProducingStepsTransactionHistoryDetailRequestDto,
  ): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('qc_detail', payload)
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return '';
      }
      const result = response.data;
      return result;
    } catch (err) {
      return '';
    }
  }

  public async getProduceErrorReportStageDetail(
    errorReportStageDetail: ErrorReportStageDetail,
  ): Promise<any> {
    const moPromise = this.produceServiceClient
      .send('get_mo_detail', { id: errorReportStageDetail.moId })
      .toPromise();

    const routingPromise = this.produceServiceClient
      .send('routing_detail', { id: errorReportStageDetail.routingId })
      .toPromise();

    const producingStepPromise = this.produceServiceClient
      .send('get_producing_step_detail', {
        id: errorReportStageDetail.producingStepId,
      })
      .toPromise();

    const itemPromise = this.itemService.getItemById(
      errorReportStageDetail.itemId,
    );

    const [mo, routing, producingStep, item] = await Promise.all([
      moPromise,
      routingPromise,
      producingStepPromise,
      itemPromise,
    ]);

    const moData = mo.data;
    const moName = moData?.name;
    const moCode = moData?.code;
    const itemName = item?.name;

    return [routing?.data?.name, producingStep?.data?.name, moName, itemName, moCode];
  }

  // list data alert
  async getListManufacturingOrder(): Promise<any> {
    const request = {
      page: 1,
      limit: 200,
      isGetAll: '1',
      filter: [
        {
          column: 'status',
          text: `${ManufacturingOrderStatusEnum.CONFIRMED},
                 ${ManufacturingOrderStatusEnum.IN_PROGRESS}`,
        },
      ],
    };

    try {
      const responseManufacturingOrders = await this.produceServiceClient
        .send('get_mo_list', request)
        .toPromise();

      if (responseManufacturingOrders.statusCode !== ResponseCodeEnum.SUCCESS){
        return [];
      }

      const response = plainToClass(
        AlertEnvCodeAndNameResponseDto,
        responseManufacturingOrders?.data?.items,
        {
          excludeExtraneousValues: true,
        },
      );

      return response;
    } catch (err) {
      return [];
    }
  }

  async getItemByManufacturingOrderId(id: number): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send(
          'get_item_mo_list',
          {
            id: id, // id của MO
            onlyInProgressItem: '0' // Chỉ lấy những sản phẩm đang thực hiện
          }
        )
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) return [];

      const result = response.data.reduce((x, y) => {
        x.push({
          itemId: y.item?.itemId,
          code: y.item?.code,
        });
        return x;
      }, []);

      const uniqueResult = Array.from(new Set(result.map((a) => a.itemId))).map(
        (itemId) => {
          return result.find((a) => a.itemId === itemId);
        },
      );

      return uniqueResult;
    } catch (err) {
      return [];
    }
  }

  async getRoutingByItemId(id: number): Promise<any> {
    try {
      const responseBom = await this.produceServiceClient
        .send('get_bom_by_item_id', { itemId: id })
        .toPromise();
      if (responseBom.statusCode !== ResponseCodeEnum.SUCCESS) return [];

      const routingId = responseBom?.data?.routingId;
      const responseRouting = await this.produceServiceClient
        .send('routing_detail', { id: routingId })
        .toPromise();

      if (responseRouting.statusCode !== ResponseCodeEnum.SUCCESS) return [];

      const response = plainToClass(AlertEnvResponseDto, responseRouting.data, {
        excludeExtraneousValues: true,
      });

      return [response];
    } catch (err) {
      return [];
    }
  }

  async envAlertGetProducingStepByRoutingId(id: number): Promise<any> {
    try {
      const responseProducingSteps = await this.produceServiceClient
        .send('get_producing_step_by_routing_version_id', {
          routeVersionId: id,
        })
        .toPromise();

      if (responseProducingSteps.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }

      const result = responseProducingSteps.data.producingSteps;

      const response = plainToClass(AlertEnvResponseDto, result, {
        excludeExtraneousValues: true,
      });

      return response;
    } catch (err) {
      return [];
    }
  }

  async getWorkOrderById(id: number): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('work_order_scan', { qrCode: id.toString() })
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return '';
      }
      return response.data;
    } catch (err) {
      return '';
    }
  }

  async getWorkOrderByQrCode(
    request: GetWOSummaryScanRequestDto,
  ): Promise<any> {
    try {
      // Get Work Order
      const response = await this.produceServiceClient
        .send('work_order_scan', request)
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return '';
      }
      return response.data;
    } catch (err) {
      return '';
    }
  }

  async getProduceStepById(
    request: GetProducingStepDetailRequestDto,
  ): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('get_producing_step_detail', request)
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return '';
      }
      return response.data;
    } catch (err) {
      return '';
    }
  }

  async updateWOQcQuantity(
    request: UpdateWOQcQuantityRequestDto,
  ): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('qc_create', request)
        .toPromise();
      return response;
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(err?.message || err)
        .build();
    }
  }

  /**
   * Get confirmed and in-progress boqs
   */
  public async getAvailableMos(): Promise<any> {
    const mosPromise = this.produceServiceClient
      .send('get_mo_list', {
        isGetAll: '1',
        qcCheckOut: '1', // qcCheckIn=1&qcCheckOut=0 1: Chỉ lấy những mo trong đó mo có 1 mo_plan và trong mo_plan có ít nhất 1 công đoạn cần qc
        filter: [
          {
            column: 'status',
            text: `${ManufacturingOrderStatusEnum.CONFIRMED},
                 ${ManufacturingOrderStatusEnum.IN_PROGRESS}`, // xác nhận hoặc đang thực hiện
          },
        ],
      })
      .toPromise();

    const [mosResponse] = await Promise.all([mosPromise]);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(mosResponse.data.items)
      .build();
  }

  /**
   * Get confirmed plans by MO ID
   * @param moId MO ID
   */
  public async getConfirmedPlansByMoId(moId: number): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('list_plan', {
          page: 1,
          limit: '200',
          filter: [
            { column: 'manufacturingOrderIds', text: `${moId}` },
            { column: 'status', text: '1,2' }, // trạng thái đã xác nhận và đang thực hiện
          ],
        })
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) return [];

      return response;
    } catch (err) {
      return [];
    }
  }

  public async getMoPlanDetail(moPlanId: number): Promise<any> {
    const plan = (await this.produceServiceClient
      .send('plan_detail', { planId: moPlanId })
      .toPromise())?.data;

    const response = plainToClass(MoPlanResponseDto, plan, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async getMoDetail(id: number): Promise<any> {
    return await this.produceServiceClient
      .send('get_mo_detail', { id: id })
      .toPromise();
  }

  async getListWorkOrder(request: ReportQcRequestDto): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('work_order_list', request)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) return [];

      return response;
    } catch (err) {
      return [];
    }
  }

  public async getMoList(request: GetMoListRequestDto): Promise<any> {
    try {
      const { keyword, filter } = request;
      const moFilter = [
        {
          column: ManufacturingOrderFilterColumn.STATUS,
          text: CAN_QC_MO_STATUS.toString(),
        },
      ];

      if (keyword) {
        moFilter.push({
          column: ManufacturingOrderFilterColumn.NAME,
          text: keyword,
        });
      }
      request.filter = filter ? filter.concat(moFilter) : moFilter;
      // remove keyword in request filter
      delete request.keyword;
      const response = await this.produceServiceClient
        .send('get_mo_list', request)
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return {
          items: [],
          total: 0,
        };
      }
      return {
        items: response.data?.items,
        total: response.data?.meta?.total,
      };
    } catch (err) {
      return {
        items: [],
        total: 0,
      };
    }
  }

  public async getPlanItemMoList(
    request: GetPlanItemMoListRequestDto,
  ): Promise<any> {
    try {
      const { filter } = request;
      const planFilterStatus = [
        {
          column: ManufacturingOrderPlanFilterColumn.STATUS,
          text: CAN_QC_MO_PLAN_STATUS.toString(),
        },
      ];
      request.filter = filter
        ? filter.concat(planFilterStatus)
        : planFilterStatus;
      const response = await this.produceServiceClient
        .send('get_plan_item_mo_list', request)
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response;
    } catch (err) {
      return [];
    }
  }

  async getMoItemDetail(request: GetMoItemDetailRequestDto): Promise<any> {
    try {
      // Filter Mo Item Detail with Work Order status: In progress and Confirmed
      const { filter } = request;
      const filterWoStatus = [
        {
          column: WorkOrderFilterColumn.WO_STATUS,
          text: CAN_QC_WORK_ORDER.toString(),
        },
        {
          column: WorkOrderFilterColumn.QC_CHECK,
          text: QC_CHECK.Checked,
        },
      ];
      request.filter = !isEmpty(filter)
        ? filter.concat(filterWoStatus)
        : filterWoStatus;
      const response = await this.produceServiceClient
        .send('get_item_mo_detail', request)
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response.data;
    } catch (err) {
      return [];
    }
  }

  public async getAvailableBoqsForQCHistory(): Promise<any> {
    try {
      const availableBoqs = await this.produceServiceClient
        .send('get_boq_list', {
          isGetAll: '1',
          filter: [
            {
              column: 'status',
              text: `${BoqStatusEnum.CONFIRMED},${BoqStatusEnum.IN_PROGRESS}, ${BoqStatusEnum.COMPLETED}`,
            },
          ],
        })
        .toPromise();
      if (availableBoqs.statusCode !== ResponseCodeEnum.SUCCESS) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withData([])
          .build();
      }
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData(availableBoqs.data.items)
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withData([])
        .build();
    }
  }
  public async getBomDetailById(id: number): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('get_bom_detail', { id: id })
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return '';
      }
      return response;
    } catch (err) {
      return '';
    }
  }

  public async printWOQrCode(request: WOPrintQrcodeRequestDto): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('print_work_order_qr_code', request)
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return '';
      }
      return response;
    } catch (err) {
      return '';
    }
  }

  public async getWorkOrderByIds(ids: number[]): Promise<any> {
    try {
      const payload = {
        filter: [
          {
            column: 'ids',
            text: ids.toString(),
          },
        ],
        isGetAll: '1',
      };
      const response = await this.produceServiceClient
        .send('work_order_list', payload)
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response.data.items;
    } catch (err) {
      return [];
    }
  }

  public async getDashboardProducingStepQCProgress(
    request: GetDashboardFinishedItemProgressRequestDto,
  ): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('dashboard_quality_control_progress', request)
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response.data;
    } catch (err) {
      return [];
    }
  }

  public async getWorkOrderByMoId(filter: Filter[]): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('work_order_list', { filter, isGetAll: '1' })
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response.data.items;
    } catch (err) {
      return [];
    }
  }

  public async getWorkOrderByMoIdForWeb(request: any): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('work_order_list', request)
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response.data.items;
    } catch (err) {
      return [];
    }
  }

  public async getWorkOrderByKw(keyword: string): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('work_order_list', {
          filter: [
            {
              column: WorkOrderFilterColumn.PRODUCING_STEP_NAME,
              text: keyword,
            },
          ],
          isGetAll: '1',
        })
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response.data.items;
    } catch (err) {
      return [];
    }
  }

  public async getWorkOrderList(request: GetWoListRequestDto): Promise<any> {
    try {
      const { filter } = request;
      // only get WO with status In progress and confirm
      const woStatusFilter = [
        {
          column: 'status',
          text: CAN_PRINT_WORK_ORDER_QR_CODE.toString(),
        },
      ];
      request.filter = filter ? filter.concat(woStatusFilter) : woStatusFilter;
      const response = await this.produceServiceClient
        .send('work_order_list', request)
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response;
    } catch (err) {
      return [];
    }
  }

  async updateMaterialQuantityToRepairError(param: any): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('update_material_quantity_to_repair_error', param)
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response;
    } catch (err) {
      return [];
    }
  }

  // Lấy dữ liệu xưởng từ PLAN
  async qualityPlanGetListWorkCenterSchedule(id: number): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('get_plan_work_center_schedule_list', { id: id })
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response;
    } catch (err) {
      return [];
    }
  }

  async qualityPlanGetWorkCenterScheduleDetail(payload: any): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('daily_schedule_list', payload)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response;
    } catch (err) {
      return [];
    }
  }

  async workOrderDetail(id: number): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('work_order_detail', { id: id })
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response;
    } catch (err) {
      return [];
    }
  }

  async workCenterDetail(id: number): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('work_center_detail', { id: id })
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response;
    } catch (err) {
      return [];
    }
  }

  async updateWoMaterialQcQuantity(
    request: UpdateWoMaterialInputQcQuantityRequestDto,
  ): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('qc_material_input_create', request)
        .toPromise();
      return response;
    } catch (err) {
      console.log(err);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(err?.message || err)
        .build();
    }
  }

  async updateWoPreviousBomQcQuantity(
    request: UpdateWoPreviousBomInputQcQuantityRequestDto,
  ): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('qc_previous_bom_input_create', request)
        .toPromise();
      return response;
    } catch (err) {
      console.log(err);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(err?.message || err)
        .build();
    }
  }

  async getInProgressMoList(): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('mo_in_progress_list', {})
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response.data;
    } catch (err) {
      return [];
    }
  }

  async getItemsByMo(id: number): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('get_mo_all_item', { id: id })
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response.data;
    } catch (err) {
      return [];
    }
  }

  async getProduceStepsByMoAndItem(
    request: GetProduceStepsByMoAndItemRequestDto,
  ): Promise<any> {
    try {
      const { moId, itemId } = request;
      const response = await this.produceServiceClient
        .send('get_bom_item_mo_routing', { id: moId, itemId: itemId })
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response.data?.producingSteps;
    } catch (err) {
      return [];
    }
  }

  public async getMoByConditions(
    request: any
  ): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('get_mo_list', request)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }

      return response?.data?.items;
    } catch (err) {
      return [];
    }
  }

  public async getWoByConditions(
    request: any
  ): Promise<any> {
    try {
      const response = await this.produceServiceClient
        .send('work_order_list', request)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) return [];

      return response?.data?.items;
    } catch (err) {
      return [];
    }
  }

  public async updateAlertForMes(
    type: number,
    message: string,
    manufacturingOrderId: number,
  ): Promise<any> {
    const request = {
      type: type,
      message: message,
      manufacturingOrderId: manufacturingOrderId,
    }
    console.log(request)
    return await this.produceServiceClient
      .send('qc_create', request)
      .toPromise();
  }
}
