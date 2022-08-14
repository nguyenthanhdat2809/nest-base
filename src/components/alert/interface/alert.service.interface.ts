import { ResponsePayload } from '@utils/response-payload';
import { SuccessResponse } from '@utils/success.response.dto';
import { AlertRequestDto } from '@components/alert/dto/request/alert.request.dto';
import { AlertResponseDto } from '@components/alert/dto/response/alert.response.dto';
import { UpdateAlertRequestDto } from '@components/alert/dto/request/update-alert.request.dto';
import { GetListAlertRequestDto } from '@components/alert/dto/request/get-list-alert.request.dto';
import { GetListAlertResponseDto } from '@components/alert/dto/response/get-list-alert.response.dto';
import { UpdateAlertStatusRequestDto } from '@components/alert/dto/request/update-alert-status.request.dto';
import {
  AlertEnvItemByBoqResponseDto,
} from '@components/alert/dto/request/alert-env.request.dto';
import { DeleteCheckListRequestDto } from "@components/check-list/dto/request/delete-check-list.request.dto";
import { DeleteAlertRequestDto } from "@components/alert/dto/request/delete-alert.request.dto";

export interface AlertServiceInterface {
  confirm(
    request: UpdateAlertStatusRequestDto
  ): Promise<any>;
  getList(
    request: GetListAlertRequestDto,
  ): Promise<ResponsePayload<GetListAlertResponseDto | any>>;
  getDetail(
    request: any,
  ): Promise<ResponsePayload<AlertRequestDto | any>>;
  create(
    actionCategoryRequestDto: AlertRequestDto,
  ): Promise<ResponsePayload<AlertResponseDto | any>>;
  update(
    alertDto: UpdateAlertRequestDto,
  ): Promise<ResponsePayload<AlertResponseDto | any>>;
  remove(
    request: DeleteAlertRequestDto,
  ): Promise<ResponsePayload<SuccessResponse | any>>;
  getAlertListManufacturingOrder(): Promise<any>;
  envAlertListItemByManufacturingOrderId(
    id: number
  ): Promise<any>;
  envAlertListRoutingByItemId(
    id: number
  ): Promise<any>;
  envAlertGetProducingStepByRoutingId(
    id: number
  ): Promise<any>;
  getAlertPurchasedOrder(): Promise<any>
  getAlertItemByPurchasedOrder(
    id: number,
  ): Promise<any>
  getAlertWarehouseByPurchasedOrderAndItem(
    purchasedOrderId: number,
    itemId: number,
  ): Promise<any>
  getAlertSaleOrderExport(): Promise<any>
  getAlertItemBySaleOrderExport(
    id: number,
  ): Promise<any>
  getAlertWarehouseBySaleOrderExportAndItem(
    purchasedOrderId: number,
    itemId: number,
  ): Promise<any>
  getAlertProductionOrder(
    type: number,
  ): Promise<any>
  getAlertItemByProductionOrder(
    id: number,
  ): Promise<any>
  getAlertWarehouseByProductionOrderAndItem(
    productionOrderId: number,
    itemId: number,
  ): Promise<any>;
  getAlertQcCheckItemByPurchasedOrder(id: number): Promise<any>;
  getAlertQcCheckItemBySaleOrderExport(id: number): Promise<any>;
  getAlertQcCheckItemByProductionOrder(id: number): Promise<any>;
}
