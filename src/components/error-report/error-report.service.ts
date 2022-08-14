import { Inject, Injectable } from '@nestjs/common';
import { ResponsePayload } from '@utils/response-payload';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { plainToClass } from 'class-transformer';
import { I18nRequestScopeService, I18nService } from 'nestjs-i18n';
import { isEmpty, uniq } from 'lodash';
import { ErrorReportServiceInterface } from '@components/error-report/interface/error-report.service.interface';
import { ErrorReportRepositoryInterface } from '@components/error-report/interface/error-report.repository.interface';
import { ErrorReportListRequestDto } from '@components/error-report/dto/request/error-report-list.request.dto';
import { PagingResponse } from '@utils/paging.response';
import { ErrorReportDetailResponseDto } from '@components/error-report/dto/response/error-report-detail.response.dto';
import {
  ErrorReportOnlyIdAndNameResponseDto,
  ErrorReportResponseDto,
} from '@components/error-report/dto/response/error-report.response.dto';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { STAGE_MAP } from '@components/quality-point/quality-point.constant';
import {
  ErrorReport,
  ErrorReportStatus,
  QCType,
} from '@entities/error-report/error-report.entity';
import { UpdateErrorReportRequestDto } from '@components/error-report/dto/request/update-error-report.request.dto';
import { ProduceServiceInterface } from '@components/produce/interface/produce.service.interface';
import { ErrorMessageEnum } from '@constant/error-message.enum';
import { SaleServiceInterface } from '@components/sale/interface/sale.service.interface';
import { ErrorReportByCommandItemWarehouseRequestDto } from '@components/error-report/dto/request/error-report-by-command-item-warehouse.request.dto';
import { ErrorReportIoqcDetail } from '@entities/error-report/error-report-ioqc-detail.entity';
import {
  ShowCreateErrorReportCauseGroupResponseDto,
  ShowCreateErrorReportErrorGroupResponseDto,
  ShowCreateErrorReportReceivedUsersResponseDto,
  ShowCreateErrorReportResponseDto,
} from '@components/error-report/dto/response/show-create-error-report.response.dto';
import { ErrorGroupServiceInterface } from '@components/error-group/interface/error-group.service.interface';
import { CauseGroupServiceInterface } from '@components/cause-group/interface/cause-group.service.interface';
import { CheckListServiceInterface } from '@components/check-list/interface/check-list.service.interface';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, In } from 'typeorm';
import { ApiError } from '@utils/api.error';
import { ErrorReportStageDetail } from '@entities/error-report/error-report-stage-detail.entity';
import { CreateErrorReportResponseDto } from '@components/error-report/dto/response/create-error-report-response.dto';
import { QualityPointServiceInterface } from '@components/quality-point/interface/quality-point.service.interface';
import { GetErrorReportDetailByWoResponseDto } from '@components/error-report/dto/response/get-error-report-detail-by-wo.response.dto';
import { ActionCategoryServiceInterface } from '@components/action-category/interface/action-category.service.interface';
import { UpdateErrorReportsAfterRepairRequestDto } from '@components/error-report/dto/request/update-error-reports-after-repair.request.dto';
import { ErrorReportErrorDetailRepositoryInterface } from '@components/error-report/interface/error-report-error-detail.repository.interface';
import { UpdateErrorReportsAfterRepairResponseDto } from '@components/error-report/dto/response/update-error-reports-after-repair.response.dto';
import { ErrorReportResponseForAppDto } from '@components/error-report/dto/response/error-reports-list-for-app.response.dto';
import { ErrorReportStageDetailForAppResponseDto } from '@components/error-report/dto/response/error-report-stage-detail-for-app.response.dto';
import { CreateErrorReportRequestDto } from '@components/error-report/dto/request/create-error-report.request.dto';
import { ErrorReportListIOForAppRequestDto } from '@components/error-report/dto/request/error-report-list-io-for-app.request.dto';
import { ErrorReportIOForAppResponseDto } from '@components/error-report/dto/response/error-report-io-for-app.response.dto';
import { ItemServiceInterface } from '@components/item/interface/item.service.interface';
import { STAGES_OPTION } from '@constant/qc-stage.constant';
import { OrderTypeProductionOrderEnum } from '@components/sale/sale.constant';
import { RejectErrorReportRequestDto } from '@components/error-report/dto/request/reject-error-report.request.dto';
import { TransactionHistoryServiceInterface } from '@components/transaction-history/interface/transaction-history.service.interface';
import { ConfirmProduceStepErrorReportRequestDto } from '@components/error-report/dto/request/confirm-produce-step-error-report.request.dto';
import { UpdateWOQcQuantityRequestDto } from '@components/produce/dto/request/update-wo-qc-quantity.request.dto';
import { CreateErrorReportIOqcRequestDto } from '@components/error-report/dto/request/create-error-report-ioqc.request.dto';
import { WorkOrderFilterColumn } from '@components/produce/produce.constant';
import { ConfirmIOqcErrorReportRequestDto } from '@components/error-report/dto/request/confirm-ioqc-error-report.request.dto';
import { UpdateIOQcQuantityRequestDto } from '@components/sale/dto/request/update-io-qc-quantity.request.dto';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { DetailErrorReportResponseDto } from '@components/error-report/dto/response/error-report-detail-io-for-app.response.dto';
import { ErrorReportDetailForWebResponseDto } from '@components/error-report/dto/response/error-report-detail-for-web-response.dto';
import { QualityPlanIOqcRepositoryInterface } from '@components/quality-plan/interface/quality-plan-ioqc.repository.interface';
import { QualityPlanRepositoryInterface } from '@components/quality-plan/interface/quality-plan.repository.interface';
import { UpdateQualityPlanIOqcByConfirmErrorReportRequestDto } from '@components/quality-plan/dto/request/update-quality-plan-ioqc.request.dto';
import {
  TransactionHistoryItemTypeEnum,
  TransactionHistoryTypeEnum,
} from '@components/transaction-history/transaction-history.constant';
import { TypeReport } from '@components/report/report.constant';
import { STAGE_VALUE } from '@constant/qc-stage.constant';
import { TransactionHistoryRepositoryInterface } from '@components/transaction-history/interface/transaction-history.repository.interface';
import { WorkCenterPlanQcShiftServiceInterface } from '@components/work-center-plan-qc-shift/interface/work-center-plan-qc-shift.service.interface';
import { WorkCenterPlanQcShiftRepositoryInterface } from '@components/work-center-plan-qc-shift/interface/work-center-plan-qc-shift.repository.interface';
import { enumerateDaysBetweenDates } from '@utils/common';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { QualityPointRepositoryInterface } from '@components/quality-point/interface/quality-point.repository.interface';
import { QUALITY_POINT_FORMALITY } from '@components/quality-point/quality-point.constant';
import { QCPlanStatus } from '@entities/quality-plan/quality-plan.entity';
import { QualityPlanServiceInterface } from '@components/quality-plan/interface/quality-plan.service.interface';
import { sortService, paginationService } from '@utils/common';
import {
  optionErorReportStatus,
  OPTION_ERROR_REPORT_PRIORITY,
  FILE_EXPORT_ERROR_REPORT_NAME,
  FILE_EXPORT_ERROR_REPORT_HEADER,
  FILE_EXPORT_ERROR_REPORT_DETAIL_NAME,
  FILE_EXPORT_ERROR_REPORT_DETAIL_HEADER,
} from '@components/error-report/error-report.constant';
import { NumberOfTime } from '@entities/quality-point/quality-point.entity';
import { TIME_ZONE_VN } from '@constant/common';
import { CsvWriter } from '@core/csv/csv.write';

const moment = extendMoment(Moment);

