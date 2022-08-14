import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { isEmpty } from 'lodash';
import { SaleServiceInterface } from './interface/sale.service.interface';
import { plainToClass } from 'class-transformer';
import { ErrorReportIoqcDetail } from '@entities/error-report/error-report-ioqc-detail.entity';
import { STAGES_OPTION } from '@constant/qc-stage.constant';
import { ItemService } from '@components/item/item.service';
import {
  AlertEnvCodeAndVendorResponseDto,
  AlertEnvCodeResponseDto,
  AlertEnvResponseDto,
} from '@components/alert/dto/response/alert-env.response.dto';
import { GetListIoqcOrderRequestDto } from '@components/item/dto/request/get-list-ioqc-order.request.dto';
import { GetListIoqcOrderResponseDto } from '@components/item/dto/response/get-list-ioqc-order.response.dto';
import {
  OrderStatusEnum,
  OrderTypeProductionOrderEnum,
  OrderQCCheckedEnum,
} from '@components/sale/sale.constant';
import { GetListIoqcWarehouseByOrderRequestDto } from '@components/item/dto/request/get-list-ioqc-warehouse-by-order.request.dto';
import { GetListIoqcWarehouseByOrderResponseDto } from '@components/item/dto/response/get-list-ioqc-warehouse-by-order.response.dto';
import { GetListIoqcItemByWarehouseAndOrderRequestDto } from '@components/item/dto/request/get-list-ioqc-item-by-warehouse-and-order.request.dto';
import { GetListIoqcItemByWarehouseAndOrderResponseDto } from '@components/item/dto/response/get-list-ioqc-item-by-warehouse-and-order.response.dto';
import { UpdateIOQcQuantityRequestDto } from '@components/sale/dto/request/update-io-qc-quantity.request.dto';
import { TypeDetailOrder } from '@components/quality-plan/quality-plan.constant';
import { GetListOrderByQualityPlanIOqcRequestDto } from '@components/quality-plan/dto/request/get-list-order-by-quality-plan-ioqc.request.dto';
import { isNotEmpty } from "class-validator";

@Injectable()
export class SaleService implements SaleServiceInterface {
  constructor(
    @Inject('SALE_SERVICE_CLIENT')
    private readonly saleServiceClient: ClientProxy,

    @Inject('ItemServiceInterface')
    private readonly itemService: ItemService,
  ) {}

