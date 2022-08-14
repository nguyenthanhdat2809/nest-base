import { Inject, Injectable } from '@nestjs/common';
import { ResponsePayload } from '@utils/response-payload';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { plainToClass } from 'class-transformer';
import { I18nRequestScopeService, I18nService } from 'nestjs-i18n';
import { ErrorMessageEnum } from '@constant/error-message.enum';
import { stringFormat, toStringTrim } from '@utils/object.util';
import { PagingResponse } from '@utils/paging.response';
import { isEmpty, map, uniq } from 'lodash';
import { InjectConnection } from '@nestjs/typeorm';
import { SuccessResponse } from '@utils/success.response.dto';
import { ApiError } from '@utils/api.error';
import { ProduceService } from '@components/produce/produce.service';
import { ReportServiceInterface } from '@components/report/interface/report.service.interface';
import { ReportQcRequestDto } from '@components/report/dto/request/report-qc.request.dto';
import { GetListReportQcOperationProductResponseDto } from '@components/report/dto/response/get-list-report-qc-operation-product.response.dto';
import { ReportQcOperationProductResponseDto } from '@components/report/dto/response/report-qc-operation-product.response.dto';
import { CsvWriter } from '@core/csv/csv.write';
import {
  REPORT_QC_OPERATION_PRODUCT_HEADER,
  REPORT_QC_OPERATION_PRODUCT_NAME,
  REPORT_QC_INPUT_NAME,
  REPORT_QC_OUTPUT_NAME,
  REPORT_IOQC_HEADER,
} from '@components/report/report.constant';
import { ErrorReportRepositoryInterface } from '@components/error-report/interface/error-report.repository.interface';
import { ErrorReportStatus } from '@entities/error-report/error-report.entity';
import {
  STAGES_OPTION,
  STAGE_VALUE
} from '@constant/qc-stage.constant';
import { QualityPlanRepositoryInterface } from '@components/quality-plan/interface/quality-plan.repository.interface';
import { ListReportIOqcResponseDto } from '@components/report/dto/response/list-report-ioqc.response.dto';
import { SaleServiceInterface } from '@components/sale/interface/sale.service.interface';
import { ItemServiceInterface } from '@components/item/interface/item.service.interface';
import { TypeReport } from '@components/report/report.constant';
import { sortService, paginationService } from '@utils/common';