@Injectable()
export class ErrorReportService implements ErrorReportServiceInterface {
  constructor(
    @Inject('ErrorReportRepositoryInterface')
    private readonly errorReportRepository: ErrorReportRepositoryInterface,

    @Inject('ErrorReportErrorDetailRepositoryInterface')
    private readonly errorReportErrorDetailRepository: ErrorReportErrorDetailRepositoryInterface,

    @Inject('QualityPlanIOqcRepositoryInterface')
    private readonly qualityPlanIOqcRepository: QualityPlanIOqcRepositoryInterface,

    @Inject('QualityPlanRepositoryInterface')
    private readonly qualityPlanRepository: QualityPlanRepositoryInterface,

    @Inject('QualityPlanServiceInterface')
    private readonly qualityPlanService: QualityPlanServiceInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,

    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceServiceInterface,

    @Inject('SaleServiceInterface')
    private readonly saleService: SaleServiceInterface,

    @Inject('ItemServiceInterface')
    private readonly itemService: ItemServiceInterface,

    @Inject('ErrorGroupServiceInterface')
    private readonly errorGroupService: ErrorGroupServiceInterface,

    @Inject('CauseGroupServiceInterface')
    private readonly causeGroupService: CauseGroupServiceInterface,

    @Inject('CheckListServiceInterface')
    private readonly checkListService: CheckListServiceInterface,

    @Inject('QualityPointServiceInterface')
    private readonly qualityPointService: QualityPointServiceInterface,

    @Inject('ActionCategoryServiceInterface')
    private readonly actionCategoryService: ActionCategoryServiceInterface,

    @Inject('TransactionHistoryServiceInterface')
    private readonly transactionHistoryService: TransactionHistoryServiceInterface,

    @Inject('TransactionHistoryRepositoryInterface')
    private readonly transactionHistoryRepository: TransactionHistoryRepositoryInterface,

    @Inject('WorkCenterPlanQcShiftServiceInterface')
    private readonly workCenterPlanQcShiftService: WorkCenterPlanQcShiftServiceInterface,

    @Inject('WorkCenterPlanQcShiftRepositoryInterface')
    private readonly workCenterPlanQcShiftRepository: WorkCenterPlanQcShiftRepositoryInterface,

    @Inject('QualityPointRepositoryInterface')
    private readonly qualityPointRepository: QualityPointRepositoryInterface,

    @InjectConnection()
    private readonly connection: Connection,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  confirm(id: number, confirmBy: number): Promise<ResponsePayload<any>> {
    throw new Error('Method not implemented.');
  }

  // Get detail of an error report
  public async getDetail(id: number): Promise<ResponsePayload<any>> {
    const entity = await this.errorReportRepository.findOneById(id);
    if (!entity) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const errorReport = await this.errorReportRepository.getDetail(entity);
    let errorReportDetail: ErrorReportStageDetail | ErrorReportIoqcDetail;
    const reportType = errorReport.reportType;

    if (reportType == QCType.StageQC) {
      errorReportDetail = errorReport.errorReportStageDetail;
    } else if (reportType == QCType.InputQC || reportType == QCType.OutputQC) {
      errorReportDetail = errorReport.errorReportIoqcDetail;
    }

    const errorReportErrorList = errorReportDetail.errorReportErrorList;
    const errorReportResponseDto = plainToClass(
      ErrorReportDetailResponseDto,
      errorReport,
      {
        excludeExtraneousValues: true,
      },
    );
    const userMap = await this.userService.getUserMapByIds([
      errorReport.createdBy,
      errorReportErrorList.assignedTo,
    ]);

    errorReportResponseDto.createdBy = userMap.get(errorReport.createdBy);
    errorReportResponseDto.qcStageName =
      STAGE_MAP[errorReportResponseDto.qcStageId];

    await this.setErrorReportDetailUtil(errorReport, errorReportResponseDto);

    errorReportResponseDto.errorReportErrorList = {
      id: errorReportErrorList.id,
      errorDescription: errorReportErrorList.errorDescription,
      assignedTo: {
        id: errorReportErrorList.assignedTo,
        userName: userMap.get(errorReportErrorList.assignedTo),
      },
      repairDeadline: errorReportErrorList.repairDeadline,
      priority: errorReportErrorList.priority,
      errorReportStageDetailId: errorReportErrorList.errorReportStageDetailId,
      errorReportIoqcDetailId: errorReportErrorList.errorReportIoqcDetailId,
      errorReportErrorDetails: errorReportErrorList.errorReportErrorDetails.map(
        (e) => {
          return {
            id: e.id,
            errorGroup: {
              id: e.errorGroupId,
              name: e.errorGroup.name,
            },
            causeGroup: {
              id: e.causeGroupId,
              name: e.causeGroup.name,
            },
            errorItemQuantity: e.errorItemQuantity ? e.errorItemQuantity : 0,
            repairItemQuantity: e.repairItemQuantity ? e.repairItemQuantity : 0,
          };
        },
      ),
    };

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(errorReportResponseDto)
      .build();
  }

  public async getDetailWeb(id: number): Promise<ResponsePayload<any>> {
    const entity = await this.errorReportRepository.findOneById(id);
    if (!entity) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const errorReport = await this.errorReportRepository.getDetail(entity);
    if (!errorReport) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.ERROR_REPORT_NOT_FOUND'))
        .build();
    }

    const transactionHistory =
      await this.transactionHistoryRepository.getTransactionQcDetail(
        errorReport?.transactionHistoryId,
      );

    if (!transactionHistory) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.TRANSACTION_HISTORY_NOT_FOUND'),
        )
        .build();
    }

    // Tiêu chí
    const qualityPoint = await this.qualityPointRepository.findOneById(
      transactionHistory?.qualityPointId,
    );
    if (!qualityPoint) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.QUALITY_POINT_NOT_FOUND'))
        .build();
    }

    // Hình thức QC
    const formality = QUALITY_POINT_FORMALITY.filter(
      (x) => x.value == qualityPoint.formality,
    ).map((y) => y.text)[0];

    let workCenter: any;
    const reportType = errorReport.reportType;

    if (reportType == QCType.StageQC) {
      const workCenterResponse = await this.produceService.workCenterDetail(
        transactionHistory?.workCenterId,
      );
      if (isEmpty(workCenterResponse)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.WORK_CENTER_NOT_FOUND'))
          .build();
      }
      workCenter = workCenterResponse?.data;
    }

    let errorReportDetail: ErrorReportStageDetail | ErrorReportIoqcDetail;
    if (reportType == QCType.StageQC) {
      errorReportDetail = errorReport.errorReportStageDetail;
    } else if (reportType == QCType.InputQC || reportType == QCType.OutputQC) {
      errorReportDetail = errorReport.errorReportIoqcDetail;
    }
    const errorReportErrorList = errorReportDetail.errorReportErrorList;

    const errorReportResponseDto = plainToClass(
      ErrorReportDetailForWebResponseDto,
      errorReport,
      {
        excludeExtraneousValues: true,
      },
    );

    const userMap = await this.userService.getUserMapByIds([
      errorReport.createdBy,
      errorReportErrorList.assignedTo,
    ]);

    errorReportResponseDto.createdBy = userMap.get(errorReport.createdBy);
    errorReportResponseDto.qcStageName =
      STAGE_MAP[errorReportResponseDto.qcStageId];
    errorReportResponseDto.wcName = workCenter?.name;
    errorReportResponseDto.consignmentName =
      transactionHistory?.consignmentName;
    errorReportResponseDto.formality = formality;

    errorReportResponseDto.transactionHistoryCode = transactionHistory?.code;

    await this.setErrorReportDetailUtil(errorReport, errorReportResponseDto);

    errorReportResponseDto.errorReportErrorList = {
      id: errorReportErrorList.id,
      errorDescription: errorReportErrorList.errorDescription,
      assignedTo: {
        id: errorReportErrorList.assignedTo,
        userName: userMap.get(errorReportErrorList.assignedTo),
      },
      repairDeadline: errorReportErrorList.repairDeadline,
      priority: errorReportErrorList.priority,
      errorReportStageDetailId: errorReportErrorList.errorReportStageDetailId,
      errorReportIoqcDetailId: errorReportErrorList.errorReportIoqcDetailId,
      errorReportErrorDetails: errorReportErrorList.errorReportErrorDetails.map(
        (e) => {
          return {
            id: e.id,
            errorGroup: {
              id: e.errorGroupId,
              name: e.errorGroup.name,
            },
            causeGroup: {
              id: e.causeGroupId,
              name: e.causeGroup.name,
            },
            errorItemQuantity: e.errorItemQuantity ? e.errorItemQuantity : 0,
            repairItemQuantity: e.repairItemQuantity ? e.repairItemQuantity : 0,
          };
        },
      ),
    };

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(errorReportResponseDto)
      .build();
  }

  private async setErrorReportDetailUtil(
    errorReport: ErrorReport,
    errorReportResponseDto: ErrorReportDetailResponseDto,
  ) {
    const reportType = errorReport.reportType;
    if (reportType == QCType.StageQC) {
      const errorReportStageDetail = errorReport.errorReportStageDetail;
      const [routingName, producingStepName, moName, itemName, moCode] =
        await this.produceService.getProduceErrorReportStageDetail(
          errorReportStageDetail,
        );
      errorReportResponseDto.errorReportStageDetail = {
        id: errorReportStageDetail.id,
        moName: moName ? moName : '',
        moCode: moName ? moCode : '',
        itemName: itemName ? itemName : '',
        producingStepName: producingStepName ? producingStepName : '',
        routingName: routingName ? routingName : '',
      };
    } else {
      const errorReportIoqcDetail = errorReport.errorReportIoqcDetail;

      const [
        itemName,
        customerName,
        orderCode,
        warehouseName,
        deliveredAt,
        itemCode,
        orderName,
      ] = await this.saleService.getSaleErrorReportIoqcDetail(
        errorReportIoqcDetail,
        errorReport.qcStageId,
      );

      errorReportResponseDto.errorReportIoqcDetail = {
        id: errorReportIoqcDetail.id,
        itemName: itemName ? itemName : '',
        itemCode: itemCode ? itemCode : '',
        orderCode: orderCode ? orderCode : '',
        orderName: orderName ? orderName : '',
        customerName: customerName ? customerName : '',
        warehouseName: warehouseName ? warehouseName : '',
        deliveredAt: deliveredAt ? deliveredAt : '',
      };
    }
  }

  public async getList(
    request: ErrorReportListRequestDto,
  ): Promise<ResponsePayload<PagingResponse>> {
    const { isExport, filter, page, limit, user } = request;
    const { sort } = request;
    const stages = STAGE_VALUE;

    let paramNameStage = '';
    const filterStageSearch = {
      checked: false,
      stageValues: [],
    };

    if (!isEmpty(filter)) {
      for (const val of filter) {
        if (
          val.column === 'qcStageName' &&
          (val.text == null || !isEmpty(val.text.trim()))
        ) {
          filterStageSearch.checked = true;
          paramNameStage = val.text.trim();
        }
      }
    }

    for (const stage of stages) {
      if (stage.text.toLowerCase().includes(paramNameStage.toLowerCase())) {
        filterStageSearch.stageValues.push(stage.value);
      }
    }

    // USER NAME
    let filterUserIds = [];
    const userNameFilter = request.filter?.find(
      (item) => item.column === 'createdBy',
    );

    let dataFilterUsers;
    if (!isEmpty(userNameFilter)) {
      const params = {
        isGetAll: '1',
        filter: [
          {
            column: 'username',
            text: userNameFilter.text.trim(),
          },
        ],
      };

      dataFilterUsers = await this.userService.getUserByConditions(params);

      if (isEmpty(dataFilterUsers) || isEmpty(dataFilterUsers?.items)) {
        return new ResponseBuilder<PagingResponse>({
          items: [],
          meta: { total: 0, page: 0 },
        })
          .withCode(ResponseCodeEnum.SUCCESS)
          .build();
      }

      filterUserIds = dataFilterUsers?.items?.map((user) => user.id);
    }

    // SEARCH lệnh PO PRO SO MO
    const orderNameFilter = filter?.find((item) => item.column == 'orderName');
    const orderCodeFilter = filter?.find((item) => item.column == 'orderCode');

    let poFilterIds = [],
      proFilterIds = [],
      soFilterIds = [],
      woFilterIds = [];

    if (orderNameFilter || orderCodeFilter) {
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

      const dataFilterPos =
        await this.saleService.getPurchasedOrderByConditions(orderParams);
      const dataFilterPros =
        await this.saleService.getProductionOrderByConditions(orderParams);
      const dataFilterSos =
        await this.saleService.getSaleOrderExportByConditions(orderParams);
      let dataFilterWos;

      const moParams = {
        isGetAll: '1',
        filter: paramFilterOrder,
      };

      const dataFilterMos = await this.produceService.getMoByConditions(
        moParams,
      );
      const moArrayIds = dataFilterMos?.map((x) => x.id);

      let moStringIds = '';
      if (!isEmpty(moArrayIds)) {
        moStringIds = uniq(moArrayIds).join(',');
      }

      const woParams = {
        isGetAll: '1',
        filter: [{ column: 'moId', text: moStringIds }],
      };

      if (moStringIds) {
        dataFilterWos = await this.produceService.getWoByConditions(woParams);
      }

      if (
        isEmpty(dataFilterPos) &&
        isEmpty(dataFilterPros) &&
        isEmpty(dataFilterSos) &&
        isEmpty(dataFilterWos)
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

      if (!isEmpty(dataFilterWos)) {
        woFilterIds = dataFilterWos.map((wo) => wo.id);
      }
    }

    const { result, count } = await this.errorReportRepository.getList(
      request,
      filterStageSearch,
      filterUserIds,
      poFilterIds,
      proFilterIds,
      soFilterIds,
      woFilterIds,
    );

    if (isEmpty(result)) {
      return new ResponseBuilder<PagingResponse>({
        items: [],
        meta: { total: 0, page: 0 },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    }

    // MAP tên user, tên stage, PO SO PRO WO từ id
    const users = await this.userService.getUserMapByIds(
      uniq(
        result
          .map((x) => parseInt(x?.createdBy))
          .concat(
            result.map((x) => parseInt(x?.assignedTo)),
            result.map((x) => parseInt(x?.transactionHistoryCreatedByUserId)),
          ),
      ),
    );

    let poData = [],
      proImportData = [],
      proExportData = [],
      soData = [],
      moData = [];

    const poIds = result
      .filter((e) => e.qcStageId == STAGES_OPTION.PO_IMPORT)
      .map((e) => e.orderId);

    if (poIds.length > 0) {
      poData = await this.saleService.getPurchasedOrderByIds(uniq(poIds));
    }

    const proImportIds = result
      .filter((e) => e.qcStageId == STAGES_OPTION.PRO_IMPORT)
      .map((e) => e.orderId);

    if (proImportIds.length > 0) {
      proImportData = await this.saleService.getProductionOrderByIds(
        uniq(proImportIds),
      );
    }

    const proExportIds = result
      .filter((e) => e.qcStageId == STAGES_OPTION.PRO_EXPORT)
      .map((e) => e.orderId);

    if (proExportIds.length > 0) {
      proExportData = await this.saleService.getProductionOrderByIds(
        uniq(proExportIds),
      );
    }

    const soIds = result
      .filter((e) => e.qcStageId == STAGES_OPTION.SO_EXPORT)
      .map((e) => e.orderId);

    if (soIds.length > 0) {
      soData = await this.saleService.getSaleOrderExportByIds(uniq(soIds));
    }

    const woArrayIds = result
      .filter(
        (e) =>
          e.qcStageId == STAGES_OPTION.OUTPUT_PRODUCTION ||
          e.qcStageId == STAGES_OPTION.INPUT_PRODUCTION,
      )
      .map((e) => e.workOrderId);

    let woStringIds = '';
    if (!isEmpty(woArrayIds)) {
      woStringIds = uniq(woArrayIds).join(',');
    }

    const moParamFors = {
      isGetAll: '1',
      filter: [{ column: 'workOrderIds', text: woStringIds }],
    };

    if (woStringIds) {
      moData = await this.produceService.getMoByConditions(moParamFors);
    }

    const moDataFors = [];
    for (let i = 0; i < moData?.length; i++) {
      const mo = moData[i];
      const moIdFor = mo?.id;
      const moNameFor = mo?.name;
      const moCodeFor = mo?.code;
      let idWoFor = [];

      const moDetails = mo?.manufacturingOrderDetails;
      for (let j = 0; j < moDetails?.length; j++) {
        const moDetail = moDetails[j];
        const workOrderIds = moDetail?.workOrders?.map((x) => x.id);
        idWoFor = idWoFor.concat(workOrderIds);
      }

      moDataFors.push({
        id: moIdFor,
        name: moNameFor,
        code: moCodeFor,
        workOrderIds: uniq(idWoFor),
      });
    }

    // TODO MO DATA
    let data = result.reduce((x, y) => {
      // Lệnh
      let order;
      switch (Number(y?.qcStageId)) {
        case STAGES_OPTION.PO_IMPORT:
          order = poData.filter((or) => or.id == y.orderId)[0];
          break;
        case STAGES_OPTION.PRO_IMPORT:
          order = proImportData.filter((or) => or.id == y.orderId)[0];
          break;
        case STAGES_OPTION.PRO_EXPORT:
          order = proExportData.filter((or) => or.id == y.orderId)[0];
          break;
        case STAGES_OPTION.SO_EXPORT:
          order = soData.filter((or) => or.id == y.orderId)[0];
          break;
        case STAGES_OPTION.OUTPUT_PRODUCTION:
          order = moDataFors.filter((mo) =>
            mo?.workOrderIds?.includes(y?.workOrderId),
          )[0];
          break;
        case STAGES_OPTION.INPUT_PRODUCTION:
          order = moDataFors.filter((mo) =>
            mo?.workOrderIds?.includes(y?.workOrderId),
          )[0];
          break;
        default:
          break;
      }

      // Trạng thái
      const textStatus = optionErorReportStatus.find(
        (x) => x.value == y.status,
      );

      y.orderCode = order?.code ? order.code : '';
      y.orderName = order?.name ? order.name : '';
      y.createdBy = users.get(y?.createdBy) ? users.get(y.createdBy) : '';
      y.qcStageName = STAGE_MAP[y?.qcStageId] ? STAGE_MAP[y.qcStageId] : '';
      y.textStatus = textStatus?.text ? textStatus.text : '';

      x.push(y);

      return x;
    }, []);

    if (isEmpty(data)) {
      return new ResponseBuilder<PagingResponse>({
        items: [],
        meta: { total: 0, page: 1 },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    }

    // SORT BY SERVICE
    const statusSort = sort?.find((item) => item.column == 'status');
    if (!isEmpty(statusSort)) {
      sort.push({ column: 'textStatus', order: statusSort?.order });
    }

    data = sortService(data, sort, [
      'qcStageName',
      'createdBy',
      'orderCode',
      'orderName',
      'textStatus',
    ]);

    if (isEmpty(result) && !isExport) {
      return new ResponseBuilder<PagingResponse>({
        items: [],
        meta: { total: 0, page: 0 },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    }

    if (isExport) {
      let dataExport = result.reduce((x, y) => {
        // Độ ưu tiên
        const priority = OPTION_ERROR_REPORT_PRIORITY.find(
          (x) => x.value == y.priority,
        );

        x.push({
          code: y.code, // mã phiếu
          name: y.name, // tên phiếu
          qcStageName: y.qcStageName, // Công đoạn Qc
          orderName: y.orderName, // Tên lệnh
          transactionHistoryCode: y.transactionHistoryCode, // Mã giao dịch
          transactionHistoryCreatedAt: y?.transactionHistoryCreatedAt
            ? moment(y.transactionHistoryCreatedAt)
                .tz(TIME_ZONE_VN)
                .format('DD/MM/YYYY')
            : '', // Ngày thực hiện
          transactionHistoryCreatedByUser: users.get(
            y?.transactionHistoryCreatedByUserId,
          )
            ? users.get(y.transactionHistoryCreatedByUserId)
            : '', // Người thực hiện
          transactionHistoryConsignmentName:
            y?.transactionHistoryConsignmentName
              ? y.transactionHistoryConsignmentName
              : '', // Số lô
          priority: priority?.text ? priority.text : '', // Độ ưu tiên
          repairDeadline: y?.repairDeadline
            ? moment(y?.repairDeadline).tz(TIME_ZONE_VN).format('DD/MM/YYYY')
            : '', // Kì hạn sửa
          errorDescription: y?.errorDescription ? y.errorDescription : '', // Mô tả
          assignedTo: users.get(y?.assignedTo) ? users.get(y.assignedTo) : '', // Người nhận
          status: y.textStatus, // Trạng thái
        });

        return x;
      }, []);

      if (isEmpty(dataExport)) {
        dataExport = [
          {
            code: '',
            name: '',
            qcStageName: '',
            orderName: '',
            transactionHistoryCode: '',
            transactionHistoryCreatedAt: '',
            transactionHistoryCreatedByUser: '',
            transactionHistoryConsignmentName: '',
            priority: '',
            repairDeadline: '',
            errorDescription: '',
            assignedTo: '',
            status: '',
          },
        ];
      }

      const csvWriter = new CsvWriter();
      csvWriter.name = FILE_EXPORT_ERROR_REPORT_NAME;
      csvWriter.mapHeader = FILE_EXPORT_ERROR_REPORT_HEADER;
      csvWriter.i18n = this.i18n;

      let dataExportDetail = result.reduce((x, y) => {
        const errorReportErrorDetails = y?.errorReportErrorDetails;
        for (let i = 0; i < errorReportErrorDetails?.length; i++) {
          const errorReportErrorDetail = errorReportErrorDetails[i];

          x.push({
            code: y.code, // Mã phiếu
            errorGroupName: errorReportErrorDetail.errorGroupName, // Loại lỗi
            causeGroupName: errorReportErrorDetail.causeGroupName, // Nguyên nhân lỗi
            errorItemQuantity: errorReportErrorDetail.errorItemQuantity, // Số sản phẩm lỗi
            repairItemQuantity: errorReportErrorDetail.repairItemQuantity, // Số lượng sản phẩm sửa
          });
        }

        return x;
      }, []);

      if (isEmpty(dataExportDetail)) {
        dataExportDetail = [
          {
            code: '',
            errorGroupName: '',
            causeGroupName: '',
            errorItemQuantity: '',
            repairItemQuantity: '',
          },
        ];
      }

      const csvWriterDetail = new CsvWriter();
      csvWriterDetail.name = FILE_EXPORT_ERROR_REPORT_DETAIL_NAME;
      csvWriterDetail.mapHeader = FILE_EXPORT_ERROR_REPORT_DETAIL_HEADER;
      csvWriterDetail.i18n = this.i18n;

      return new ResponseBuilder<any>({
        file: await csvWriter.writeCsv(dataExport),
        fileDetail: await csvWriterDetail.writeCsv(dataExportDetail),
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();
    }

    // PAGINATE
    if (page && limit) {
      data = paginationService(data, Number(page), Number(limit));
    }

    const items = plainToClass(ErrorReportResponseDto, data, {
      excludeExtraneousValues: true,
    }) as unknown as Array<ErrorReportResponseDto>;

    return new ResponseBuilder<PagingResponse>({
      items: items,
      meta: { total: count, page: page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async update(
    request: UpdateErrorReportRequestDto,
  ): Promise<ResponsePayload<any>> {
    try {
      const errorReport = await this.errorReportRepository.findOneById(
        request.id,
      );

      if (!errorReport) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }

      const result = await this.errorReportRepository.updateErrorReport(
        request,
        errorReport,
      );

      return new ResponseBuilder()
        .withData(
          plainToClass(ErrorReportResponseDto, result, {
            excludeExtraneousValues: true,
          }),
        )
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    } catch (e) {
      throw e;
    }
  }

  public async delete(id: number): Promise<ResponsePayload<any>> {
    const errorReport = await this.errorReportRepository.findOneByCondition({
      id: id,
      deletedAt: null,
    });

    if (!errorReport) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    try {
      await this.errorReportRepository.softDelete(id);
      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(ErrorMessageEnum.CAN_NOT_DELETE)
        .build();
    }
  }

  public async getListErrorReportByCommandItemWarehouse(
    request: ErrorReportByCommandItemWarehouseRequestDto,
  ): Promise<any> {
    const { qcStageId, commandId, itemId, warehouseId } = request;

    const errorReports = await this.errorReportRepository.findWithRelations({
      join: {
        alias: 'e',
        innerJoin: { erid: 'e.errorReportIoqcDetail' },
      },
      where: (er) => {
        er.where({
          qcStageId: qcStageId,
          status: ErrorReportStatus.Confirmed,
        })
          .andWhere('erid.orderId = :orderId', { orderId: commandId })
          .andWhere('erid.itemId = :itemId', { itemId: itemId })
          .andWhere('erid.warehouseId = :warehouseId', {
            warehouseId: warehouseId,
          });
      },
    });

    const result = plainToClass(
      ErrorReportOnlyIdAndNameResponseDto,
      errorReports,
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }

  public async showCreateForm(transactionHistoryId: number): Promise<any> {
    const transactionHistory =
      await this.transactionHistoryRepository.getDataQCDetailShowCreateForm(
        transactionHistoryId,
      );
    if (!transactionHistory) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.TRANSACTION_HISTORY_NOT_FOUND'),
        )
        .build();
    }
    const errorGroups =
      await this.errorGroupService.getListByTransactionHistoryId(
        transactionHistoryId,
      );
    const causeGroupResponse = await this.causeGroupService.getAll();
    const receivedUsers = await this.userService.getList();
    const receivedUserResponseDto = plainToClass(
      ShowCreateErrorReportReceivedUsersResponseDto,
      receivedUsers.items,
      { excludeExtraneousValues: true },
    );
    const errorGroupsResponseDto = plainToClass(
      ShowCreateErrorReportErrorGroupResponseDto,
      errorGroups,
      {
        excludeExtraneousValues: true,
      },
    );
    const causeGroupResponseDto = plainToClass(
      ShowCreateErrorReportCauseGroupResponseDto,
      causeGroupResponse.data,
      {
        excludeExtraneousValues: true,
      },
    );
    const result = plainToClass(
      ShowCreateErrorReportResponseDto,
      {
        errorGroups: errorGroupsResponseDto,
        receivedUsers: receivedUserResponseDto,
        causeGroups: causeGroupResponseDto,
        type: transactionHistory.type,
        itemType: transactionHistory.itemType,
        itemId: transactionHistory.itemId,
      },
      { excludeExtraneousValues: true },
    );
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }

  public async createProduceStepsErrorReport(
    request: CreateErrorReportRequestDto,
  ): Promise<any> {
    const workOrder = await this.produceService.getWorkOrderById(
      request.orderId,
    );
    if (!workOrder) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.WORK_ORDER_NOT_FOUND'),
      ).toResponse();
    }

    // get transaction history entity
    const transactionHistory =
      await this.transactionHistoryRepository.getProducingStepsQCDetail(
        request.transactionHistoryId,
      );
    if (!transactionHistory) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.TRANSACTION_HISTORY_NOT_FOUND'),
        )
        .build();
    }
    // get logTimeEntity by transaction history id
    const logTimeEntity =
      await this.transactionHistoryService.getLogTimeEntityByTransactionHistoryId(
        request.transactionHistoryId,
      );
    if (isEmpty(logTimeEntity)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.LOG_TIME_NOT_FOUND'))
        .build();
    }

    // Get qcStageId for stage QC
    const qcStageId = request.qcStageId;
    const reportType = QCType.StageQC;
    let itemId;

    switch (request.qcStageId) {
      case TransactionHistoryTypeEnum.InputProducingStep:
        itemId = request.itemId;
        break;
      case TransactionHistoryTypeEnum.OutputProducingStep:
        itemId = workOrder.bom?.item?.id;
        break;
      default:
        itemId = workOrder.bom?.item?.id;
        break;
    }

    try {
      const errorReport =
        await this.errorReportRepository.createProduceStepsErrorReport(
          request,
          workOrder,
          qcStageId,
          itemId,
          reportType,
        );
      // Return response
      const response = plainToClass(
        CreateErrorReportResponseDto,
        { ...errorReport, logTimeId: logTimeEntity.id },
        {
          excludeExtraneousValues: true,
        },
      );
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData(response)
        .build();
    } catch (error) {
      throw error;
    }
  }

  public async getDetailByWO(workOrderId: number): Promise<any> {
    const response = new GetErrorReportDetailByWoResponseDto();
    const errorReportResponse = await this.errorReportRepository.getDetailByWO(
      workOrderId,
    );
    if (isEmpty(errorReportResponse)) {
      new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.ERROR_REPORT_NOT_FOUND'))
        .build();
    }
    response.errorReports = errorReportResponse;
    const actionCategoryResponse =
      await this.actionCategoryService.getListAll();
    response.actionCategories = actionCategoryResponse.data;
    const result = plainToClass(GetErrorReportDetailByWoResponseDto, response, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .withData(result)
      .build();
  }

  public async updateErrorReportAfterRepair(
    request: UpdateErrorReportsAfterRepairRequestDto,
  ): Promise<any> {
    const response = {
      errorReports: [],
    };
    const errReportList = request.errorReports;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      // Update list of Error reports
      for (const errReport of errReportList) {
        const errReportDetailIds = [];
        const updatedErrReportDetails = {};
        let isErrReportCompleted = true;
        // get List of errReportDetail Ids
        errReport.errorRepairDetails.forEach((errReportDetail) => {
          errReportDetailIds.push(errReportDetail.errorReportDetailsId);
          updatedErrReportDetails[errReportDetail.errorReportDetailsId] =
            errReportDetail;
        });
        // Get list of ErrorReportErrorDetail entities
        const errReportDetailEntities =
          await this.errorReportErrorDetailRepository.findByCondition({
            id: In(errReportDetailIds),
          });
        if (isEmpty(errReportDetailEntities)) {
          await queryRunner.rollbackTransaction();
          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.BAD_REQUEST)
            .withMessage(
              await this.i18n.translate('error.ERROR_REPORT_DETAILS_NOT_FOUND'),
            )
            .build();
        }
        // Get error report entity
        const errReportEntity = await this.errorReportRepository.findOneById(
          errReport.id,
        );
        if (!errReportEntity) {
          await queryRunner.rollbackTransaction();
          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.BAD_REQUEST)
            .withMessage(
              await this.i18n.translate('error.ERROR_REPORT_NOT_FOUND'),
            )
            .build();
        }
        // Update repairItemQuantity field of ErrorReportErrorDetail table
        for (const item of errReportDetailEntities) {
          const repairItemQuantity =
            updatedErrReportDetails[item.id].repairItemQuantity;
          // if errorItemQuantity < repairItemQuantity then return Error
          if (item.errorItemQuantity < repairItemQuantity) {
            await queryRunner.rollbackTransaction();
            return new ResponseBuilder()
              .withCode(ResponseCodeEnum.BAD_REQUEST)
              .withMessage(
                await this.i18n.translate('error.REPAIR_QUANTITY_INVALID'),
              )
              .build();
          }
          item.repairItemQuantity = repairItemQuantity;
          item.actionCategoryId =
            updatedErrReportDetails[item.id].actionCategoryId;
          if (item.errorItemQuantity !== item.repairItemQuantity) {
            isErrReportCompleted = false;
          }
        }
        // if all error report detail items have errorItemQuantity = repairItemQuantity then update error report status to completed
        if (isErrReportCompleted) {
          errReportEntity.status = ErrorReportStatus.Completed;
          await queryRunner.manager.save(errReportEntity);
        }
        await queryRunner.manager.save(errReportDetailEntities);
        // mapping response
        response.errorReports.push({
          ...errReportEntity,
          errorRepairDetails: errReportDetailEntities.map((item) => {
            return {
              errorReportDetailsId: item.id,
              repairItemQuantity: item.repairItemQuantity,
              actionCategoryId: item.actionCategoryId,
            };
          }),
        });
      }
      // return result
      const result = plainToClass(
        UpdateErrorReportsAfterRepairResponseDto,
        response,
        { excludeExtraneousValues: true },
      );
      await queryRunner.commitTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .withData(result)
        .build();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.CANNOT_UPDATE_ERROR_REPORT'),
        )
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  public async getStageListForApp(
    request: ErrorReportListRequestDto,
  ): Promise<any> {
    // get list QC from produce-service
    const { keyword, filter } = request;
    let moFilter = [];
    let woFilterKwIds = [];
    let itemFilterKwIds = [];
    if (!isEmpty(filter)) {
      moFilter = filter.filter((x) => x.column === WorkOrderFilterColumn.MO_ID);
    }
    const woFiltersMo = await this.produceService.getWorkOrderByMoId(moFilter);
    if (isEmpty(woFiltersMo)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.WORK_ORDER_NOT_FOUND'))
        .build();
    }
    const woFilterMoIds = !isEmpty(woFiltersMo)
      ? woFiltersMo.map((e) => e.id)
      : [];
    if (keyword) {
      const woFiltersKw = await this.produceService.getWorkOrderByKw(keyword);
      woFilterKwIds = !isEmpty(woFiltersKw) ? woFiltersKw.map((e) => e.id) : [];
      const itemFilterKw = await this.itemService.getItemByConditions({
        isGetAll: '1',
        filter: [
          {
            column: 'name',
            text: keyword.trim(),
          },
        ],
      });
      itemFilterKwIds = !isEmpty(itemFilterKw)
        ? itemFilterKw.map((e) => e.id)
        : [];
    }
    const { result, total } =
      await this.errorReportRepository.getStageListForApp(
        request,
        woFilterMoIds,
        woFilterKwIds,
        itemFilterKwIds,
      );
    if (isEmpty(result)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.ERROR_REPORT_NOT_FOUND'))
        .build();
    }
    const workOrdersRaw = {};
    const itemIdList = [];
    const itemRaws = {};
    woFiltersMo.forEach((wo) => {
      workOrdersRaw[wo.id] = wo;
    });

    result.forEach((item) => {
      // map workOrder to QC history
      item.workOrder = workOrdersRaw[item.workOrderId];
      if (!itemIdList.includes(item.itemId) && item.itemId) {
        itemIdList.push(item.itemId);
      }
    });
    // map result with item if type is input produce step QC
    const itemList = await this.itemService.getListByIDs(itemIdList);
    if (!isEmpty(itemList)) {
      itemList.forEach((item) => {
        itemRaws[item.id] = item;
        if (!itemIdList.includes(item.itemId) && item.itemId) {
          itemIdList.push(item.itemId);
        }
      });
    }
    result.forEach((item) => {
      if (item.qcStageId == TransactionHistoryTypeEnum.InputProducingStep) {
        const itemType = item.itemType
          ? parseInt(item.itemType)
          : item.itemType;
        switch (itemType) {
          case TransactionHistoryItemTypeEnum.Materials:
            item.materialItem = itemRaws[item.itemId];
            break;
          case TransactionHistoryItemTypeEnum.PreviousBom:
            item.previousBomItem = itemRaws[item.itemId];
            break;
          default:
            break;
        }
      }
    });

    const response = plainToClass(ErrorReportResponseForAppDto, result, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder<PagingResponse>({
      items: response,
      meta: {
        total: total,
        page: request.page,
      },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async getStageDetailForApp(id: number): Promise<any> {
    const result = await this.errorReportRepository.getStageDetailForApp(id);
    if (!result) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.ERROR_REPORT_NOT_FOUND'))
        .build();
    }
    const workOrder = await this.produceService.getWorkOrderById(
      result.workOrderId,
    );
    if (!workOrder) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.WORK_ORDER_NOT_FOUND'))
        .build();
    }
    result.workCenters = workOrder.workCenters?.filter(
      (x) => x.id == result.workCenterId,
    );
    result.workOrder = workOrder;
    const pic = await this.userService.getUserByID(result.assignedTo);
    if (!pic) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.USER_NOT_FOUND'))
        .build();
    }
    result.receivedByUser = pic;
    // map result with item if type is input produce step QC
    const itemType = result.itemType
      ? parseInt(result.itemType)
      : result.itemType;
    const qcStageId = result.qcStageId
      ? parseInt(result.qcStageId)
      : result.qcStageId;
    let item;
    if (result.itemId) {
      item = await this.itemService.getItemById(result.itemId);
    }
    if (qcStageId == TransactionHistoryTypeEnum.InputProducingStep) {
      switch (itemType) {
        case TransactionHistoryItemTypeEnum.PreviousBom:
          result.previousBomItem = item;
          break;
        case TransactionHistoryItemTypeEnum.Materials:
          result.materialItem = item;
          break;
        default:
          break;
      }
    }

    // QC x lần
    // Tiêu chí
    const qualityPoint = await this.qualityPointRepository.findOneById(
      result?.qualityPointId,
    );
    if (!qualityPoint) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.QUALITY_POINT_NOT_FOUND'))
        .build();
    }

    result.numberOfTime =
      qualityPoint.numberOfTime == NumberOfTime.TwoTimes ? 2 : 1;

    result.numberOfTimeQc = result?.numberOfTimeQc
      ? Number(result?.numberOfTimeQc)
      : null;

    const response = plainToClass(
      ErrorReportStageDetailForAppResponseDto,
      result,
      { excludeExtraneousValues: true },
    );
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async createIoqcErrorReport(
    request: CreateErrorReportIOqcRequestDto,
    stage: number,
    reportType: number,
  ): Promise<any> {
    let order;
    const { qcCriteriaId, orderId } = request;

    const transactionHistory = await this.transactionHistoryService.detail(
      request.transactionHistoryId,
    );

    if (!transactionHistory) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.TRANSACTION_NOT_FOUND'),
      ).toResponse();
    }
    if (transactionHistory && parseInt(transactionHistory.type) !== stage) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate(
          'error.TRANSACTION_DIFFERENT_TYPE_ERROR_REPORT',
        ),
      ).toResponse();
    }

    if (transactionHistory && transactionHistory.errorReport !== null) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.TRANSACTION_EXIST_ERROR_REPORT'),
      ).toResponse();
    }

    switch (stage) {
      case STAGES_OPTION.PO_IMPORT:
        order = await this.saleService.getPurchasedOrderById(orderId);
        break;
      case STAGES_OPTION.SO_EXPORT:
        order = await this.saleService.getSaleOrderExportById(orderId);
        break;
      case STAGES_OPTION.PRO_IMPORT:
        order = await this.saleService.getProductionOrderById(orderId);
        break;
      case STAGES_OPTION.PRO_EXPORT:
        order = await this.saleService.getProductionOrderById(orderId);
        break;
    }
    if (!order) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.ORDER_NOT_FOUND'),
      ).toResponse();
    }

    if (order && stage === STAGES_OPTION.PRO_IMPORT) {
      if (order.type !== 0) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.ORDER_INPUT_NOT_FOUND'),
        ).toResponse();
      }
    } else if (order && stage === STAGES_OPTION.PRO_EXPORT) {
      if (order.type !== 1) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.ORDER_OUTPUT_NOT_FOUND'),
        ).toResponse();
      }
    }

    const qualityPoint = await this.qualityPointService.getDetail(qcCriteriaId);

    if (!qualityPoint) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.QUALITY_POINT_NOT_FOUND'),
      ).toResponse();
    }

    if (qualityPoint && qualityPoint.data?.stage !== stage) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.TYPE_STAGE_ERROR'),
      ).toResponse();
    }

    const qcStageId = stage;

    try {
      const errorReport =
        await this.errorReportRepository.createIoqcErrorReport(
          request,
          qcStageId,
          reportType,
        );

      // Return response
      const response = plainToClass(CreateErrorReportResponseDto, errorReport, {
        excludeExtraneousValues: true,
      });

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData(response)
        .build();
    } catch (error) {
      throw error;
    }
  }

  // Danh sách phiếu báo cáo lỗi app đầu vào + đầu ra
  public async getListErrorReportIOqcForApp(
    request: ErrorReportListIOForAppRequestDto,
  ): Promise<ResponsePayload<PagingResponse>> {
    const { type, filter, keyword, user } = request;

    // SO PRO PO
    let filterOrderIds = [];
    const orderCodeFilter = filter?.find((item) => item.column == 'code');

    let poFilterIds = [],
      proFilterIds = [],
      soFilterIds = [];
    if (orderCodeFilter) {
      const paramSearch = orderCodeFilter.text.trim();
      const typeSearch = Number(paramSearch.split('_')[0]);
      const textSearch = paramSearch.split('_')[1];

      const params = {
        isGetAll: '1',
        user: user,
        filter: [
          {
            column: 'code',
            text: textSearch,
          },
        ],
      };

      let dataPos, dataPros, dataSos;
      if (type == OrderTypeProductionOrderEnum.Input) {
        if (typeSearch == STAGES_OPTION.PO_IMPORT) {
          dataPos = await this.saleService.getPurchasedOrderByConditions(
            params,
          );

          if (isEmpty(dataPos)) {
            return new ResponseBuilder<PagingResponse>({
              items: [],
              meta: { total: 0, page: 0 },
            })
              .withCode(ResponseCodeEnum.SUCCESS)
              .build();
          }

          if (!isEmpty(dataPos)) {
            poFilterIds = dataPos.map((po) => po.id);
          }
        }

        if (typeSearch == STAGES_OPTION.PRO_IMPORT) {
          params.filter.push({
            column: 'type',
            text: '0',
          });

          dataPros = await this.saleService.getProductionOrderByConditions(
            params,
          );

          if (isEmpty(dataPros)) {
            return new ResponseBuilder<PagingResponse>({
              items: [],
              meta: { total: 0, page: 0 },
            })
              .withCode(ResponseCodeEnum.SUCCESS)
              .build();
          }

          if (!isEmpty(dataPros)) {
            proFilterIds = dataPros.map((pro) => pro.id);
          }
        }
      }

      if (type == OrderTypeProductionOrderEnum.Output) {
        if (typeSearch == STAGES_OPTION.SO_EXPORT) {
          dataSos = await this.saleService.getSaleOrderExportByConditions(
            params,
          );

          if (isEmpty(dataSos)) {
            return new ResponseBuilder<PagingResponse>({
              items: [],
              meta: { total: 0, page: 0 },
            })
              .withCode(ResponseCodeEnum.SUCCESS)
              .build();
          }

          if (!isEmpty(dataSos)) {
            soFilterIds = dataSos.map((so) => so.id);
          }
        }

        if (typeSearch == STAGES_OPTION.PRO_EXPORT) {
          params.filter.push({
            column: 'type',
            text: '1',
          });

          dataPros = await this.saleService.getProductionOrderByConditions(
            params,
          );

          if (isEmpty(dataPros)) {
            return new ResponseBuilder<PagingResponse>({
              items: [],
              meta: { total: 0, page: 0 },
            })
              .withCode(ResponseCodeEnum.SUCCESS)
              .build();
          }

          if (!isEmpty(dataPros)) {
            proFilterIds = dataPros.map((pro) => pro.id);
          }
        }
      }
    }

    filterOrderIds = uniq(poFilterIds.concat(proFilterIds, soFilterIds));

    // SEARCH KEYWORD ORDER ITEM CODE-ERROR-REPORT
    let keywordItemIds = [];
    let keywordOrderIds = [],
      filterPoIds = [],
      filterProIds = [],
      filterSoIds = [];

    if (keyword) {
      // ORDER
      const params = {
        isGetAll: '1',
        user: request.user,
        filter: [
          {
            column: 'code',
            text: keyword.trim(),
          },
        ],
      };

      let dataPos, dataPros, dataSos;

      if (type == TypeReport.INPUT) {
        dataPos = await this.saleService.getPurchasedOrderByConditions(params);

        params.filter.push({
          column: 'type',
          text: '0',
        });

        dataPros = await this.saleService.getProductionOrderByConditions(
          params,
        );

        if (!isEmpty(dataPos)) {
          filterPoIds = dataPos.map((po) => po.id);
        }

        if (!isEmpty(dataPros)) {
          filterProIds = dataPros.map((pro) => pro.id);
        }
      }

      if (type == TypeReport.OUTPUT) {
        dataSos = await this.saleService.getSaleOrderExportByConditions(params);

        params.filter.push({
          column: 'type',
          text: '1',
        });

        dataPros = await this.saleService.getProductionOrderByConditions(
          params,
        );

        if (!isEmpty(dataSos)) {
          filterSoIds = dataSos.map((so) => so.id);
        }

        if (!isEmpty(dataPros)) {
          filterProIds = dataPros.map((pro) => pro.id);
        }
      }

      // ITEM NAME
      const paramItemFilter = {
        isGetAll: '1',
        user: request.user,
        filter: [
          {
            column: 'name',
            text: keyword.trim(),
          },
        ],
      };

      const dataFilterItems = await this.itemService.getItemByConditions(
        paramItemFilter,
      );

      if (!isEmpty(dataFilterItems)) {
        keywordItemIds = dataFilterItems.map((item) => item.id);
      }
    }

    keywordOrderIds = uniq(filterPoIds.concat(filterProIds, filterSoIds));

    // Map Order id filter And keyword
    let filteredArrayOrderIds = [];
    if (!isEmpty(keywordOrderIds) && !isEmpty(filterOrderIds)) {
      filteredArrayOrderIds = keywordOrderIds.filter((x) =>
        filterOrderIds.includes(x),
      );

      if (isEmpty(filteredArrayOrderIds)) {
        return new ResponseBuilder<PagingResponse>({
          items: [],
          meta: { total: 0, page: 0 },
        })
          .withCode(ResponseCodeEnum.SUCCESS)
          .build();
      }
    }

    // Query trong db
    const { result, total } =
      await this.errorReportRepository.getListErrorReportInputForApp(
        request,
        keywordOrderIds,
        keywordItemIds,
        filterOrderIds,
        filteredArrayOrderIds,
      );

    // Map Id sang text
    const itemIds = uniq(
      result.map((er) => er.errorReportIoqcDetail[0]?.itemId),
    );
    const itemIdArs = itemIds.filter((i) => Number.isInteger(i)) as Array<any>;
    const items = await this.itemService.getListByIDs(itemIdArs);

    // PO
    const poIds = uniq(
      result.map((er) => {
        if (er.qcStageId === STAGES_OPTION.PO_IMPORT)
          return er.errorReportIoqcDetail[0]?.orderId;
      }),
    );
    const poIdArs = poIds.filter((po) => Number.isInteger(po)) as Array<any>;

    //PrO
    const proIds = uniq(
      result.map((er) => {
        if (
          er.qcStageId === STAGES_OPTION.PRO_IMPORT ||
          er.qcStageId === STAGES_OPTION.PRO_EXPORT
        )
          return er.errorReportIoqcDetail[0]?.orderId;
      }),
    );
    const proIdArs = proIds.filter((pro) =>
      Number.isInteger(pro),
    ) as Array<any>;

    //SO
    const soIds = uniq(
      result.map((er) => {
        if (er.qcStageId === STAGES_OPTION.SO_EXPORT)
          return er.errorReportIoqcDetail[0]?.orderId;
      }),
    );
    const soIdArs = soIds.filter((so) => Number.isInteger(so)) as Array<any>;

    let pos, pros, sos, order, codeOrder;
    if (type === OrderTypeProductionOrderEnum.Input) {
      pos = await this.saleService.getPurchasedOrderByIds(poIdArs);
      pros = await this.saleService.getProductionOrderByIds(proIdArs);
    } else if (type === OrderTypeProductionOrderEnum.Output) {
      pros = await this.saleService.getProductionOrderByIds(proIdArs);
      sos = await this.saleService.getSaleOrderExportByIds(soIdArs);
    }

    const resultData = result.reduce((x, y) => {
      const item = items
        ? items.filter((i) => i.id === y.errorReportIoqcDetail[0]?.itemId)
        : [];
      const nameItem = item && item[0] ? item[0].name : '';
      const codeItem = item && item[0] ? item[0].code : '';

      if (y.qcStageId === STAGES_OPTION.PO_IMPORT) {
        order = !isNil(pos)
          ? pos.filter((po) => po.id === y.errorReportIoqcDetail[0]?.orderId)
          : [];
      } else if (
        y.qcStageId === STAGES_OPTION.PRO_IMPORT ||
        y.qcStageId === STAGES_OPTION.PRO_EXPORT
      ) {
        order = !isNil(pros)
          ? pros.filter((pro) => pro.id === y.errorReportIoqcDetail[0]?.orderId)
          : [];
      } else if (y.qcStageId === STAGES_OPTION.SO_EXPORT) {
        order = sos.filter(
          (so) => so.id === y.errorReportIoqcDetail[0]?.orderId,
        );
      }

      codeOrder = order && order[0] ? order[0].code : '';
      x.push({
        id: y.id,
        codeErrorReport: y.code,
        codeOrder: codeOrder,
        codeItem: codeItem,
        nameItem: nameItem,
        status: y.status,
        createdAt: y.createdAt,
      });
      return x;
    }, []);

    const response = plainToClass(ErrorReportIOForAppResponseDto, resultData, {
      excludeExtraneousValues: true,
    }) as unknown as Array<ErrorReportIOForAppResponseDto>;

    return new ResponseBuilder<PagingResponse>({
      items: response,
      meta: { total: total, page: request.page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async rejectErrorReport(
    request: RejectErrorReportRequestDto,
  ): Promise<any> {
    const errorReport = await this.errorReportRepository.findOneByCondition({
      id: request.id,
      status: ErrorReportStatus.Awaiting,
    });
    if (!errorReport) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate(
            'error.ERROR_REPORT_AWAIT_STATUS_NOT_FOUND',
          ),
        )
        .build();
    }
    // Update ER status to Rejected
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      errorReport.status = ErrorReportStatus.Rejected;
      errorReport.rejectedBy = request.rejectBy;
      errorReport.rejectedAt = new Date();
      await queryRunner.manager.save(errorReport);
      await queryRunner.commitTransaction();
      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.CANNOT_UPDATE_ERROR_REPORT'),
        )
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  public async getDetailErrorReportIOqcForApp(
    id: number,
  ): Promise<ResponsePayload<any>> {
    const result = await this.errorReportRepository.findOneById(id);
    if (!result) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.ERROR_REPORT_NOT_FOUND'))
        .build();
    }
    const detail = await this.errorReportRepository.getDetail(result);

    const transactionHistory =
      await this.transactionHistoryRepository.getTransactionQcDetail(
        detail?.transactionHistoryId,
      );

    if (!transactionHistory) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.TRANSACTION_HISTORY_NOT_FOUND'),
        )
        .build();
    }

    // Tiêu chí
    const qualityPoint = await this.qualityPointRepository.findOneById(
      transactionHistory?.qualityPointId,
    );
    if (!qualityPoint) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.QUALITY_POINT_NOT_FOUND'))
        .build();
    }

    // Hình thức QC
    const formality = QUALITY_POINT_FORMALITY.filter(
      (x) => x.value == qualityPoint.formality,
    ).map((y) => y.text)[0];

    const receiverUser = detail?.errorReportIoqcDetail?.errorReportErrorList
      .assignedTo
      ? detail.errorReportIoqcDetail.errorReportErrorList.assignedTo
      : null;

    const userMap = await this.userService.getUserMapByIds([
      result.createdBy,
      receiverUser,
    ]);

    const [
      itemName,
      customerName, // khách hàng hoặc nhà cung cấp
      orderCode,
      warehouseName,
      deliveredAt,
      itemCode,
    ] = await this.saleService.getSaleErrorReportIoqcDetail(
      result.errorReportIoqcDetail,
      result.qcStageId,
    );

    let res = new DetailErrorReportResponseDto();
    res = {
      id: result.id.toString(),
      status: result.status,
      orderCode: orderCode ? orderCode : '',
      formality: formality,
      consignmentName: transactionHistory?.consignmentName,
      datetimeCreate: result ? result.createdAt : null,
      repairDeadline: detail?.errorReportIoqcDetail?.errorReportErrorList
        ? detail.errorReportIoqcDetail.errorReportErrorList.repairDeadline
        : null,
      codeErrorReport: result ? result.code : '',
      productCode: itemCode ? itemCode : '',
      productName: itemName ? itemName : '',
      wareHouseName: warehouseName ? warehouseName : '',
      customerOrvendor: customerName ? customerName : '',
      userCreate: userMap?.get(result.createdBy)
        ? userMap.get(result.createdBy)
        : '',
      detail: {
        code: result.code,
        name: result.name,
        receiverUser: userMap.get(receiverUser),
        priority: detail.errorReportIoqcDetail?.errorReportErrorList.priority,
        description:
          detail.errorReportIoqcDetail?.errorReportErrorList.errorDescription,
        errorReportErrorDetails:
          detail.errorReportIoqcDetail?.errorReportErrorList.errorReportErrorDetails.map(
            (e) => {
              return {
                id: e.id,
                errorGroup: {
                  id: e.errorGroupId,
                  name: e.errorGroup.name,
                },
                causeGroup: {
                  id: e.causeGroupId,
                  name: e.causeGroup ? e.causeGroup.name : '',
                },
                errorItemQuantity: e.errorItemQuantity
                  ? e.errorItemQuantity
                  : 0,
                repairItemQuantity: e.repairItemQuantity
                  ? e.repairItemQuantity
                  : 0,
              };
            },
          ),
      },
      numberOfTime: qualityPoint.numberOfTime == NumberOfTime.TwoTimes ? 2 : 1,
      numberOfTimeQc: transactionHistory?.numberOfTimeQc
        ? Number(transactionHistory?.numberOfTimeQc)
        : null,
    };

    return new ResponseBuilder<DetailErrorReportResponseDto>(res)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async confirmProduceStepErrorReport(
    request: ConfirmProduceStepErrorReportRequestDto,
  ): Promise<ResponsePayload<any>> {
    const errorReport = await this.errorReportRepository.findOneByCondition({
      id: request.id,
      status: ErrorReportStatus.Awaiting,
    });
    if (!errorReport) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate(
            'error.ERROR_REPORT_AWAIT_STATUS_NOT_FOUND',
          ),
        )
        .build();
    }
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      // UPDATE ERROR REPORT
      errorReport.confirmedBy = request.confirmedBy;
      errorReport.confirmedAt = new Date();
      errorReport.status = ErrorReportStatus.Confirmed;
      await queryRunner.manager.save(errorReport);
      const transactionHistoryId = errorReport.transactionHistoryId;

      // Update MESx QC Quantity after confirmed Error Report
      const transactionHistory = await this.transactionHistoryService.detail(
        transactionHistoryId,
      );
      if (!transactionHistory) {
        await queryRunner.rollbackTransaction();
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.TRANSACTION_HISTORY_NOT_FOUND'),
        ).toResponse();
      }

      let updateWoQCResult;
      const qcStageId = transactionHistory.type
        ? parseInt(transactionHistory.type)
        : transactionHistory.type;
      const itemType = transactionHistory.itemType
        ? parseInt(transactionHistory.itemType)
        : transactionHistory.itemType;

      switch (qcStageId) {
        case TransactionHistoryTypeEnum.OutputProducingStep:
          // UPDATE WC FAIL
          updateWoQCResult =
            await this.transactionHistoryService.updateWoQcQuantity(
              transactionHistory,
            );

          if (updateWoQCResult.statusCode !== ResponseCodeEnum.SUCCESS) {
            await queryRunner.rollbackTransaction();
            return new ApiError(
              ResponseCodeEnum.BAD_REQUEST,
              updateWoQCResult.message,
            ).toResponse();
          }

          // UPDATE WC PLAN QC
          const updatedWorkCenterPlanQcShift =
            await this.workCenterPlanQcShiftService.updateWcPlanQc(
              transactionHistory,
            );

          if (isEmpty(updatedWorkCenterPlanQcShift)) {
            return new ApiError(
              ResponseCodeEnum.BAD_REQUEST,
              await this.i18n.translate(
                'error.CANNOT_UPDATE_WORK_CENTER_PLAN_QC_SHIFT',
              ),
            ).toResponse();
          }
          await queryRunner.manager.save(updatedWorkCenterPlanQcShift);

          // UPDATE STATUS PLAN InProgress
          const workOrderId = transactionHistory?.orderId;
          if (!workOrderId) {
            return new ApiError(
              ResponseCodeEnum.BAD_REQUEST,
              await this.i18n.translate('error.UPDATE_STATUS_PLAN_FAIL'),
            ).toResponse();
          }

          const qualityPlan =
            await this.qualityPlanRepository.findOneByCondition({
              join: {
                alias: 'qp',
                innerJoin: {
                  qpdt: 'qp.qualityPlanDetail',
                  qpb: 'qpdt.qualityPlanBoms',
                },
              },
              where: (er) => {
                er.where('qpb.workOrderId = :workOrderId', {
                  workOrderId: workOrderId,
                });
              },
            });

          if (!qualityPlan) {
            return new ApiError(
              ResponseCodeEnum.BAD_REQUEST,
              await this.i18n.translate('error.UPDATE_STATUS_PLAN_FAIL'),
            ).toResponse();
          }

          if (qualityPlan?.status == QCPlanStatus?.Confirmed) {
            qualityPlan.status = QCPlanStatus?.InProgress;
            await queryRunner.manager.save(qualityPlan);
          }

          // UPDATE STATUS PLAN Completed
          const isUpdate = await this.updateStatusQualityPlanForCompleted(
            qualityPlan?.id,
          );
          if (isUpdate?.statusCode == ResponseCodeEnum.BAD_REQUEST) {
            return new ApiError(
              ResponseCodeEnum.BAD_REQUEST,
              await this.i18n.translate('error.UPDATE_STATUS_PLAN_FAIL'),
            ).toResponse();
          }

          if (isUpdate) {
            qualityPlan.status = QCPlanStatus?.Completed;
            await queryRunner.manager.save(qualityPlan);
          }

          break;
        case TransactionHistoryTypeEnum.InputProducingStep:
          //TODO: update WoQcQuantity for QC input produce step materials or previous BOM
          if (itemType == TransactionHistoryItemTypeEnum.Materials) {
            // send qc quantity to material update API
            updateWoQCResult =
              await this.transactionHistoryService.updateWoMaterialQcQuantity(
                transactionHistory,
              );
          } else if (itemType == TransactionHistoryItemTypeEnum.PreviousBom) {
            // send qc quantity to previous bom update API
            updateWoQCResult =
              await this.transactionHistoryService.updateWoPreviousBomQcQuantity(
                {
                  ...transactionHistory,
                  id: transactionHistory.previousBomId,
                },
              );
          }
          break;
        default:
          break;
      }

      // if update WC
      if (updateWoQCResult.statusCode !== ResponseCodeEnum.SUCCESS) {
        await queryRunner.rollbackTransaction();
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          updateWoQCResult.message,
        ).toResponse();
      }

      await queryRunner.commitTransaction();
      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.CANNOT_UPDATE_ERROR_REPORT'),
        )
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  public async updateStatusQualityPlanForCompleted(id: number): Promise<any> {
    const qualityPlanForCompletedResponse =
      await this.qualityPlanService.getDetail(id);
    if (
      qualityPlanForCompletedResponse.statusCode != ResponseCodeEnum.SUCCESS
    ) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.UPDATE_STATUS_PLAN_FAIL'),
      ).toResponse();
    }
    const qualityPlanForCompleted = qualityPlanForCompletedResponse?.data;
    const planBoms = qualityPlanForCompleted?.planBoms;
    if (isEmpty(planBoms)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.UPDATE_STATUS_PLAN_FAIL'),
      ).toResponse();
    }

    return await this.loopPlanBom(planBoms);
  }

  private async loopPlanBom(planBoms: any) {
    let isUpdate = true;
    for (let i = 0; i < planBoms.length; i++) {
      const planBom = planBoms[i];
      const planbomSub = planBom?.planBom;
      const producingStepList = planbomSub?.producingStep;

      for (let j = 0; j < producingStepList.length; j++) {
        const producingStep = producingStepList[j];
        const producingStepDetail = producingStep?.producingStep;
        const planQcQuantity =
          producingStepDetail?.qualityPlanBom?.planQcQuantity;
        const doneQCQuantity = producingStepDetail?.doneQCQuantity;
        if (
          planQcQuantity != undefined &&
          doneQCQuantity != undefined &&
          doneQCQuantity < planQcQuantity
        ) {
          isUpdate = false;
          break;
        }
      }

      if (isUpdate == false) break;

      const subBom = planBom?.subBom;
      if (!isEmpty(subBom)) {
        isUpdate = await this.loopPlanBom(subBom);
      }

      if (isUpdate == false) break;
    }

    return isUpdate;
  }

  public async confirmIOqcErrorReport(
    request: ConfirmIOqcErrorReportRequestDto,
  ): Promise<ResponsePayload<any>> {
    const errorReport = await this.errorReportRepository.findOneByCondition({
      id: request.id,
      status: ErrorReportStatus.Awaiting,
    });
    if (!errorReport) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate(
            'error.ERROR_REPORT_AWAIT_STATUS_NOT_FOUND',
          ),
        )
        .build();
    }
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      // confirm Error report
      errorReport.confirmedBy = request.confirmedBy;
      errorReport.confirmedAt = new Date();
      errorReport.status = ErrorReportStatus.Confirmed;
      await queryRunner.manager.save(errorReport);

      // Update MESx QC Quantity after confirmed Error Report
      const transactionHistoryId = errorReport.transactionHistoryId;
      const transactionHistory = await this.transactionHistoryService.detail(
        transactionHistoryId,
      );

      if (!transactionHistory) {
        await queryRunner.rollbackTransaction();
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.TRANSACTION_HISTORY_NOT_FOUND'),
        ).toResponse();
      }

      // Update kế hoạch QC QMSX
      const requestUpdateQualityPlanIOqc: UpdateQualityPlanIOqcByConfirmErrorReportRequestDto =
        {
          type: transactionHistory.type,
          orderId: transactionHistory.orderId,
          warehouseId: transactionHistory.warehouseId,
          itemId: transactionHistory.itemId,
          qcRejectQuantity: transactionHistory.qcRejectQuantity,
          qcPassQuantity: transactionHistory.qcPassQuantity,
        };

      const updateQualityPlanIOqc =
        await this.qualityPlanIOqcRepository.updateQualityPlanIOqc(
          requestUpdateQualityPlanIOqc,
        );

      if (!updateQualityPlanIOqc) {
        await queryRunner.rollbackTransaction();
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.CANNOT_UPDATE_IO_QC'),
        ).toResponse();
      }
      await queryRunner.manager.save(updateQualityPlanIOqc);

      // UPDATE STATUS PLAN InProgress
      const orderId = transactionHistory?.orderId;
      if (!orderId) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.UPDATE_STATUS_PLAN_FAIL'),
        ).toResponse();
      }

      const qualityPlan = await this.qualityPlanRepository.findOneByCondition({
        join: {
          alias: 'qp',
          innerJoin: {
            qpio: 'qp.qualityPlanIOqcs',
          },
        },
        where: (er) => {
          er.where('qpio.orderId = :orderId', { orderId: orderId });
        },
      });

      if (!qualityPlan) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.UPDATE_STATUS_PLAN_FAIL'),
        ).toResponse();
      }

      if (qualityPlan?.status == QCPlanStatus?.Confirmed) {
        qualityPlan.status = QCPlanStatus?.InProgress;
        await queryRunner.manager.save(qualityPlan);
      }

      // UPDATE STATUS PLAN Completed TODO

      // Update order MES
      const updateIORequest = new UpdateIOQcQuantityRequestDto();

      switch (parseInt(transactionHistory.type)) {
        case STAGES_OPTION.PO_IMPORT:
          updateIORequest.purchasedOrderId = transactionHistory.orderId;
          break;
        case STAGES_OPTION.SO_EXPORT:
          updateIORequest.saleOrderExportId = transactionHistory.orderId;
          break;
        case STAGES_OPTION.PRO_IMPORT:
          updateIORequest.productionOrderId = transactionHistory.orderId;
          break;
        case STAGES_OPTION.PRO_EXPORT:
          updateIORequest.productionOrderId = transactionHistory.orderId;
          break;
      }

      updateIORequest.warehouseId = transactionHistory?.warehouseId;
      updateIORequest.itemId = transactionHistory?.itemId;
      updateIORequest.qcPassQuantity = parseInt(
        transactionHistory?.qcPassQuantity,
      );
      updateIORequest.qcRejectQuantity = parseInt(
        transactionHistory?.qcRejectQuantity,
      );
      updateIORequest.lotNumber = transactionHistory?.lotNumber;
      updateIORequest.lotDate = transactionHistory?.createdAt;
      updateIORequest.userId = request?.confirmedBy;

      const updateResult = await this.saleService.updateIOQcQuantity(
        updateIORequest,
        parseInt(transactionHistory.type),
      );

      // if update order
      if (!updateResult) {
        await queryRunner.rollbackTransaction();
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.CANNOT_UPDATE_IO_QC'),
        ).toResponse();
      }

      await queryRunner.commitTransaction();
      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.CANNOT_UPDATE_ERROR_REPORT'),
        )
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  public async getListByWO(workOrderId: number): Promise<any> {
    const response = await this.errorReportRepository.getStageListByWOForApp(
      workOrderId,
    );
    if (isEmpty(response)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.ERROR_REPORT_NOT_FOUND'))
        .build();
    }
    const result = plainToClass(
      ErrorReportStageDetailForAppResponseDto,
      response,
      { excludeExtraneousValues: true },
    );
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }
}