  // PO
  async getPurchasedOrderByIds(ids: number[]): Promise<any> {
    try {
      const response = await this.saleServiceClient
        .send('get_purchased_order_import_by_ids', { ids: ids })
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return;
      }

      return response.data;
    } catch (err) {
      return;
    }
  }

  async getPurchasedOrderById(id: number): Promise<any> {
    try {
      const response = await this.saleServiceClient
        .send('get_purchased_order_import_detail', { id: id })
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return '';
      }

      return response.data;
    } catch (err) {
      return '';
    }
  }

  /**
   * Get list PO for transaction history
   */
  public async getListTransactionHistoryPOs(user: any, limit?: number) {
    const status = '1,2,4';

    return await this.getListPurchasedOrders(status, user, false, limit);
  }

  /**
   * Get list PO filtering by status
   * @param isGetAll
   * @param status Status
   * @param limit Page size limit
   * @param user
   */
  public async getListPurchasedOrders(
    status: string,
    user?: any,
    isGetAll?: boolean,
    limit?: number,
  ) {
    const pattern = isGetAll
      ? 'get_purchased_order_imports'
      : 'get_purchased_order_import_list';
    const responsePurchasedOrder = await this.saleServiceClient
      .send(pattern, { user: user, limit: limit, status: status })
      .toPromise();

    if (responsePurchasedOrder.statusCode !== ResponseCodeEnum.SUCCESS) {
      return [];
    }

    return responsePurchasedOrder.data;
  }

  async getAlertEnvListPurchasedOrder(): Promise<any> {
    const status = '1,2';

    try {
      const dataResponse = await this.getListPurchasedOrders(status, true, true);
      const responseRef = dataResponse.reduce((x, y) => {
        if (!isEmpty(y.vendor)) {
          x.push({
            id: y.id,
            code: y.code,
            vendor: y.vendor.name,
          });
        }
        return x;
      }, []);

      const response = plainToClass(
        AlertEnvCodeAndVendorResponseDto,
        responseRef,
        {
          excludeExtraneousValues: true,
        },
      );

      return response;
    } catch (err) {
      return [];
    }
  }

  async getItemByPurchasedOrder(id: number, qcCheck?: boolean): Promise<any> {
    try {
      const responsePurchasedOrderDetails = await this.saleServiceClient
        .send('get_purchased_order_import_detail', { id: id })
        .toPromise();

      if (
        responsePurchasedOrderDetails.statusCode !== ResponseCodeEnum.SUCCESS
      ) {
        return [];
      }

      let resultRef =
        responsePurchasedOrderDetails.data.purchasedOrderWarehouseDetails;


      // local filter if qcCheck = 1
      if (qcCheck && !isEmpty(resultRef)) {
        resultRef = resultRef.filter((item) => item.qcCheck == 1);
      }

      const itemIds = resultRef.reduce((x, y) => {
        const id = y.itemId;
        if (!x.includes(id)) {
          x.push(id);
        }
        return x;
      }, []);

      const itemResponse = await this.itemService.getListByIDs(itemIds);

      const response = plainToClass(AlertEnvCodeResponseDto, itemResponse, {
        excludeExtraneousValues: true,
      });

      return response;
    } catch (err) {
      return [];
    }
  }

  async getWarehouseByPurchasedOrderAndItem(
    purchasedOrderId: number,
    itemId: number,
  ): Promise<any> {
    try {
      const responsePurchasedOrderDetails = await this.saleServiceClient
        .send('get_purchased_order_import_detail', { id: purchasedOrderId })
        .toPromise();

      if (
        responsePurchasedOrderDetails.statusCode !== ResponseCodeEnum.SUCCESS
      ) {
        return [];
      }

      const resultRef =
        responsePurchasedOrderDetails.data.purchasedOrderWarehouseDetails;

      const warehouses = resultRef.reduce((x, y) => {
        if (y.itemId === itemId) {
          x.push(y.warehouse);
        }
        return x;
      }, []);

      const response = plainToClass(AlertEnvResponseDto, warehouses, {
        excludeExtraneousValues: true,
      });

      return response;
    } catch (err) {
      return [];
    }
  }

  // SO
  async getSaleOrderExportByIds(ids: number[]): Promise<any> {
    try {
      const response = await this.saleServiceClient
        .send('get_sale_order_export_by_ids', { ids: ids })
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return;
      }

      return response.data;
    } catch (err) {
      return;
    }
  }

  async getListSaleOrderExport(): Promise<any> {
    try {
      const responseSaleOrderExport = await this.saleServiceClient
        .send('get_sale_order_exports', { status: '1,2' }) // get_sale_order_export_list
        .toPromise();

      if (responseSaleOrderExport.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }

      const dataResponse = responseSaleOrderExport.data;

      const response = plainToClass(AlertEnvCodeResponseDto, dataResponse, {
        excludeExtraneousValues: true,
      });

      return response;
    } catch (err) {
      return [];
    }
  }

  async getItemBySaleOrderExport(id: number, qcCheck?: boolean): Promise<any> {
    try {
      const responseSaleOrderDetails = await this.saleServiceClient
        .send('get_sale_order_export_detail', { id: id })
        .toPromise();

      if (responseSaleOrderDetails.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      let resultRef = responseSaleOrderDetails.data.saleOrderExportWarehouseDetails;
      if (qcCheck && !isEmpty(resultRef)) {
        resultRef = resultRef.filter((item) => item.qcCheck == 1);
      }
      const itemIds = resultRef.reduce((x, y) => {
        const id = y.itemId;
        if (!x.includes(id)) {
          x.push(id);
        }
        return x;
      }, []);

      const itemResponse = await this.itemService.getListByIDs(itemIds);

      const response = plainToClass(AlertEnvCodeResponseDto, itemResponse, {
        excludeExtraneousValues: true,
      });

      return response;
    } catch (err) {
      return [];
    }
  }

  async getWarehouseBySaleOrderExportAndItem(
    saleOrderId: number,
    itemId: number,
  ): Promise<any> {
    try {
      const responseSaleOrderDetails = await this.saleServiceClient
        .send('get_sale_order_export_detail', { id: saleOrderId })
        .toPromise();

      if (responseSaleOrderDetails.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }

      const resultRef = responseSaleOrderDetails?.data?.saleOrderExportWarehouseDetails;
      const warehouses = resultRef.reduce((x, y) => {
        if (y.itemId === itemId) {
          x.push(y.warehouse);
        }
        return x;
      }, []);

      const response = plainToClass(AlertEnvResponseDto, warehouses, {
        excludeExtraneousValues: true,
      });

      return response;
    } catch (err) {
      return [];
    }
  }

  // PrO
  async getProductionOrderByIds(ids: number[]): Promise<any> {
    try {
      const response = await this.saleServiceClient
        .send('get_production_order_by_ids', { ids: ids })
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return;
      }

      return response.data;
    } catch (err) {
      return;
    }
  }

  async getProductionOrderById(id: number): Promise<any> {
    try {
      const response = await this.saleServiceClient
        .send('get_production_order_detail', { id: id })
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return '';
      }

      return response.data;
    } catch (err) {
      return '';
    }
  }

  async getListProductionOrder(type: number): Promise<any> {
    try {
      const responseProductionOrder = await this.saleServiceClient
        .send('get_production_orders', { status: '1,2' })
        .toPromise();
      if (responseProductionOrder.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }

      const dataResponse = responseProductionOrder.data.reduce((x, y) => {
        if (y.type === type) {
          x.push(y);
        }
        return x;
      }, []);

      const response = plainToClass(AlertEnvCodeResponseDto, dataResponse, {
        excludeExtraneousValues: true,
      });

      return response;
    } catch (err) {
      return [];
    }
  }

  async getItemByProductionOrder(id: number, qcCheck?: boolean): Promise<any> {
    try {
      const responseProductionOrderDetails = await this.saleServiceClient
        .send('get_production_order_detail', { id: id })
        .toPromise();

      if (
        responseProductionOrderDetails.statusCode !== ResponseCodeEnum.SUCCESS
      ) {
        return [];
      }
      let resultRef =
        responseProductionOrderDetails.data.productionOrderWarehouseDetails;

      if (qcCheck && !isEmpty(resultRef)) {
        resultRef = resultRef.filter((item) => item.qcCheck == 1);
      }

      const itemIds = resultRef.reduce((x, y) => {
        const id = y.itemId;
        if (!x.includes(id)) {
          x.push(id);
        }
        return x;
      }, []);

      const itemResponse = await this.itemService.getListByIDs(itemIds);

      const response = plainToClass(AlertEnvCodeResponseDto, itemResponse, {
        excludeExtraneousValues: true,
      });

      return response;
    } catch (err) {
      return [];
    }
  }

  async getWarehouseByProductionOrderAndItem(
    productionOrderId: number,
    itemId: number,
  ): Promise<any> {
    try {
      const responseProductionOrderDetails = await this.saleServiceClient
        .send('get_production_order_detail', { id: productionOrderId })
        .toPromise();

      if (
        responseProductionOrderDetails.statusCode !== ResponseCodeEnum.SUCCESS
      ) {
        return [];
      }

      const resultRef =
        responseProductionOrderDetails.data.productionOrderWarehouseDetails;

      const warehouses = resultRef.reduce((x, y) => {
        if (y.itemId === itemId) {
          x.push(y.warehouse);
        }
        return x;
      }, []);

      const response = plainToClass(AlertEnvResponseDto, warehouses, {
        excludeExtraneousValues: true,
      });

      return response;
    } catch (err) {
      return [];
    }
  }

  public async getSaleErrorReportIoqcDetail(
    errorReportIoqcDetail: ErrorReportIoqcDetail,
    qcStageId: number,
  ): Promise<any> {
    let itemName: string;
    let itemCode: string;
    let customerName: string;
    let orderCode: string;
    let orderName: string;
    let warehouseName: string;
    let deliveredAt: string;

    switch (qcStageId) {
      case STAGES_OPTION.PO_IMPORT:
        const purchasedOrder = (
          await this.saleServiceClient
            .send('get_purchased_order_import_detail', {
              id: errorReportIoqcDetail.orderId,
            })
            .toPromise()
        ).data;

        orderCode = purchasedOrder?.code;
        orderName = purchasedOrder?.name;
        customerName = purchasedOrder?.vendor?.name;
        warehouseName = purchasedOrder?.purchasedOrderWarehouseDetails
          .filter((p) => p.itemId == errorReportIoqcDetail.itemId && p.warehouseId == errorReportIoqcDetail.warehouseId)
          .map((p) => p.warehouse.name)[0];
        itemName = purchasedOrder?.purchasedOrderWarehouseDetails
          .filter((p) => p.itemId == errorReportIoqcDetail.itemId && p.warehouseId == errorReportIoqcDetail.warehouseId)
          .map((p) => p.item?.name)[0];
        itemCode = purchasedOrder?.purchasedOrderWarehouseDetails
          .filter((p) => p.itemId == errorReportIoqcDetail.itemId && p.warehouseId == errorReportIoqcDetail.warehouseId)
          .map((p) => p.item?.code)[0];
        deliveredAt = purchasedOrder.deadline;

        break;
      case STAGES_OPTION.SO_EXPORT:
        const saleOrderExportDetail = (
          await this.saleServiceClient
            .send('get_sale_order_export_detail', { id: errorReportIoqcDetail.orderId })
            .toPromise()
        ).data;

        orderCode = saleOrderExportDetail?.code;
        orderName = saleOrderExportDetail?.name;
        customerName = saleOrderExportDetail?.customer?.name;
        warehouseName = saleOrderExportDetail?.saleOrderExportWarehouseDetails
          .filter((p) => p.itemId == errorReportIoqcDetail.itemId && p.warehouseId == errorReportIoqcDetail.warehouseId)
          .map((p) => p.warehouse.name)[0];
        itemName = saleOrderExportDetail?.saleOrderExportWarehouseDetails
          .filter((p) => p.itemId == errorReportIoqcDetail.itemId && p.warehouseId == errorReportIoqcDetail.warehouseId)
          .map((p) => p.item?.name)[0];
        itemCode = saleOrderExportDetail?.saleOrderExportWarehouseDetails
          .filter((p) => p.itemId == errorReportIoqcDetail.itemId && p.warehouseId == errorReportIoqcDetail.warehouseId)
          .map((p) => p.item?.code)[0];
        deliveredAt = saleOrderExportDetail?.deadline;

        break;
      case STAGES_OPTION.PRO_EXPORT:
        const productionOrderExportDetail = (
          await this.saleServiceClient
            .send('get_production_order_detail', { id: errorReportIoqcDetail.orderId })
            .toPromise()
        ).data;

        orderCode = productionOrderExportDetail?.code;
        orderName = productionOrderExportDetail?.name;
        warehouseName = productionOrderExportDetail?.productionOrderWarehouseDetails
          .filter((p) => p.itemId == errorReportIoqcDetail.itemId && p.warehouseId == errorReportIoqcDetail.warehouseId)
          .map((p) => p.warehouse.name)[0];
        itemName = productionOrderExportDetail?.productionOrderWarehouseDetails
          .filter((p) => p.itemId == errorReportIoqcDetail.itemId && p.warehouseId == errorReportIoqcDetail.warehouseId)
          .map((p) => p.item.name)[0];
        itemCode = productionOrderExportDetail?.productionOrderWarehouseDetails
          .filter((p) => p.itemId == errorReportIoqcDetail.itemId && p.warehouseId == errorReportIoqcDetail.warehouseId)
          .map((p) => p.item.code)[0];
        deliveredAt = productionOrderExportDetail?.deadline;

        break;
      case STAGES_OPTION.PRO_IMPORT:
        const productionOrderImportDetail = (
          await this.saleServiceClient
            .send('get_production_order_detail', { id: errorReportIoqcDetail.orderId })
            .toPromise()
        ).data;

        orderCode = productionOrderImportDetail?.code;
        orderName = productionOrderImportDetail?.name;
        warehouseName = productionOrderImportDetail?.productionOrderWarehouseDetails
          .filter((p) => p.itemId == errorReportIoqcDetail.itemId && p.warehouseId == errorReportIoqcDetail.warehouseId)
          .map((p) => p.warehouse.name)[0];
        itemName = productionOrderImportDetail?.productionOrderWarehouseDetails
          .filter((p) => p.itemId == errorReportIoqcDetail.itemId && p.warehouseId == errorReportIoqcDetail.warehouseId)
          .map((p) => p.item.name)[0];
        itemCode = productionOrderImportDetail?.productionOrderWarehouseDetails
          .filter((p) => p.itemId == errorReportIoqcDetail.itemId && p.warehouseId == errorReportIoqcDetail.warehouseId)
          .map((p) => p.item.code)[0];
        deliveredAt = productionOrderImportDetail?.deadline;

        break;
      default:
        break;
    }

    return [itemName, customerName, orderCode, warehouseName, deliveredAt, itemCode, orderName];
  }

  // app
  // Lấy dữ liệu mã lệnh SO PO PRO hiển thị màn list app
  async getListIoqcOrder(
    request: GetListIoqcOrderRequestDto,
  ): Promise<GetListIoqcOrderResponseDto | any> {
    const { type, filterOrderIds } = request;
    
    let responseData;
    let typePro;
    let filterOrder;
    
    if (!isEmpty(filterOrderIds)) {
      filterOrder = filterOrderIds.toString();
    }

    if (type === STAGES_OPTION.PRO_IMPORT) {
      typePro = OrderTypeProductionOrderEnum.Input;
    } else if (type === STAGES_OPTION.PRO_EXPORT) {
      typePro = OrderTypeProductionOrderEnum.Output;
    }

    const typeProFilter = [
      {
        column: 'type',
        text: `${typePro}`,
      },
    ];
    const orderConfirmedAndInProgress = [
      {
        column: 'status',
        text: `${OrderStatusEnum.Confirmed},${OrderStatusEnum.InProgress}`,
      },
    ];
    const orderQCChecked = [
      {
        column: 'qcCheck',
        text: `${OrderQCCheckedEnum.Checked}`,
      },
    ];
    const orderIdsFilter = [
      {
        column: 'ids',
        text: filterOrder,
      },
    ];

    delete request['type'];
    delete request['createdByUserId'];
    delete request['userId'];

    try {
      if (
        type === STAGES_OPTION.PRO_IMPORT ||
        type === STAGES_OPTION.PRO_EXPORT
      ) {
        request.filter = request.filter
          ? [
              ...request.filter,
              ...typeProFilter,
              ...orderConfirmedAndInProgress,
              ...orderQCChecked,
            ]
          : [
              ...typeProFilter,
              ...orderConfirmedAndInProgress,
              ...orderQCChecked,
            ];
        // Add filter by Order id
        if (filterOrder) {
          request.filter = [...request.filter, ...orderIdsFilter];
        }

        responseData = await this.saleServiceClient
          .send('get_production_order_list', request)
          .toPromise();
      } else if (
        type === STAGES_OPTION.PO_IMPORT ||
        type === STAGES_OPTION.SO_EXPORT
      ) {
        request.filter = request.filter
          ? [
              ...request.filter,
              ...orderConfirmedAndInProgress,
              ...orderQCChecked,
            ]
          : [
              ...orderConfirmedAndInProgress,
              ...orderQCChecked,
            ];

        // Add filter by Order id
        if (filterOrder) {
          request.filter = [...request.filter, ...orderIdsFilter];
        }

        if (type === STAGES_OPTION.PO_IMPORT) {
          responseData = await this.saleServiceClient
            .send('get_purchased_order_import_list', request)
            .toPromise();
        } else {
          responseData = await this.saleServiceClient
            .send('get_sale_order_export_list', request)
            .toPromise();
        }
      }

      if (responseData.statusCode !== ResponseCodeEnum.SUCCESS) return;
      return plainToClass(GetListIoqcOrderResponseDto, responseData, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      return;
    }
  }

  // Lấy dữ liệu Warehouse theo ID của Order
  async getListIoqcWarehouseByOrder(
    request: GetListIoqcWarehouseByOrderRequestDto,
  ): Promise<GetListIoqcWarehouseByOrderResponseDto | any> {
    let responseWarehouse;
    let responseOrderDetail;
    const { type } = request;
    try {
      if (
        type === STAGES_OPTION.PRO_IMPORT ||
        type === STAGES_OPTION.PRO_EXPORT
      ) {
        delete request['type'];
        responseWarehouse = await this.saleServiceClient
          .send('get_production_order_warehouses', request)
          .toPromise();
        if (responseWarehouse.statusCode !== ResponseCodeEnum.SUCCESS) return;

        responseOrderDetail = await this.saleServiceClient
          .send('get_production_order_detail', { id: request.id })
          .toPromise();
        if (responseOrderDetail.statusCode !== ResponseCodeEnum.SUCCESS) return;
      } else if (
        type === STAGES_OPTION.PO_IMPORT ||
        type === STAGES_OPTION.SO_EXPORT
      ) {
        delete request['type'];
        if (type === STAGES_OPTION.PO_IMPORT) {
          responseWarehouse = await this.saleServiceClient
            .send('get_purchased_order_import_warehouses', request)
            .toPromise();
          if (responseWarehouse.statusCode !== ResponseCodeEnum.SUCCESS) return;

          responseOrderDetail = await this.saleServiceClient
            .send('get_purchased_order_import_detail', { id: request.id })
            .toPromise();
          if (responseOrderDetail.statusCode !== ResponseCodeEnum.SUCCESS) return;
        } else {
          responseWarehouse = await this.saleServiceClient
            .send('get_sale_order_export_warehouses', request)
            .toPromise();
          if (responseWarehouse.statusCode !== ResponseCodeEnum.SUCCESS) return;

          responseOrderDetail = await this.saleServiceClient
            .send('get_sale_order_export_detail', { id: request.id })
            .toPromise();
          if (responseOrderDetail.statusCode !== ResponseCodeEnum.SUCCESS) return;
        }
      }

      const responseOrderDetailData = responseOrderDetail.data;
      const responseWarehouseData = responseWarehouse.data.items;

      responseWarehouse.data.items = responseWarehouseData.reduce((x, y) => {
        x.push({
          order: {
            id: responseOrderDetailData.id,
            name: responseOrderDetailData.name,
            code: responseOrderDetailData.code,
            deadline: responseOrderDetailData.deadline,
          },
          warehouse: {
            id: y.warehouseId,
            name: y.warehouseName,
            code: y.warehouseCode,
          },
          factory: {
            id: y.factoryId,
            name: y.factoryName,
          },
          user: {
            id: request.user.id,
            name: request.user.username,
            code: request.user.code,
          },
        });
        return x;
      }, []);

      return plainToClass(GetListIoqcOrderResponseDto, responseWarehouse, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      console.log(err);
      return;
    }
  }

  // Lấy dữ liệu Item theo ID của Warehouse + ID Order
  async getListIoqcItemByWarehouseAndOrder(
    request: GetListIoqcItemByWarehouseAndOrderRequestDto,
  ): Promise<GetListIoqcItemByWarehouseAndOrderResponseDto | any> {
    let responseData;
    const { type, filter, page, limit, orderId, warehouseId, keyword } = request;
    delete request['limit'];
    delete request['page'];

    try {
      if (
        type === STAGES_OPTION.PRO_IMPORT ||
        type === STAGES_OPTION.PRO_EXPORT
      ) {
        request['id'] = request['orderId'];
        delete request['type'];
        delete request['orderId'];

        responseData = await this.saleServiceClient
          .send('get_production_order_warehouse', request)
          .toPromise();
      } else if (
        type === STAGES_OPTION.PO_IMPORT ||
        type === STAGES_OPTION.SO_EXPORT
      ) {
        request['id'] = request['orderId'];
        delete request['type'];
        delete request['orderId'];

        if (type === STAGES_OPTION.PO_IMPORT) {
          responseData = await this.saleServiceClient
            .send('get_purchased_order_import_warehouse', request)
            .toPromise();
        } else {
          responseData = await this.saleServiceClient
            .send('get_sale_order_export_warehouse', request)
            .toPromise();
        }
      }
      if (responseData.statusCode !== ResponseCodeEnum.SUCCESS) return;

      const textSearchKeyword = keyword ? keyword.toLowerCase() : '';
      const dataItems = responseData.data.items;

      const dataSearch = dataItems.filter((x) =>
        (x?.name?.toLowerCase().includes(textSearchKeyword)
        || x?.code?.toLowerCase().includes(textSearchKeyword))
        && x?.qcCheck == 1
        && x?.qcCriteriaId
      );

      const paginate = (dataSearch, page, limit) => {
        return dataSearch.slice((page - 1) * limit, page * limit);
      };

      const dataPaginate = paginate(dataSearch, page, limit);

      const response = dataPaginate.reduce((x, y) => {
        x.push({
          orderId: orderId,
          warehouseId: warehouseId,
          ...y,
        });
        return x;
      }, []);

      return {
        items: response,
        meta: { total: dataSearch.length, page: page },
      };
    } catch (err) {
      console.log(err);
      return;
    }
  }

  // sale order export
  async getSaleOrderExportById(id: number): Promise<any> {
    try {
      const response = await this.saleServiceClient
        .send('get_sale_order_export_detail', { id: id })
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return '';
      }

      return response.data;
    } catch (err) {
      return '';
    }
  }

  async updateIOQcQuantity(
    request: UpdateIOQcQuantityRequestDto,
    type: number
  ): Promise<any> {
    let response;
    try {
      switch (type) {
        case STAGES_OPTION.PO_IMPORT:
          response = await this.saleServiceClient
            .send('update_po_qc_quantity', request)
            .toPromise();
          break;
        case STAGES_OPTION.SO_EXPORT:
          response = await this.saleServiceClient
            .send('update_sale_order_export_warehouse_qc_quantity', request)
            .toPromise();
          break;
        case STAGES_OPTION.PRO_IMPORT:
          response = await this.saleServiceClient
            .send('update_pro_qc_quantity', request)
            .toPromise();
          break;
        case STAGES_OPTION.PRO_EXPORT:
          response = await this.saleServiceClient
            .send('update_pro_qc_quantity', request)
            .toPromise();
          break;
      }
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return '';
      }
      return response;
    } catch (err) {
      return '';
    }
  }

  async getPurchasedOrderByConditions(
    params: any
  ): Promise<any> {
    try {
      const response = await this.saleServiceClient
        .send('get_purchased_order_import_list', params)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }

      return response?.data?.items;
    } catch (err) {
      return [];
    }
  }

  async getProductionOrderByConditions(
    params: any
  ): Promise<any> {
    try {
      const response = await this.saleServiceClient
        .send('get_production_order_list', params)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }

      return response?.data?.items;
    } catch (err) {
      return [];
    }
  }

  async getSaleOrderExportByConditions(
    params: any
  ): Promise<any> {
    try {
      const response = await this.saleServiceClient
        .send('get_sale_order_export_list', params)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }

      return response?.data?.items;
    } catch (err) {
      return [];
    }
  }

  // WEB PLAN LIST ORDER SELECT
  // Lấy dữ liệu Order
  async getListOrderByQualityPlanIOqc(
    request: any,
  ): Promise<any> {
    const { type } = request;
    let response;
    let typePro;

    request.isGetAll = '1';

    if (type === STAGES_OPTION.PRO_IMPORT) {
      typePro = OrderTypeProductionOrderEnum.Input;
    } else if (type === STAGES_OPTION.PRO_EXPORT) {
      typePro = OrderTypeProductionOrderEnum.Output;
    }

    const typeProFilter = [
      {
        column: 'type',
        text: `${typePro}`,
      },
    ];
    const orderConfirmedAndInProgress = [
      {
        column: 'status',
        text: `${OrderStatusEnum.Confirmed},${OrderStatusEnum.InProgress}`,
      },
    ];
    const orderQCChecked = [
      {
        column: 'qcCheck',
        text: `${OrderQCCheckedEnum.Checked}`,
      },
    ];

    try {
      if (
        type === STAGES_OPTION.PRO_IMPORT ||
        type === STAGES_OPTION.PRO_EXPORT
      ) {
        delete request['type'];
        request.filter = request.filter
          ? [
              ...request.filter,
              ...typeProFilter,
              ...orderConfirmedAndInProgress,
              ...orderQCChecked,
            ]
          : [
              ...typeProFilter,
              ...orderConfirmedAndInProgress,
              ...orderQCChecked,
            ];

        response = await this.saleServiceClient
          .send('get_production_order_list', request)
          .toPromise();
        if (response?.statusCode !== ResponseCodeEnum?.SUCCESS) {
          return [];
        }
      } else if (
        type === STAGES_OPTION.PO_IMPORT ||
        type === STAGES_OPTION.SO_EXPORT
      ) {
        delete request['type'];
        request.filter = request.filter
          ? [
              ...request.filter,
              ...orderConfirmedAndInProgress,
              ...orderQCChecked,
            ]
          : [
              ...orderConfirmedAndInProgress,
              ...orderQCChecked,
            ];

        if (type === STAGES_OPTION.PO_IMPORT){
          response = await this.saleServiceClient
            .send('get_purchased_order_import_list', request)
            .toPromise();
          if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
            return [];
          }
        }else {
          response = await this.saleServiceClient
            .send('get_sale_order_export_list', request)
            .toPromise();
          if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
            return [];
          }
        }
      }

      return response?.data?.items;
    } catch (err) {
      return;
    }
  }
}
