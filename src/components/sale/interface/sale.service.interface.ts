import { ErrorReportIoqcDetail } from '@entities/error-report/error-report-ioqc-detail.entity';
import { GetListIoqcOrderRequestDto } from '@components/item/dto/request/get-list-ioqc-order.request.dto';
import { GetListIoqcOrderResponseDto } from '@components/item/dto/response/get-list-ioqc-order.response.dto';
import { GetListIoqcWarehouseByOrderRequestDto } from '@components/item/dto/request/get-list-ioqc-warehouse-by-order.request.dto';
import { GetListIoqcWarehouseByOrderResponseDto } from '@components/item/dto/response/get-list-ioqc-warehouse-by-order.response.dto';
import { GetListIoqcItemByWarehouseAndOrderRequestDto } from '@components/item/dto/request/get-list-ioqc-item-by-warehouse-and-order.request.dto';
import { GetListIoqcItemByWarehouseAndOrderResponseDto } from '@components/item/dto/response/get-list-ioqc-item-by-warehouse-and-order.response.dto';
import { ResponsePayload } from '../../../utils/response-payload';
import { UpdateIOQcQuantityRequestDto } from '@components/sale/dto/request/update-io-qc-quantity.request.dto';

export interface SaleServiceInterface {
  getSaleErrorReportIoqcDetail(
    errorReportIoqcDetail: ErrorReportIoqcDetail,
    qcStageId: number,
  ): Promise<any>;
  getListIoqcOrder(
    request: GetListIoqcOrderRequestDto,
  ): Promise<GetListIoqcOrderResponseDto | any>;
  getListIoqcWarehouseByOrder(
    request: GetListIoqcWarehouseByOrderRequestDto,
  ): Promise<GetListIoqcWarehouseByOrderResponseDto | any>;
  getListIoqcItemByWarehouseAndOrder(
    request: GetListIoqcItemByWarehouseAndOrderRequestDto,
  ): Promise<GetListIoqcItemByWarehouseAndOrderResponseDto | any>;
  getPurchasedOrderById(id: number): Promise<any>;
  getAlertEnvListPurchasedOrder(): Promise<any>;
  getItemByPurchasedOrder(id: number, qcCheck?: boolean): Promise<any>;
  getWarehouseByPurchasedOrderAndItem(
    purchasedOrderId: number,
    itemId: number,
  ): Promise<any>;
  getItemBySaleOrderExport(id: number, qcCheck?: boolean): Promise<any>;
  getWarehouseBySaleOrderExportAndItem(
    saleOrderId: number,
    itemId: number,
  ): Promise<any>;
  getProductionOrderById(id: number): Promise<any>;
  getListProductionOrder(type: number): Promise<any>;
  getItemByProductionOrder(id: number, qcCheck?: boolean): Promise<any>;
  getWarehouseByProductionOrderAndItem(
    productionOrderId: number,
    itemId: number,
  ): Promise<any>;
  getSaleOrderExportById(id: number): Promise<any>;
  getListTransactionHistoryPOs(limit?: number): Promise<any>;
  getPurchasedOrderByIds(ids: number[]): Promise<any>
  getProductionOrderByIds(ids: number[]): Promise<any>
  getSaleOrderExportByIds(ids: number[]): Promise<any>
  getListSaleOrderExport(): Promise<any>
  updateIOQcQuantity(
    request: UpdateIOQcQuantityRequestDto,
    type: number
  ): Promise<any>;
  getPurchasedOrderByConditions(
    params: any
  ): Promise<any>;
  getProductionOrderByConditions(
    params: any
  ): Promise<any>;
  getSaleOrderExportByConditions(
    params: any
  ): Promise<any>;
  getListOrderByQualityPlanIOqc(
    request: any,
  ): Promise<any>;
}
