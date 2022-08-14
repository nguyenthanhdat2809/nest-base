import { Body, Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ResponsePayload } from '@utils/response-payload';
import { isEmpty } from 'lodash';
import { SuccessResponse } from '@utils/success.response.dto';
import { AlertServiceInterface } from '@components/alert/interface/alert.service.interface';
import { AlertRequestDto } from '@components/alert/dto/request/alert.request.dto';
import { AlertResponseDto } from '@components/alert/dto/response/alert.response.dto';
import { CreateAlertRequestDto } from '@components/alert/dto/request/create-alert.request.dto';
import { UpdateAlertRequestDto } from '@components/alert/dto/request/update-alert.request.dto';
import { GetListAlertRequestDto } from '@components/alert/dto/request/get-list-alert.request.dto';
import { GetListAlertResponseDto } from '@components/alert/dto/response/get-list-alert.response.dto';
import { UpdateAlertStatusRequestDto } from '@components/alert/dto/request/update-alert-status.request.dto';
import { PermissionCode } from "@core/decorator/get-code.decorator";
import {
  CONFIRM_ALERT_PERMISSION,
  CREATE_ALERT_PERMISSION,
  DELETE_ALERT_PERMISSION,
  UPDATE_ALERT_PERMISSION,
  VIEW_ALERT_PERMISSION
} from "@utils/permissions/web/alert";
import { DeleteAlertRequestDto } from "@components/alert/dto/request/delete-alert.request.dto";

@Controller('alerts')
export class AlertController {
  constructor(
    @Inject('AlertServiceInterface')
    private readonly alertService: AlertServiceInterface,
  ) {}

  @PermissionCode(VIEW_ALERT_PERMISSION.code)
  @MessagePattern('alert_list')
  public async getList(
    @Body() payload: GetListAlertRequestDto,
  ): Promise<ResponsePayload<GetListAlertResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.alertService.getList(request);
  }

  @PermissionCode(VIEW_ALERT_PERMISSION.code)
  @MessagePattern('alert_detail')
  public async detail(
    request: any,
  ): Promise<ResponsePayload<AlertRequestDto | any>> {
    return await this.alertService.getDetail(request);
  }

  @PermissionCode(CREATE_ALERT_PERMISSION.code)
  @MessagePattern('alert_create')
  public async create(
    @Body() payload: CreateAlertRequestDto
  ): Promise<ResponsePayload<AlertResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.alertService.create(request);
  }

  @PermissionCode(UPDATE_ALERT_PERMISSION.code)
  @MessagePattern('alert_update')
  public async update(
    @Body() payload: UpdateAlertRequestDto,
  ): Promise<ResponsePayload<AlertResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.alertService.update(request);
  }

  @PermissionCode(DELETE_ALERT_PERMISSION.code)
  @MessagePattern('alert_delete')
  public async delete(
    @Body() payload: DeleteAlertRequestDto,
  ): Promise<ResponsePayload<SuccessResponse | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.alertService.remove(request);
  }

  @PermissionCode(CONFIRM_ALERT_PERMISSION.code)
  @MessagePattern('alert_confirm')
  public async confirm(
    @Body() payload: UpdateAlertStatusRequestDto
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.alertService.confirm(request);
  }

  /*
    Lấy dữ liệu trả về màn alert các select box
   */

  // 1. Danh sách MO(Lệnh sản xuất)
  @MessagePattern('alert_env_list_manufacturing_order')
  public async getAlertListManufacturingOrder(): Promise<any> {
    return await this.alertService.getAlertListManufacturingOrder();
  }

  // 2. Danh sách sản phẩm theo id mo
  @MessagePattern('alert_env_list_item_by_manufacturing_order_id')
  public async envAlertListItemByManufacturingOrderId(
    id: number,
  ): Promise<any> {
    return await this.alertService.envAlertListItemByManufacturingOrderId(id);
  }

  // 3. Danh sách quy trình theo id sản phẩm
  @MessagePattern('alert_env_list_routing_by_item_id')
  public async envAlertListRoutingByItemId(
    id: number,
  ): Promise<any> {
    return await this.alertService.envAlertListRoutingByItemId(id);
  }

  //4. Danh sách công đoạn theo id quy trình
  @MessagePattern('alert_env_get_producing_step_by_routing_id')
  public async envAlertGetProducingStepByRoutingId(
    id: number,
  ): Promise<any> {
    return await this.alertService.envAlertGetProducingStepByRoutingId(id);
  }
  /* End */

  // purchased order
  @MessagePattern('alert_env_purchased_order')
  public async getAlertPurchasedOrder(): Promise<any> {
    return await this.alertService.getAlertPurchasedOrder();
  }

  @MessagePattern('alert_env_item_by_purchased_order')
  public async getAlertItemByPurchasedOrder(
    id: number,
  ): Promise<any> {
    return await this.alertService.getAlertItemByPurchasedOrder(id);
  }

  @MessagePattern('alert_env_qc_checked_item_by_purchased_order')
  public async getAlertQcCheckedItemByPurchasedOrder(
    id: number,
  ): Promise<any> {
    return await this.alertService.getAlertQcCheckItemByPurchasedOrder(id);
  }

  @MessagePattern('alert_env_warehouse_by_purchased_order_and_item')
  public async getAlertWarehouseByPurchasedOrderAndItem(
    params: any
  ): Promise<any> {
    return await this.alertService.getAlertWarehouseByPurchasedOrderAndItem(
      params.purchasedOrderId,
      params.itemId
    );
  }

  // sale order export
  @MessagePattern('alert_env_sale_order_export')
  public async getAlertSaleOrderExport(): Promise<any> {
    return await this.alertService.getAlertSaleOrderExport();
  }

  @MessagePattern('alert_env_item_by_sale_order_export')
  public async getAlertItemBySaleOrderExport(
    id: number,
  ): Promise<any> {
    return await this.alertService.getAlertItemBySaleOrderExport(id);
  }

  @MessagePattern('alert_env_qc_check_item_by_sale_order_export')
  public async getAlertQcCheckItemBySaleOrderExport(
    id: number,
  ): Promise<any> {
    return await this.alertService.getAlertQcCheckItemBySaleOrderExport(id);
  }

  @MessagePattern('alert_env_warehouse_by_sale_order_export_and_item')
  public async getAlertWarehouseBySaleOrderExportAndItem(
    params: any
  ): Promise<any> {
    return await this.alertService.getAlertWarehouseBySaleOrderExportAndItem(
      params.saleOrderId,
      params.itemId
    );
  }

  // production order
  @MessagePattern('alert_env_production_order')
  public async getAlertProductionOrder(
    type: number,
  ): Promise<any> {
    return await this.alertService.getAlertProductionOrder(type);
  }

  @MessagePattern('alert_env_item_by_production_order')
  public async getAlertItemByProductionOrder(
    id: number,
  ): Promise<any> {
    return await this.alertService.getAlertItemByProductionOrder(id);
  }

  @MessagePattern('alert_env_qc_check_item_by_production_order')
  public async getAlertQcCheckItemByProductionOrder(
    id: number,
  ): Promise<any> {
    return await this.alertService.getAlertQcCheckItemByProductionOrder(id);
  }

  @MessagePattern('alert_env_warehouse_by_production_order_and_item')
  public async getAlertWarehouseByProductionOrderAndItem(
    params: any
  ): Promise<any> {
    return await this.alertService.getAlertWarehouseByProductionOrderAndItem(
      params.productionOrderId,
      params.itemId
    );
  }
}