@Injectable()
export class ReportService implements ReportServiceInterface {
  constructor(
    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceService,

    @Inject('SaleServiceInterface')
    private readonly saleService: SaleServiceInterface,

    @Inject('ErrorReportRepositoryInterface')
    private readonly errorReportRepository: ErrorReportRepositoryInterface,

    @Inject('QualityPlanRepositoryInterface')
    private readonly qualityPlanRepository: QualityPlanRepositoryInterface,

    @Inject('ItemServiceInterface')
    private readonly itemService: ItemServiceInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  public async getListReportQcOperationProduct(
    request: ReportQcRequestDto,
  ): Promise<ResponsePayload<GetListReportQcOperationProductResponseDto | any>> {
    const { sort, page, limit } = request;
    const qcCheckOut = [
      {
        column: 'qcCheckOut', // qcCheckOut dùng cho công đoạn đầu ra, qcCheckIn dùng cho công đoạn đầu vào
        text: '1', // 0: lấy tất cả WO có công đoạn ko cần QC, 1: ngược lại
      },
    ];

    if(request?.filter){
      request.filter = [
        ...request.filter,
        ...qcCheckOut,
      ]
    }else{
      request.filter = qcCheckOut;
    }

    request.isGetAll = '1';

    const workOrders = await this.produceService.getListWorkOrder(request);
    if (workOrders.statusCode !== ResponseCodeEnum.SUCCESS) {
      return;
    }

    const workOrderData = workOrders?.data?.items;

    if(isEmpty(workOrderData)){
      return new ResponseBuilder<PagingResponse>({
        items: [],
        meta: { total: 0, page: 0 },
      })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
    }

    const errorReports = await this.errorReportRepository.getListErrorReportStageDetailByStageId(STAGES_OPTION.OUTPUT_PRODUCTION);

    let responseRef = workOrderData.reduce((x, y) => {
      let errorReportId = []
      for(let i = 0; i < errorReports.length; i++){
        if (errorReports[i].workOrderId === y.id){
          errorReportId.push(errorReports[i].errorReportId)
        }
      }

      x.push({
        id: y.id ? y.id : '',                                                                      // id
        moName: y.mo.name ? y.mo.name : '',                                                        // Tên Lệnh Sản Xuất
        itemName: y.bom.itemName ? y.bom.itemName : '',                                            // Tên sản phẩm
        routingName: y.routing.name ? y.routing.name : '',                                         // Tên qui trình
        producingStepName: y.producingStep.name ? y.producingStep.name : '',                       // Tên công đoạn
        quantity: y?.quantity ? Number(y.quantity) : 0,                                            // Số lượng kế hoạch
        actualQuantity: y?.actualQuantity ? Number(y.actualQuantity) : 0,                          // Số lượng đã sản xuất
        totalUnQcQuantity: y?.totalUnQcQuantity ? Number(y.totalUnQcQuantity) : 0,                 // Số lượng cần QC
        totalQcQuantity: y?.totalQcQuantity ? Number(y.totalQcQuantity) : 0,                       // Số lượng đã QC
        errorQuantity: y?.errorQuantity ? Number(y.errorQuantity) : 0,                             // Số lượng lỗi
        totalQcRejectQuantity: y?.totalQcRejectQuantity ? Number(y.totalQcRejectQuantity) : 0,     // Số lượng lỗi còn lại
        errorReportId: uniq(errorReportId),                                                        // Id phiếu báo cáo lỗi
      })

      return x;
    }, []);

    if(isEmpty(responseRef)){
      return new ResponseBuilder<PagingResponse>({
        items: [],
        meta: { total: 0, page: 1 },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    }

    // SORT BY SERVICE
    responseRef = sortService(responseRef, sort, [
      'itemName',
      'routingName',
      'producingStepName',
      'totalUnQcQuantity',
      'totalQcQuantity',
      'errorQuantity',
      'totalQcRejectQuantity'
    ]);

    // PAGINATE
    if(page && limit){
      responseRef = paginationService(responseRef, Number(page), Number(limit));
    }

    const response = plainToClass(ReportQcOperationProductResponseDto, responseRef, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder<PagingResponse>({
      items: response,
      meta: { total: workOrders?.data?.meta?.total, page: page },
    })
    .withCode(ResponseCodeEnum.SUCCESS)
    .build();
  }

  public async getListReportIOqc(
    request: ReportQcRequestDto,
    type: number,
    isExport?: boolean,
  ): Promise<any> {
    const { sort, filter, user } = request;

    // SO PRO PO
    let filterOrderIds = [];
    const orderCodeFilter = filter?.find(
      (item) => item.column === 'orderCode',
    );

    const orderNameFilter = filter?.find(
      (item) => item.column === 'orderName',
    );

    let poFilterIds = [],
      proFilterIds = [],
      soFilterIds = [];

    if (orderCodeFilter || orderNameFilter) {
      const paramFilterOrder = [];
      for (let i = 0; i < filter.length; i++) {
        if (['orderName', 'orderCode'].includes(filter[i].column)) {
          let columnSearch: string;
          if (filter[i].column == 'orderName') {
            columnSearch = 'name';
          } else if (filter[i].column == 'orderCode') {
            columnSearch = 'code';
          }

          paramFilterOrder.push({
            column: columnSearch,
            text: filter[i].text.trim(),
          });
        }
      }

      const orderParams = {
        isGetAll: '1',
        user: user,
        filter: paramFilterOrder,
      };

      const dataFilterPos = await this.saleService.getPurchasedOrderByConditions(orderParams);
      const dataFilterPros = await this.saleService.getProductionOrderByConditions(orderParams);
      const dataFilterSos = await this.saleService.getSaleOrderExportByConditions(orderParams);

      if (
        isEmpty(dataFilterPos)
        && isEmpty(dataFilterPros)
        && isEmpty(dataFilterSos)
      ) {
        return new ResponseBuilder<PagingResponse>({
          items: [],
          meta: { total: 0, page: 0 },
        })
          .withCode(ResponseCodeEnum.SUCCESS)
          .build();
      }

      if (!isEmpty(dataFilterPos)) {
        poFilterIds = dataFilterPos.map((po) => po.id);
      }

      if (!isEmpty(dataFilterPros)) {
        proFilterIds = dataFilterPros.map((pro) => pro.id);
      }

      if (!isEmpty(dataFilterSos)) {
        soFilterIds = dataFilterSos.map((so) => so.id);
      }
    }

    // ITEM NAME
    let filterItemIds = [];
    const itemNameFilter = filter?.find(
      (item) => item.column === 'itemName',
    );

    const itemCodeFilter = filter?.find(
      (item) => item.column === 'itemCode',
    );

    let dataFilterItems;
    if (itemNameFilter || itemCodeFilter) {
      const paramFilterItem = [];
      for (let i = 0; i < filter.length; i++) {
        if (['itemName', 'itemCode'].includes(filter[i].column)) {
          let columnSearch: string;
          if (filter[i].column == 'itemName') {
            columnSearch = 'name';
          } else if (filter[i].column == 'itemCode') {
            columnSearch = 'code';
          }

          paramFilterItem.push({
            column: columnSearch,
            text: filter[i].text.trim(),
          });
        }
      }

      const itemParams = {
        isGetAll: '1',
        user: user,
        filter: paramFilterItem,
      };

      dataFilterItems = await this.itemService.getItemByConditions(
        itemParams
      );

      if (isEmpty(dataFilterItems)) {
        return new ResponseBuilder<PagingResponse>({
          items: [],
          meta: { total: 0, page: 0 },
        })
          .withCode(ResponseCodeEnum.SUCCESS)
          .build();
      }

      filterItemIds = dataFilterItems.map((item) => item.id)
    }

    // STAGE
    let filterStageIds = [];
    const stageNameFilter = request.filter?.find(
      (item) => item.column === 'stageName',
    );

    if (!isEmpty(stageNameFilter)) {
      const stages = STAGE_VALUE;
      const valueStageNameFilter = stageNameFilter.text.trim();

      for (const stage of stages) {
        if (stage.text.toLowerCase().includes(valueStageNameFilter.toLowerCase())) {
          filterStageIds.push(stage.value);
        }
      }

      if (isEmpty(filterStageIds)) {
        return new ResponseBuilder<PagingResponse>({
          items: [],
          meta: { total: 0, page: 0 },
        })
          .withCode(ResponseCodeEnum.SUCCESS)
          .build();
      }
    }

    // Query Data Quality Plan
    const response = await this.qualityPlanRepository.getListOfReportIOqc(
      request,
      type,
      poFilterIds,
      proFilterIds,
      soFilterIds,
      filterItemIds,
      filterStageIds,
      isExport
    );

    let data = new ListReportIOqcResponseDto();
    let responseData = [];
    const qualityPlans = response.result;
    let itemIds = qualityPlans.map((q) => q.itemId);
    let itemData;
    if (itemIds.length > 0) {
      itemData = await this.itemService.getListByIDs(uniq(itemIds));
    }

    let poData, proData, soData;
    if(type == TypeReport.INPUT){
      let poIds = qualityPlans
        .filter((q) => q.qcStageId == STAGES_OPTION.PO_IMPORT)
        .map((q) => q.orderId);

      let proIds = qualityPlans
        .filter((q) => q.qcStageId == STAGES_OPTION.PRO_IMPORT)
        .map((q) => q.orderId);

      if (poIds.length > 0) {
        poData = await this.saleService.getPurchasedOrderByIds(uniq(poIds));
      }

      if (proIds.length > 0) {
        proData = await this.saleService.getProductionOrderByIds(uniq(proIds));
      }
    }

    if(type == TypeReport.OUTPUT){
      let proIds = qualityPlans
        .filter((q) => q.qcStageId == STAGES_OPTION.PRO_EXPORT)
        .map((q) => q.orderId);

      let soIds = qualityPlans
        .filter((q) => q.qcStageId == STAGES_OPTION.SO_EXPORT)
        .map((q) => q.orderId);

      if (proIds.length > 0) {
        proData = await this.saleService.getProductionOrderByIds(uniq(proIds));
      }

      if (soIds.length > 0) {
        soData = await this.saleService.getSaleOrderExportByIds(uniq(soIds));
      }
    }

    const count = response?.count ? Number(response.count) : 0;
    const page = request?.page ? Number(request.page) : 0;
    const limit = request?.limit ? Number(request.limit) : 0;
    const countQuanlityPlan = count - (page - 1) * limit;
    const indexPage = count < limit ? count : countQuanlityPlan;

    for(let i = 0; i < qualityPlans.length; i++){
      const qualityPlan = qualityPlans[i];

      let stageName = STAGE_VALUE.filter((st) => st.value == qualityPlan.qcStageId)[0].text;
      let order;
      let orderCode;
      let orderName;
      if(qualityPlan.qcStageId == STAGES_OPTION.PO_IMPORT){
        order = poData.filter((or) => or.id == qualityPlan.orderId)[0];
      }

      if(qualityPlan.qcStageId == STAGES_OPTION.PRO_IMPORT || qualityPlan.qcStageId == STAGES_OPTION.PRO_EXPORT){
        order = proData.filter((or) => or.id == qualityPlan.orderId)[0];
      }

      if(qualityPlan.qcStageId == STAGES_OPTION.SO_EXPORT){
        order = soData.filter((or) => or.id == qualityPlan.orderId)[0];
      }
      orderCode = order?.code;
      orderName = order?.name;
      // ITEM
      const item = itemData.filter((item) => item.id == qualityPlan.itemId)[0];
      const itemCode = item?.code;
      const itemName = item?.name;

      let errorReportIds = [];
      const errorReports = await this.errorReportRepository.getListErrorReportByStageIdAndOrderIdAndItemId(
        qualityPlan.qcStageId,
        qualityPlan.orderId,
        qualityPlan.itemId,
      )

      if(errorReports){
        errorReportIds = errorReports.map((er) => er.id);
      }

      data = {
        id: indexPage - i,
        qcStageId: qualityPlan.qcStageId,
        stageName: stageName,
        orderCode: orderCode,
        orderName: orderName,
        itemCode: itemCode,
        itemName: itemName,
        planQuantity: qualityPlan?.planQuantity ? Number(qualityPlan.planQuantity) : 0,
        actualQuantity: qualityPlan?.actualQuantity ? Number(qualityPlan.actualQuantity) : 0,
        needQCQuantity: qualityPlan?.needQCQuantity ? Number(qualityPlan.needQCQuantity) : 0,
        doneQCQuantity: qualityPlan?.doneQCQuantity ? Number(qualityPlan.doneQCQuantity) : 0,
        errorQuantity: qualityPlan?.errorQuantity ? Number(qualityPlan.errorQuantity) : 0,
        errorReportId: errorReportIds,
      }

      responseData.push(data);
    }

    // SORT BY SERVICE
    responseData = sortService(responseData, sort, [
      'stageName',
      'orderName',
      'itemName'
    ]);

    // PAGINATE
    if(page && limit && !isExport){
      responseData = paginationService(responseData, page, limit);
    }

    if(isExport){
      const csvWriter = new CsvWriter();
      csvWriter.name = type == TypeReport.INPUT
        ? REPORT_QC_INPUT_NAME
        : REPORT_QC_OUTPUT_NAME;
      csvWriter.mapHeader = REPORT_IOQC_HEADER;
      csvWriter.i18n = this.i18n;

      if(isEmpty(responseData)){
        responseData = [
          {
            id: '',
            qcStageId: '',
            stageName: '',
            orderName: '',
            itemName: '',
            planQuantity: '',
            actualQuantity: '',
            needQCQuantity: '',
            doneQCQuantity: '',
            errorQuantity: '',
          }
        ]
      }

      return new ResponseBuilder<any>({
        file: await csvWriter.writeCsv(responseData),
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();
    }

    return new ResponseBuilder<PagingResponse>({
      items: responseData,
      meta: { total: response.count, page: page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async exportReportQcOperationProduct(
    request: ReportQcRequestDto,
  ): Promise<ResponsePayload<any>> {
    const qcCheckOut = [
      {
        column: 'qcCheckOut', // qcCheckOut dùng cho công đoạn đầu ra, qcCheckIn dùng cho công đoạn đầu vào
        text: '1', // 0: lấy tất cả WO có công đoạn ko cần QC, 1: ngược lại
      },
    ];

    if(request?.filter){
      request.filter = [
        ...request.filter,
        ...qcCheckOut,
      ]
    }else{
      request.filter = qcCheckOut;
    }

    request.isGetAll = '1';

    const workOrders = await this.produceService.getListWorkOrder(request);
    if (workOrders.statusCode !== ResponseCodeEnum.SUCCESS) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const workOrderData = workOrders.data.items;
    const responseRef = workOrderData.reduce((x, y) => {
      x.push({
        id: y.id ? y.id : '',
        moName: y.mo.name ? y.mo.name : '',
        itemName: y.bom.itemName ? y.bom.itemName : '',
        routingName: y.routing.name ? y.routing.name : '',
        producingStepName: y.producingStep.name ? y.producingStep.name : '',
        quantity: y?.quantity ? Number(y.quantity) : 0,
        actualQuantity: y?.actualQuantity ? Number(y.actualQuantity) : 0,
        totalUnQcQuantity: y?.totalUnQcQuantity ? Number(y.totalUnQcQuantity) : 0,
        totalQcQuantity: y?.totalQcQuantity ? Number(y.totalQcQuantity) : 0,
        errorQuantity: y?.errorQuantity ? Number(y.errorQuantity) : 0,
        totalQcRejectQuantity: y?.totalQcRejectQuantity ? Number(y.totalQcRejectQuantity) : 0,
      })
      return x
    }, [])

    const csvWriter = new CsvWriter();
    csvWriter.name = REPORT_QC_OPERATION_PRODUCT_NAME
    csvWriter.mapHeader = REPORT_QC_OPERATION_PRODUCT_HEADER;
    csvWriter.i18n = this.i18n;
    let index = 0;
    const dataCsv = responseRef.map((i) => {
      index++;
      return {
        i: index,
        moName: i.moName,
        itemName: i.itemName,
        routingName: i.routingName,
        producingStepName: i.producingStepName,
        quantity: i.quantity,
        actualQuantity: i.actualQuantity,
        totalUnQcQuantity: i.totalUnQcQuantity,
        totalQcQuantity: i.totalQcQuantity,
        errorQuantity: i.errorQuantity,
        totalQcRejectQuantity: i.totalQcRejectQuantity,
      };
    });

    return new ResponseBuilder<any>({
      file: await csvWriter.writeCsv(dataCsv),
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .build();
  }
}
