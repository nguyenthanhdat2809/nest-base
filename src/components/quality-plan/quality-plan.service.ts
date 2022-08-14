import { Connection, In } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ResponsePayload } from '@utils/response-payload';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { plainToClass } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';
import { QualityPlanServiceInterface } from '@components/quality-plan/interface/quality-plan.service.interface';
import { QualityPlanRepositoryInterface } from '@components/quality-plan/interface/quality-plan.repository.interface';
import {
  QualityPlanListRequestDto,
  QualityPlanQcWcRequestDto,
} from '@components/quality-plan/dto/request/quality-plan-list.request.dto';
import { PagingResponse } from '@utils/paging.response';
import { STAGE_MAP } from '@components/quality-point/quality-point.constant';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { QualityPlanResponseDto } from '@components/quality-plan/dto/response/quality-plan.response.dto';
import { QualityPlanRequestDto } from '@components/quality-plan/dto/request/quality-plan.request.dto';
import { ProduceServiceInterface } from '@components/produce/interface/produce.service.interface';
import { GetDetailQualityPlanResponseDto } from '@components/quality-plan/dto/response/get-detail-quality-plan.response.dto';
import { UpdateQualityPlanRequestDto } from '@components/quality-plan/dto/request/update-quality-plan.request.dto';
import { QualityPointServiceInterface } from '@components/quality-point/interface/quality-point.service.interface';
import {
  Formality,
  NumberOfTime,
  QualityPoint,
} from '@entities/quality-point/quality-point.entity';
import { ErrorReportRepositoryInterface } from '@components/error-report/interface/error-report.repository.interface';
import { STAGE_VALUE, STAGES_OPTION } from '@constant/qc-stage.constant';
import { ApiError } from '@utils/api.error';
import {
  optionQualityPlanStatus,
  QUALITY_PLAN_DB,
  TypeDetailOrder,
} from '@components/quality-plan/quality-plan.constant';
import { stringFormat } from '@utils/object.util';
import { SuccessResponse } from '@utils/success.response.dto';
import { isEmpty, uniq } from 'lodash';
import {
  QCPlanStatus,
  STATUS_TO_CONFIRM_QUALITY_PLAN,
} from '@entities/quality-plan/quality-plan.entity';
import {
  QualityPlanOrderRequestDto,
  UpdateQualityPlanIOqcDetailRequestDto,
  UpdateQualityPlanIOqcRequestDto,
} from '@components/quality-plan/dto/request/quality-plan-ioqc.request.dto';
import { UpdateQualityPlanOrderRequestDto } from '@components/quality-plan/dto/request/update-quality-plan-ioqc.request.dto';
import { SaleServiceInterface } from '@components/sale/interface/sale.service.interface';
import {
  QualityPlanIOqc,
  QualityPlanIOqcDetail,
  QualityPlanIOqcQualityPointUser,
  QualityPlanOrderResponseDto,
} from '@components/quality-plan/dto/response/quality-plan-ioqc.response.dto';
import { QualityPointRepositoryInterface } from '@components/quality-point/interface/quality-point.repository.interface';
import { QualityPlanIOqcOrderResponseDto } from '@components/quality-plan/dto/response/quality-plan-ioqc-order.response.dto';
import { GetListOrderByQualityPlanIOqcRequestDto } from '@components/quality-plan/dto/request/get-list-order-by-quality-plan-ioqc.request.dto';
import { IoqcOrderResponseDto } from '@components/item/dto/response/ioqc-order.response.dto';
import { WorkCenterPlanQcShiftServiceInterface } from '@components/work-center-plan-qc-shift/interface/work-center-plan-qc-shift.service.interface';
import { ListQualityPlanBomRequestDto } from '@components/quality-plan/dto/request/list-quality-plan-bom.request.dto';
import { ListQualityPlanBomResponseDto } from '@components/quality-plan/dto/response/list-quality-plan-bom.response.dto';
import { QualityPlanBomRepositoryInterface } from '@components/quality-plan/interface/quality-plan-bom.repository.interface';
import { UpdateActualQualityPlanIOqcRequestDto } from '@components/quality-plan/dto/request/update-actual-quality-plan-ioqc.request.dto';
import { QualityPlanIOqcRepositoryInterface } from '@components/quality-plan/interface/quality-plan-ioqc.repository.interface';
import { QualityPlanIOqcDetailRepositoryInterface } from '@components/quality-plan/interface/quality-plan-ioqc-detail.repository.interface';
import { ActualQuantityImportHistoryRepositoryInterface } from '@components/actual-quantity-import-history/interface/actual-quantity-import-history.repository.interface';
import {
  checkQcEmployeeRole,
  enumerateDaysBetweenDates,
  paginationService,
  sortService,
} from '@utils/common';
import { GetListInProgressInputPlansResponseDto } from '@components/quality-plan/dto/response/get-list-in-progress-input-plans.response.dto';
import { GetDashboardIoQcProgressRequestDto } from '@components/dashboard/dto/request/get-dashboard-io-qc-progress-request.dto';
import { TransactionHistoryIOqcTypeEnum } from '@components/transaction-history/transaction-history.constant';
import { TIME_ZONE_VN } from '@constant/common';
import { extendMoment } from 'moment-range';
import * as MomentTimezone from 'moment-timezone';
import { userIOqcNumberOfTimeQc } from '@entities/quality-plan/quality-plan-ioqc-quality-point-user.entity';
import { DeleteQualityPlanOrderRequestDto } from '@components/quality-plan/dto/request/delete-quality-plan-order.request.dto';
import { CheckOwnerPermissionServiceInterface } from '@components/check-owner-permission/interface/check-owner-permission.service.interface';
import {
  BASE_OWNER_DEPARTMENT_IDS,
  BASE_OWNER_ROLES_CODES,
} from '@components/check-owner-permission/check-owner-permission.constant';
import { ConfirmQualityPlanRequestDto } from '@components/quality-plan/dto/request/confirm-quality-plan.request.dto';
import { DeleteQualityPlanRequestDto } from '@components/quality-plan/dto/request/delete-quality-plan.request.dto';
import { WorkCenterPlanQcShiftRepositoryInterface } from '@components/work-center-plan-qc-shift/interface/work-center-plan-qc-shift.repository.interface';
import { GetDashboardFinishedItemProgressRequestDto } from '@components/dashboard/dto/request/get-dashboard-finished-item-progress.request.dto';
import { GetListInProgressProducingStepsPlansResponseDto } from "@components/quality-plan/dto/response/get-list-in-progress-producing-steps-plans.response.dto";
import { ConfirmQualityPlanOrderRequestDto } from "@components/quality-plan/dto/request/confirm-quality-plan-order.request.dto";

const moment = extendMoment(MomentTimezone);

@Injectable()
export class QualityPlanService implements QualityPlanServiceInterface {
  constructor(
    @Inject('QualityPlanRepositoryInterface')
    private readonly qualityPlanRepository: QualityPlanRepositoryInterface,

    @Inject('QualityPlanBomRepositoryInterface')
    private readonly qualityPlanBomRepository: QualityPlanBomRepositoryInterface,

    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceServiceInterface,

    @Inject('QualityPointServiceInterface')
    private readonly qualityPointService: QualityPointServiceInterface,

    @Inject('QualityPointRepositoryInterface')
    private readonly qualityPointRepository: QualityPointRepositoryInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,

    @Inject('SaleServiceInterface')
    private readonly saleService: SaleServiceInterface,

    @Inject('ErrorReportRepositoryInterface')
    private readonly errorReportRepository: ErrorReportRepositoryInterface,

    @Inject('WorkCenterPlanQcShiftServiceInterface')
    private readonly workCenterPlanQcShiftService: WorkCenterPlanQcShiftServiceInterface,

    @Inject('WorkCenterPlanQcShiftRepositoryInterface')
    private readonly workCenterPlanQcShiftRepository: WorkCenterPlanQcShiftRepositoryInterface,

    @Inject('QualityPlanIOqcRepositoryInterface')
    private readonly qualityPlanIOqcRepository: QualityPlanIOqcRepositoryInterface,

    @Inject('QualityPlanIOqcDetailRepositoryInterface')
    private readonly qualityPlanIOqcDetailRepository: QualityPlanIOqcDetailRepositoryInterface,

    @Inject('ActualQuantityImportHistoryRepositoryInterface')
    private readonly actualQuantityImportHistoryRepository: ActualQuantityImportHistoryRepositoryInterface,

    @Inject('CheckOwnerPermissionServiceInterface')
    private readonly checkOwnerPermissionService: CheckOwnerPermissionServiceInterface,

    @InjectConnection()
    private readonly connection: Connection,

    private readonly i18n: I18nService,
  ) {}

  private static readonly QUALITY_POINT_PROPERTY_NAME = 'qualityPoint';
  private static readonly QUALITY_PLAN_BOM_PROPERTY_NAME = 'qualityPlanBom';
  private static readonly NEED_QC_QUANTITY = 'needQCQuantity';
  private static readonly DONE_QC_QUANTITY = 'doneQCQuantity';
  private static readonly PASS_QC_QUANTITY = 'passedQCQuantity';
  private static readonly ERROR_REPORT_IDS = 'errorReportIds';
  private static readonly IS_QC = 'isQc';

  public async confirm(
    request: ConfirmQualityPlanOrderRequestDto,
  ): Promise<any> {
    const { user, id } = request;
    const qualityPlan = await this.qualityPlanRepository.findOneById(id);

    if (!qualityPlan) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    // check owner permission
    const isOwnerPermitted =
      await this.checkOwnerPermissionService.checkOwnerPermission({
        user: user,
        record: qualityPlan,
        departmentIds: BASE_OWNER_DEPARTMENT_IDS,
        roleCodes: BASE_OWNER_ROLES_CODES,
      });

    if (!isOwnerPermitted) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.QUALITY_PLAN_NOT_OWNER'))
        .build();
    }

    if (!STATUS_TO_CONFIRM_QUALITY_PLAN.includes(qualityPlan.status)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_ACCEPTABLE)
        .withMessage(await this.i18n.translate('error.NOT_ACCEPTABLE'))
        .build();
    }

    return await this.updateQualityPlanStatus(
      qualityPlan,
      QCPlanStatus.Confirmed,
    );
  }

  private async updateQualityPlanStatus(
    qualityPlan: any,
    status: number,
  ): Promise<any> {
    qualityPlan.status = status;
    await this.qualityPlanRepository.update(qualityPlan);

    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
  }

  // List Quality Plan Bom
  public async getListQualityPlanBom(
    request: ListQualityPlanBomRequestDto,
  ): Promise<ResponsePayload<PagingResponse | any>> {
    const { result, count } =
      await this.qualityPlanBomRepository.getListQualityPlanBom(request);

    const response = plainToClass(ListQualityPlanBomResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder<PagingResponse>({
      items: result,
      meta: { total: count, page: request.page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async getList(
    request: QualityPlanListRequestDto,
  ): Promise<ResponsePayload<PagingResponse>> {
    const { filter, page, limit, user } = request;
    const { sort } = request;

    // SEARCH Công đoạn
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

    // SEARCH lệnh PO PRO SO MO
    const orderNameFilter = filter?.find((item) => item.column == 'orderName');
    const orderCodeFilter = filter?.find((item) => item.column == 'orderCode');

    let poFilterIds = [],
      proFilterIds = [],
      soFilterIds = [],
      moFilterIds = [];

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

      const moParams = {
        isGetAll: '1',
        filter: paramFilterOrder,
      };

      const dataFilterMos = await this.produceService.getMoByConditions(
        moParams,
      );

      if (
        isEmpty(dataFilterPos) &&
        isEmpty(dataFilterPros) &&
        isEmpty(dataFilterSos) &&
        isEmpty(dataFilterMos)
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

      if (!isEmpty(dataFilterMos)) {
        moFilterIds = dataFilterMos.map((mo) => mo.id);
      }
    }

    // QUERY DB
    const { result, count } = await this.qualityPlanRepository.getList(
      request,
      filterStageSearch,
      poFilterIds,
      proFilterIds,
      soFilterIds,
      moFilterIds,
    );

    if (isEmpty(result)) {
      return new ResponseBuilder<PagingResponse>({
        items: [],
        meta: { total: 0, page: 1 },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    }

    // Map Tên Công đoạn QC + Mã và Tên Mã lẹnh
    let poData = [],
      proImportData = [],
      proExportData = [],
      soData = [],
      moData = [];

    const poIds = result
      .filter((q) => q.qcStageId == STAGES_OPTION.PO_IMPORT)
      .map((q) => q.orderId);

    if (poIds.length > 0) {
      poData = await this.saleService.getPurchasedOrderByIds(uniq(poIds));
    }

    const proImportIds = result
      .filter((q) => q.qcStageId == STAGES_OPTION.PRO_IMPORT)
      .map((q) => q.orderId);

    if (proImportIds.length > 0) {
      proImportData = await this.saleService.getProductionOrderByIds(
        uniq(proImportIds),
      );
    }

    const proExportIds = result
      .filter((q) => q.qcStageId == STAGES_OPTION.PRO_EXPORT)
      .map((q) => q.orderId);

    if (proExportIds.length > 0) {
      proExportData = await this.saleService.getProductionOrderByIds(
        uniq(proExportIds),
      );
    }

    const soIds = result
      .filter((q) => q.qcStageId == STAGES_OPTION.SO_EXPORT)
      .map((q) => q.orderId);

    if (soIds.length > 0) {
      soData = await this.saleService.getSaleOrderExportByIds(uniq(soIds));
    }

    const moArrayIds = result
      .filter(
        (q) =>
          q.qcStageId == STAGES_OPTION.OUTPUT_PRODUCTION ||
          q.qcStageId == STAGES_OPTION.INPUT_PRODUCTION,
      )
      .map((q) => q.moId);

    let moStringIds = '';
    if (!isEmpty(moArrayIds)) {
      moStringIds = uniq(moArrayIds).join(',');
    }

    const moParams = {
      isGetAll: '1',
      filter: [{ column: 'manufacturingOrderIds', text: moStringIds }],
    };

    if (moStringIds) {
      moData = await this.produceService.getMoByConditions(moParams);
    }

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
          order = moData.filter((mo) => mo.id == y.moId)[0];
          break;
        case STAGES_OPTION.INPUT_PRODUCTION:
          order = moData.filter((mo) => mo.id == y.moId)[0];
          break;
        default:
          break;
      }

      // Trạng thái
      const textStatus = optionQualityPlanStatus.find(
        (x) => x.value == y.status,
      );

      y.orderCode = order?.code ? order.code : '';
      y.orderName = order?.name ? order.name : '';
      y.qcStageName = STAGE_MAP[y?.qcStageId];
      y.textStatus = textStatus?.text;
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
      'orderCode',
      'orderName',
      'textStatus',
    ]);

    // PAGINATE
    if (page && limit) {
      data = paginationService(data, Number(page), Number(limit));
    }

    const items = plainToClass(QualityPlanResponseDto, data, {
      excludeExtraneousValues: true,
    }) as unknown as Array<QualityPlanResponseDto>;

    return new ResponseBuilder<PagingResponse>({
      items: items,
      meta: { total: count, page: page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async qualityPlanDetailByMoId(
    moId: number,
  ): Promise<ResponsePayload<any>> {
    const qualityPlan = await this.qualityPlanRepository.findOneByCondition({
      join: {
        alias: 'qp',
        innerJoin: { qpd: 'qp.qualityPlanDetail' },
      },
      where: (qpd) => {
        qpd.where('qpd.moId = :moId', { moId: moId });
      },
    });

    if (isEmpty(qualityPlan)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.QUALITY_PLAN_NOT_FOUND'))
        .build();
    }

    return await this.getDetail(qualityPlan?.id);
  }

  public async getDetail(id: number): Promise<ResponsePayload<any>> {
    const entity = await this.qualityPlanRepository.findOneById(id);

    if (!entity) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const qualityPlan = await this.qualityPlanRepository.getDetail(entity);

    const response = plainToClass(
      GetDetailQualityPlanResponseDto,
      qualityPlan,
      {
        excludeExtraneousValues: true,
      },
    );

    response.qcStageName = STAGE_MAP[response.qcStageId];
    const qualityPlanDetail = qualityPlan.qualityPlanDetail;

    const moDetailPromise = this.produceService.getMoDetail(
      qualityPlanDetail.moId,
    );

    const moPlanDetailPromise = this.produceService.getMoPlanDetail(
      qualityPlanDetail.moPlanId,
    );

    const [moDetailResponse, moPlanDetailResponse] = await Promise.all([
      moDetailPromise,
      moPlanDetailPromise,
    ]);

    const qualityPlanBoms = qualityPlanDetail?.qualityPlanBoms
      ? qualityPlanDetail.qualityPlanBoms
      : [];

    const moPlanDetailResponseData = moPlanDetailResponse.data;
    const moDetailResponseData = moDetailResponse.data;

    response.mo = {
      id: moDetailResponseData?.id,
      code: moDetailResponseData?.code,
      name: moDetailResponseData?.name,
      planFrom: moDetailResponseData?.planFrom,
      planTo: moDetailResponseData?.planTo,
    };
    response.moPlan = {
      id: qualityPlanDetail.moPlanId,
      name: moPlanDetailResponseData?.name,
      code: moPlanDetailResponseData?.code,
    };
    response.planBoms = moPlanDetailResponseData?.planBoms;

    await this.mapBomPlanDetail(response.planBoms, qualityPlanBoms);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async create(
    request: QualityPlanRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { moId } = request;
    const checkUnique = await this.checkUnique(null, request);
    if (checkUnique) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(checkUnique)
        .build();
    }

    const mo = await this.produceService.getMoDetail(moId);
    if (mo.statusCode !== ResponseCodeEnum.SUCCESS) {
      return new ResponseBuilder()
        .withCode(mo.statusCode)
        .withMessage(await this.i18n.translate('error.MO_NOT_FOUND'))
        .build();
    }

    // Validate MO ! CREATE
    const qualityPlan = await this.qualityPlanRepository.findOneByCondition({
      join: {
        alias: 'qp',
        innerJoin: {
          qpdt: 'qp.qualityPlanDetail',
        },
      },
      where: (er) => {
        er.where('qpdt.moId = :moId', { moId: moId });
      },
    });

    if (qualityPlan) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.PLAN_QUALITY_MO_OR_ORDER_EXIST'),
        )
        .build();
    }

    try {
      await this.qualityPlanRepository.createQualityPlan(request);

      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (error) {
      throw error;
    }
  }

  // CRUD PLAN IOQC
  public async createQualityPlanOrder(
    request: QualityPlanOrderRequestDto,
  ): Promise<ResponsePayload<any>> {
    const checkUnique = await this.checkUnique(null, request);
    if (checkUnique) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(checkUnique)
        .build();
    }

    // Validate ORDER ! CREATE
    const qualityPlanIOqcs = request?.qualityPlanIOqcs;
    const qualityPlanIOqc = qualityPlanIOqcs[0];
    const orderId = qualityPlanIOqc?.orderId;

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

    if (qualityPlan) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.PLAN_QUALITY_MO_OR_ORDER_EXIST'),
        )
        .build();
    }

    try {
      await this.qualityPlanRepository.createQualityPlanOrder(request);

      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (error) {
      throw error;
    }
  }

  public async updateQualityPlanOrder(
    request: UpdateQualityPlanOrderRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { id } = request;
    const qualityPlan = await this.qualityPlanRepository.findOneById(id);
    if (isEmpty(qualityPlan)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    const checkUnique = await this.checkUnique(id, request);
    if (checkUnique) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(checkUnique)
        .build();
    }

    // Validate ORDER ! UPDATE
    const qualityPlanIOqcs = request?.qualityPlanIOqcs;
    const qualityPlanIOqc = qualityPlanIOqcs[0];
    const orderId = qualityPlanIOqc?.orderId;

    const qualityPlanValidate =
      await this.qualityPlanRepository.findOneByCondition({
        join: {
          alias: 'qp',
          innerJoin: {
            qpio: 'qp.qualityPlanIOqcs',
          },
        },
        where: (er) => {
          er.where('qpio.orderId = :orderId', { orderId: orderId }).andWhere(
            'qp.id != :id',
            { id: id },
          );
        },
      });

    if (qualityPlanValidate) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.PLAN_QUALITY_MO_OR_ORDER_EXIST'),
        )
        .build();
    }

    try {
      if (
        qualityPlan?.status == QCPlanStatus?.Confirmed ||
        qualityPlan?.status == QCPlanStatus?.InProgress
      ) {
        const detailQualityPlanDB = await this.getDetailQualityPlanOrder(
          request?.id,
        );
        if (isEmpty(detailQualityPlanDB)) {
          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.BAD_REQUEST)
            .withMessage(await this.i18n.translate('error.NOT_FOUND'))
            .build();
        }

        const detailDB = detailQualityPlanDB?.data;
        const detailQualityPlanIOqcDBs = detailDB?.qualityPlanIOqcs;
        const qcNeedQuantityByQualityPlanIOqcIdDBs =
          detailQualityPlanIOqcDBs.map((x) => {
            return {
              id: x?.id,
              needQCQuantity: Number(x?.needQCQuantity),
            };
          });

        const qualityPlanIOqcs =
          request?.qualityPlanIOqcs as UpdateQualityPlanIOqcRequestDto[];
        for (let i = 0; i < qualityPlanIOqcs.length; i++) {
          const qualityPlanIOqc = qualityPlanIOqcs[i];
          const needQCQuantityValidates =
            qcNeedQuantityByQualityPlanIOqcIdDBs.filter(
              (x) => x?.id == qualityPlanIOqc?.id,
            );
          if (isEmpty(needQCQuantityValidates)) {
            return new ResponseBuilder()
              .withCode(ResponseCodeEnum.BAD_REQUEST)
              .withMessage(await this.i18n.translate('error.NOT_FOUND'))
              .build();
          }

          const needQCQuantityValidate =
            needQCQuantityValidates[0].needQCQuantity;
          const qualityPlanIOqcDetails =
            qualityPlanIOqc?.qualityPlanIOqcDetails as UpdateQualityPlanIOqcDetailRequestDto[];

          let totalDoneQCQuantity = 0;
          for (let i = 0; i < qualityPlanIOqcDetails?.length; i++) {
            const qualityPlanIOqcDetail = qualityPlanIOqcDetails[i];

            const qcDoneQuantity = qualityPlanIOqcDetail?.qcDoneQuantity
              ? Number(qualityPlanIOqcDetail.qcDoneQuantity)
              : 0;
            const qcPassQuantity = qualityPlanIOqcDetail?.qcPassQuantity
              ? Number(qualityPlanIOqcDetail.qcPassQuantity)
              : 0;

            if (qcDoneQuantity < qcPassQuantity) {
              return new ResponseBuilder()
                .withCode(ResponseCodeEnum.BAD_REQUEST)
                .withMessage(
                  await this.i18n.translate('error.QUANTITY_INVALID'),
                )
                .build();
            }
            totalDoneQCQuantity += qcDoneQuantity;
          }

          if (needQCQuantityValidate < totalDoneQCQuantity) {
            return new ResponseBuilder()
              .withCode(ResponseCodeEnum.BAD_REQUEST)
              .withMessage(await this.i18n.translate('error.QUANTITY_INVALID'))
              .build();
          }
        }

        await this.qualityPlanIOqcDetailRepository.updateQualityPlanIDqcDetailAfterConfirm(
          request,
        );
      } else {
        await this.qualityPlanRepository.updateQualityPlanOrder(request);
      }

      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (error) {
      throw error;
    }
  }

  public async updateActualQualityPlanIOqc(
    request: UpdateActualQualityPlanIOqcRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { data } = request;
    if (isEmpty(data)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    const itemIds = data.map((x) => x.itemId);

    const qualityPlanIOqcs =
      await this.qualityPlanIOqcRepository.findWithRelations({
        join: {
          alias: 'qpio',
          innerJoin: { qp: 'qpio.qualityPlan' },
        },
        where: (qpio) => {
          qpio
            .where({
              orderId: data[0].orderId,
              warehouseId: data[0].warehouseId,
              itemId: In(itemIds),
            })
            .andWhere('qp.qcStageId = :qcStageId', {
              qcStageId: data[0].qcStageId,
            });
        },
      });

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      if (!isEmpty(qualityPlanIOqcs)) {
        for (let i = 0; i < qualityPlanIOqcs.length; i++) {
          const qualityPlanIOqc = qualityPlanIOqcs[i];
          const dataFilter = data.filter(
            (x) => x.itemId == qualityPlanIOqc.itemId,
          )[0];

          if (isEmpty(dataFilter) || !dataFilter?.actualQuantity) {
            return new ApiError(
              ResponseCodeEnum.BAD_REQUEST,
              await this.i18n.translate('error.ERROR_DATA_PLAN'),
            ).toResponse();
          }

          if (dataFilter.actualQuantity <= qualityPlanIOqc.actualQuantity) {
            return new ApiError(
              ResponseCodeEnum.BAD_REQUEST,
              await this.i18n.translate('error.ERROR_DATA_PLAN'),
            ).toResponse();
          }

          qualityPlanIOqc.actualQuantity = dataFilter.actualQuantity;
          await queryRunner.manager.save(qualityPlanIOqc);
        }
      }

      const actualQuantityImportHistoryEntities = data.map((item) =>
        this.actualQuantityImportHistoryRepository.createEntity(item),
      );

      await queryRunner.manager.save(actualQuantityImportHistoryEntities);

      await queryRunner.commitTransaction();
      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  // GET DETAIL BY MES 1
  public async qualityPlanGetDetailOrder(
    id: number,
    type: number,
  ): Promise<any> {
    // Data order
    const responseOrder = await this.getDataOrderOfMES(id, type, null);
    if (responseOrder?.statusCode) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.ERROR_DATA_ORDER'))
        .build();
    }

    const { orders, orderWarehouseDetails, itemLists } = responseOrder;

    let qualityPlanOrder = new QualityPlanIOqcOrderResponseDto();
    const orderData = [];

    const mapIdQualityPoint = orderWarehouseDetails.map(
      (owd) => owd?.qcCriteriaId,
    );
    const qualityPointIds = uniq(mapIdQualityPoint.filter(Number));

    if (!isEmpty(qualityPointIds)) {
      const qualityPoints = await this.qualityPointRepository.findWithRelations(
        {
          where: {
            id: In(qualityPointIds),
          },
          relations: ['qualityPointUser1s', 'qualityPointUser2s'],
        },
      );

      const user1IdOfQualityPoints = [];
      qualityPoints.forEach((qp) => {
        qp?.qualityPointUser1s.forEach((user) =>
          user1IdOfQualityPoints.push(user.userId),
        );
      });

      const user2IdOfQualityPoints = [];
      qualityPoints.forEach((qp) => {
        qp?.qualityPointUser2s.forEach((user) =>
          user2IdOfQualityPoints.push(user.userId),
        );
      });

      // Danh sách User có trong tiêu chí MES
      const listUsers = (
        await this.userService.getListByIDs(
          uniq(user1IdOfQualityPoints.concat(user2IdOfQualityPoints)),
        )
      ).map((u) => {
        return {
          userId: u?.id,
          userName: u?.username,
        };
      });

      orderWarehouseDetails
        .map((owd) => {
          if (!owd?.qcCheck || !owd?.qcCriteriaId) {
            return;
          }
          const qualityPoint = qualityPoints.filter(
            (qp) => qp.id == owd.qcCriteriaId,
          )[0];
          const user1QualityPoints = qualityPoint?.qualityPointUser1s
            ?.map((user) => {
              return listUsers.filter(
                (listUser) => listUser?.userId == user?.userId,
              )[0];
            })
            ?.filter((user) => user != null);

          const user2QualityPoints = qualityPoint?.qualityPointUser2s
            ?.map((user) => {
              return listUsers.filter(
                (listUser) => listUser?.userId == user?.userId,
              )[0];
            })
            ?.filter((user) => user != null);

          const { formalityRate, numberOfTime } =
            this.qualityPointFormat(qualityPoint);

          const quantity = owd ? Number(owd.quantity) : 0;
          const actualQuantity = owd ? Number(owd.actualQuantity) : 0;

          const val = {
            orderId: orders ? orders.id : null,
            warehouseId: owd ? owd.warehouseId : null,
            warehouse: {
              id: owd.warehouse.id,
              name: owd.warehouse.name,
              code: owd.warehouse.code,
            },
            itemId: owd ? owd.itemId : null,
            item: {
              id: owd ? owd.itemId : null,
              name: owd.item.name,
              code: owd.item.code,
              unit: owd.item.itemUnit,
            },
            itemLists: itemLists,
            qcCheck: owd.qcCheck,
            qualityPointId: owd.qcCriteriaId,
            qualityPoint: {
              id: qualityPoint ? qualityPoint.id : null,
              name: qualityPoint ? qualityPoint.name : '',
              user1s: user1QualityPoints,
              user2s: user2QualityPoints,
              formalityRate: formalityRate,
              numberOfTime: numberOfTime,
            },
            planQuantity: quantity, // Số lượng kế hoạch
            actualQuantity: actualQuantity, // Số lượng đã nhập(Thực tế)
            needQCQuantity: quantity, // Số lượng cần
          };

          return val;
        })
        ?.forEach((val) => (val ? orderData.push(val) : null));
    }

    qualityPlanOrder = {
      order: {
        id: orders ? orders.id : null,
        code: orders ? orders.code : '',
        name: orders ? orders.name : '',
      },
      qualityPlanIOqcs: orderData,
    };

    return new ResponseBuilder<QualityPlanIOqcOrderResponseDto>(
      qualityPlanOrder,
    )
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  // GET DETAIL BY QMSx 2
  public async getDetailQualityPlanOrder(
    id: number,
  ): Promise<ResponsePayload<any>> {
    const entity = await this.qualityPlanRepository.findOneById(id);
    if (!entity) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    const qualityPlan =
      await this.qualityPlanRepository.getDetailQualityPlanOrder(entity);
    const orderId = qualityPlan.qualityPlanIOqcs[0]
      ? qualityPlan.qualityPlanIOqcs[0].orderId
      : null;

    // IDs ERROR REPORT
    const qcStageIdGetER = qualityPlan.qcStageId;
    const orderIdGetER = qualityPlan.qualityPlanIOqcs[0].orderId;
    const errorReports =
      await this.errorReportRepository.getListErrorReportByStageIdAndOrderId(
        qcStageIdGetER,
        orderIdGetER,
      );

    // Data order
    const responseOrder = await this.getDataOrderOfMES(
      orderId,
      null,
      qualityPlan.qcStageId,
    );
    if (responseOrder?.statusCode) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.ERROR_DATA_ORDER'))
        .build();
    }

    const { orders, orderWarehouseDetails, itemLists } = responseOrder;
    let qualityPlanOrder = new QualityPlanOrderResponseDto();
    const qualityPlanIOqcs = qualityPlan.qualityPlanIOqcs;

    const mapIdQualityPoint = orderWarehouseDetails.map(
      (owd) => owd?.qcCriteriaId,
    );
    const qualityPointIds = uniq(mapIdQualityPoint.filter(Number));

    const qualityPoints = await this.qualityPointRepository.findWithRelations({
      where: {
        id: In(uniq(qualityPointIds.filter(Number))),
      },
      relations: ['qualityPointUser1s', 'qualityPointUser2s'],
    });

    const user1IdOfQualityPoints = [];
    qualityPoints.forEach((qp) => {
      qp?.qualityPointUser1s.forEach((user) =>
        user1IdOfQualityPoints.push(user.userId),
      );
    });

    const user2IdOfQualityPoints = [];
    qualityPoints.forEach((qp) => {
      qp?.qualityPointUser2s.forEach((user) =>
        user2IdOfQualityPoints.push(user.userId),
      );
    });

    const listUsers = (
      await this.userService.getListByIDs(
        uniq(user1IdOfQualityPoints?.concat(user2IdOfQualityPoints)),
      )
    ).map((u) => {
      return {
        userId: u.id,
        userName: u.username,
      };
    });

    const orderData = [];
    if (!isEmpty(qualityPointIds)) {
      for (const orderWarehouseDetail of orderWarehouseDetails) {
        const orderDataMap = qualityPlanIOqcs
          .filter(
            (ioqc) =>
              ioqc.warehouseId == orderWarehouseDetail.warehouseId &&
              ioqc.itemId == orderWarehouseDetail.itemId,
          )
          .map((ioqc) => {
            // Phiếu báo cáo lỗi
            const errorReportIds = errorReports
              .filter(
                (er) =>
                  er.errorReportIoqcDetail.itemId == ioqc.itemId &&
                  er.errorReportIoqcDetail.warehouseId == ioqc.warehouseId,
              )
              .map((er) => er.id);

            // Tiêu chí
            const qualityPoint = qualityPoints.filter(
              (qp) => qp.id == ioqc.qualityPointId,
            )[0];
            // User của tiêu chí
            const user1QualityPoints = qualityPoint?.qualityPointUser1s?.map(
              (user) => {
                return listUsers.filter(
                  (listUser) => listUser.userId == user.userId,
                )[0];
              },
            );

            const user2QualityPoints = qualityPoint?.qualityPointUser2s?.map(
              (user) => {
                return listUsers.filter(
                  (listUser) => listUser.userId == user.userId,
                )[0];
              },
            );

            const { formalityRate, numberOfTime } =
              this.qualityPointFormat(qualityPoint);

            let qualityPlanIOqc = new QualityPlanIOqc();
            let qualityPlanIOqcDetail = new QualityPlanIOqcDetail();
            let qualityPlanIOqcQualityPointUser =
              new QualityPlanIOqcQualityPointUser();
            const qualityPlanIOqcDetailDatas = ioqc.qualityPlanIOqcDetails;

            const qualityPlanIOqcDetailMaps = [];

            for (let j = 0; j < qualityPlanIOqcDetailDatas.length; j++) {
              const qualityPlanIOqcDetailData = qualityPlanIOqcDetailDatas[j];
              const users =
                qualityPlanIOqcDetailData.qualityPlanIOqcQualityPointUsers;

              const user1Maps = [];
              const user2Maps = [];
              for (let k = 0; k < users.length; k++) {
                const qualityPlanIOqcQualityPointUserData = users[k];

                const username = listUsers.filter(
                  (listUser) =>
                    listUser.userId ==
                    qualityPlanIOqcQualityPointUserData.userId,
                )[0]?.userName;

                qualityPlanIOqcQualityPointUser = {
                  id: qualityPlanIOqcQualityPointUserData.id,
                  userId: qualityPlanIOqcQualityPointUserData.userId,
                  username: username,
                };

                if (
                  qualityPlanIOqcQualityPointUserData?.numberOfTimeQc &&
                  qualityPlanIOqcQualityPointUserData?.numberOfTimeQc ==
                    userIOqcNumberOfTimeQc.theFirstTime
                ) {
                  user1Maps.push(qualityPlanIOqcQualityPointUser);
                } else if (
                  qualityPlanIOqcQualityPointUserData?.numberOfTimeQc &&
                  qualityPlanIOqcQualityPointUserData?.numberOfTimeQc ==
                    userIOqcNumberOfTimeQc.theSecondTime
                ) {
                  user2Maps.push(qualityPlanIOqcQualityPointUser);
                }
              }

              const planQcQuantity = qualityPlanIOqcDetailData?.planQcQuantity
                ? Number(qualityPlanIOqcDetailData?.planQcQuantity)
                : 0;
              const qcPassQuantity = qualityPlanIOqcDetailData?.qcPassQuantity
                ? Number(qualityPlanIOqcDetailData?.qcPassQuantity)
                : 0;
              const qcRejectQuantity =
                qualityPlanIOqcDetailData?.qcRejectQuantity
                  ? Number(qualityPlanIOqcDetailData?.qcRejectQuantity)
                  : 0;
              const qcDoneQuantity = qualityPlanIOqcDetailData?.qcDoneQuantity
                ? Number(qualityPlanIOqcDetailData?.qcDoneQuantity)
                : 0;

              qualityPlanIOqcDetail = {
                id: qualityPlanIOqcDetailData.id,
                ordinalNumber: qualityPlanIOqcDetailData.ordinalNumber,
                planQcQuantity: planQcQuantity, // Số lượng kế hoạch QC
                planErrorRate: qualityPlanIOqcDetailData.planErrorRate,
                planFrom: qualityPlanIOqcDetailData.planFrom,
                planTo: qualityPlanIOqcDetailData.planTo,
                qcPassQuantity: qcPassQuantity,
                qcRejectQuantity: qcRejectQuantity,
                qcDoneQuantity: qcDoneQuantity,
                qualityPlanIOqcQualityPointUser1s: user1Maps,
                qualityPlanIOqcQualityPointUser2s: user2Maps,
              };

              qualityPlanIOqcDetailMaps.push(qualityPlanIOqcDetail);
            }

            const planQuantityTotal = ioqc?.planQuantity
              ? Number(ioqc.planQuantity)
              : 0;
            const actualQuantityTotal = ioqc?.actualQuantity
              ? Number(ioqc.actualQuantity)
              : 0;
            const qcPassQuantityTotal = ioqc?.qcPassQuantity
              ? Number(ioqc.qcPassQuantity)
              : 0;
            const qcRejectQuantityTotal = ioqc?.qcRejectQuantity
              ? Number(ioqc.qcRejectQuantity)
              : 0;

            qualityPlanIOqc = {
              id: ioqc.id,
              orderId: ioqc.orderId,
              warehouseId: ioqc.warehouseId,
              warehouse: {
                id: orderWarehouseDetail.warehouse.id,
                name: orderWarehouseDetail.warehouse.name,
                code: orderWarehouseDetail.warehouse.code,
              },
              itemId: ioqc.itemId,
              item: {
                id: ioqc.itemId,
                name: orderWarehouseDetail.item.name,
                code: orderWarehouseDetail.item.code,
                unit: orderWarehouseDetail.item.itemUnit,
              },
              itemLists: itemLists,
              qcCheck: orderWarehouseDetail.qcCheck,
              qualityPointId: ioqc.qualityPointId,
              qualityPoint: {
                id: qualityPoint ? qualityPoint.id : null,
                name: qualityPoint ? qualityPoint.name : null,
                user1s: user1QualityPoints,
                user2s: user2QualityPoints,
                formalityRate: formalityRate,
                numberOfTime: numberOfTime,
              },
              planQuantity: planQuantityTotal, // Số lượng kế hoạch
              actualQuantity: actualQuantityTotal, // Số lượng đã nhập(Thực tế)
              needQCQuantity:
                planQuantityTotal - qcPassQuantityTotal - qcRejectQuantityTotal, // Số lượng cần
              errorReportId: errorReportIds,
              qualityPlanIOqcDetails: qualityPlanIOqcDetailMaps,
            };

            return qualityPlanIOqc;
          })
          .forEach((qualityPlanIOqc) => orderData.push(qualityPlanIOqc));
      }
    }

    qualityPlanOrder = {
      code: qualityPlan ? qualityPlan.code : '',
      name: qualityPlan ? qualityPlan.name : '',
      description: qualityPlan ? qualityPlan.description : '',
      qcStageId: qualityPlan ? qualityPlan.qcStageId : '',
      status: qualityPlan ? qualityPlan.status : '',
      order: {
        id: orders ? orders.id : null,
        code: orders ? orders.code : '',
        name: orders.name,
      },
      qualityPlanIOqcs: orderData,
    };

    return new ResponseBuilder<QualityPlanOrderResponseDto>(qualityPlanOrder)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private async getDataOrderOfMES(
    id: number,
    type?: number,
    qcStageId?: number,
  ): Promise<any> {
    let orders,
      orderWarehouseDetails,
      itemLists = [];
    if (type == TypeDetailOrder.PO || qcStageId == STAGES_OPTION.PO_IMPORT) {
      orders = await this.saleService.getPurchasedOrderById(id);
      orderWarehouseDetails = orders
        ? orders.purchasedOrderWarehouseDetails
        : [];
    } else if (
      type == TypeDetailOrder.PRO ||
      qcStageId == STAGES_OPTION.PRO_IMPORT ||
      qcStageId == STAGES_OPTION.PRO_EXPORT
    ) {
      orders = await this.saleService.getProductionOrderById(id);
      orderWarehouseDetails = orders
        ? orders.productionOrderWarehouseDetails
        : [];
    } else if (
      type == TypeDetailOrder.SO ||
      qcStageId == STAGES_OPTION.SO_EXPORT
    ) {
      orders = await this.saleService.getSaleOrderExportById(id);
      orderWarehouseDetails = orders
        ? orders.saleOrderExportWarehouseDetails
        : [];
    }

    if (isEmpty(orders) || isEmpty(orderWarehouseDetails)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.ERROR_DATA_ORDER'))
        .build();
    }

    if (!orders?.id || !orders?.name || !orders?.code) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.ERROR_DATA_ORDER'))
        .build();
    }

    for (let i = 0; i < orderWarehouseDetails.length; i++) {
      const orderWarehouseDetail = orderWarehouseDetails[i];
      if (
        !orderWarehouseDetail?.warehouseId ||
        !orderWarehouseDetail?.itemId ||
        orderWarehouseDetail?.quantity == undefined ||
        orderWarehouseDetail?.actualQuantity == undefined ||
        isEmpty(orderWarehouseDetail?.item) ||
        isEmpty(orderWarehouseDetail?.warehouse)
      ) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(await this.i18n.translate('error.ERROR_DATA_ORDER'))
          .build();
      }

      if (
        !orderWarehouseDetail.item?.name ||
        !orderWarehouseDetail.item?.code ||
        !orderWarehouseDetail.item?.itemUnit ||
        !orderWarehouseDetail.warehouse?.code ||
        !orderWarehouseDetail.warehouse?.name
      ) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(await this.i18n.translate('error.ERROR_DATA_ORDER'))
          .build();
      }
    }

    for (let i = 0; i < orderWarehouseDetails.length; i++) {
      const warehouseLists = [];

      for (let j = 0; j < orderWarehouseDetails.length; j++) {
        if (
          orderWarehouseDetails[i].itemId == orderWarehouseDetails[j].itemId
        ) {
          warehouseLists.push({
            warehouseId: orderWarehouseDetails[j].warehouseId,
            warehouseCode: orderWarehouseDetails[j].warehouse.code,
            warehouseName: orderWarehouseDetails[j].warehouse.name,
          });
        }
      }
      if (
        isEmpty(
          itemLists.filter((x) => x.itemId == orderWarehouseDetails[i].itemId),
        )
      ) {
        itemLists.push({
          itemId: orderWarehouseDetails[i].itemId,
          itemCode: orderWarehouseDetails[i].item.code,
          itemName: orderWarehouseDetails[i].item.name,
          warehouseLists: warehouseLists,
        });
      }
    }

    return {
      orders: orders,
      orderWarehouseDetails: orderWarehouseDetails,
      itemLists: itemLists,
    };
  }

  public async deleteQualityPlanOrder(
    request: DeleteQualityPlanOrderRequestDto,
  ): Promise<ResponsePayload<SuccessResponse | any>> {
    const { user, id } = request;
    const qualityPlan = await this.qualityPlanRepository.findOneById(id);
    if (isEmpty(qualityPlan)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    // check owner permission
    const isOwnerPermitted =
      await this.checkOwnerPermissionService.checkOwnerPermission({
        user: user,
        record: qualityPlan,
        departmentIds: BASE_OWNER_DEPARTMENT_IDS,
        roleCodes: BASE_OWNER_ROLES_CODES,
      });

    if (!isOwnerPermitted) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.QUALITY_PLAN_NOT_OWNER'))
        .build();
    }

    if (qualityPlan.status == QCPlanStatus.Confirmed) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.QUALITY_PLAN_CONFIRMED'))
        .build();
    }

    try {
      await this.qualityPlanRepository.deleteQualityPlanOrder(id);

      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (error) {
      throw error;
    }
  }
  // END

  public async update(
    request: UpdateQualityPlanRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { id, moId, user } = request;
    const qualityPlan = await this.qualityPlanRepository.findOneById(id);
    if (isEmpty(qualityPlan)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    // check owner permission
    const isOwnerPermitted =
      await this.checkOwnerPermissionService.checkOwnerPermission({
        user: user,
        record: qualityPlan,
        departmentIds: BASE_OWNER_DEPARTMENT_IDS,
        roleCodes: BASE_OWNER_ROLES_CODES,
      });

    if (!isOwnerPermitted) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.QUALITY_PLAN_NOT_OWNER'))
        .build();
    }

    if (qualityPlan.status === QCPlanStatus.Confirmed) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.QUALITY_PLAN_CONFIRMED'))
        .build();
    }

    const checkUnique = await this.checkUnique(id, request);
    if (checkUnique) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(checkUnique)
        .build();
    }

    const mo = await this.produceService.getMoDetail(moId);
    if (mo.statusCode !== ResponseCodeEnum.SUCCESS) {
      return new ResponseBuilder()
        .withCode(mo.statusCode)
        .withMessage(await this.i18n.translate('error.MO_NOT_FOUND'))
        .build();
    }

    // Validate MO ! UPDATE
    const qualityPlanValidate =
      await this.qualityPlanRepository.findOneByCondition({
        join: {
          alias: 'qp',
          innerJoin: {
            qpdt: 'qp.qualityPlanDetail',
          },
        },
        where: (er) => {
          er.where('qpdt.moId = :moId', { moId: moId }).andWhere(
            'qp.id != :id',
            { id: id },
          );
        },
      });

    if (qualityPlanValidate) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.PLAN_QUALITY_MO_OR_ORDER_EXIST'),
        )
        .build();
    }

    try {
      await this.qualityPlanRepository.updateQualityPlan(request);

      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (error) {
      throw error;
    }
  }

  public async delete(
    request: DeleteQualityPlanRequestDto,
  ): Promise<ResponsePayload<SuccessResponse | any>> {
    const { user, id } = request;
    const qualityPlan = await this.qualityPlanRepository.findOneById(id);
    if (isEmpty(qualityPlan)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    // check owner permission
    const isOwnerPermitted =
      await this.checkOwnerPermissionService.checkOwnerPermission({
        user: user,
        record: qualityPlan,
        departmentIds: BASE_OWNER_DEPARTMENT_IDS,
        roleCodes: BASE_OWNER_ROLES_CODES,
      });

    if (!isOwnerPermitted) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.QUALITY_PLAN_NOT_OWNER'))
        .build();
    }

    if (qualityPlan.status === QCPlanStatus.Confirmed) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.QUALITY_PLAN_CONFIRMED'))
        .build();
    }

    try {
      await this.qualityPlanRepository.deleteQualityPlan(id);

      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (error) {
      throw error;
    }
  }

  public async getMoPlanDetail(id: number): Promise<any> {
    const planResponse = await this.produceService.getMoPlanDetail(id);
    const plan = planResponse?.data;

    await this.mapBomPlanDetail(plan.planBoms);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(plan)
      .build();
  }

  private async removeProducingStep(producingSteps) {
    for (const producingStep of producingSteps) {
      const qualityPointId = producingStep?.producingStep?.qcCriteriaId;
      if (!qualityPointId) {
        const index = producingSteps.indexOf(producingStep);
        if (index > -1) {
          producingSteps.splice(index, 1);
          await this.removeProducingStep(producingSteps);
          break;
        }
      }
    }
    return producingSteps;
  }

  private async sortProducingStep(producingSteps) {
    const nestedSort =
      (prop1, prop2 = null, direction = 'asc') =>
      (e1, e2) => {
        let a = prop2 ? e1[prop1][prop2] : e1[prop1];
        let b = prop2 ? e2[prop1][prop2] : e2[prop1];
        const sortOrder = direction === 'asc' || direction === 'ASC' ? 1 : -1;

        if (typeof a == 'string' && typeof b == 'string') {
          a = a?.trim()?.toLowerCase();
          b = b?.trim()?.toLowerCase();
          const index = a.localeCompare(b);
          return index < 0 ? -sortOrder : index > 0 ? sortOrder : 0;
        }

        return a < b ? -sortOrder : a > b ? sortOrder : 0;
      };

    producingSteps = producingSteps.sort(
      nestedSort('producingStep', 'stepNumber', 'desc'),
    );

    return producingSteps;
  }

  // Map data Tiêu chí lấy từ Mo plan về
  private async getDataQualityPointByMoPlan(qualityPointId) {
    const qualityPoint = (
      await this.qualityPointService.getDetail(qualityPointId)
    ).data;

    const qualityPointUser1Ids = qualityPoint?.qualityPointUser1s
      ? qualityPoint.qualityPointUser1s.map((p) => p.userId)
      : [];

    const qualityPointUser2Ids = qualityPoint?.qualityPointUser2s
      ? qualityPoint.qualityPointUser2s.map((p) => p.userId)
      : [];

    const user1s = (
      await this.userService.getListByIDs(qualityPointUser1Ids)
    ).map((u) => {
      return {
        userId: u.id,
        userName: u.username,
      };
    });

    const user2s = (
      await this.userService.getListByIDs(qualityPointUser2Ids)
    ).map((u) => {
      return {
        userId: u.id,
        userName: u.username,
      };
    });

    const { formalityRate, numberOfTime } =
      this.qualityPointFormat(qualityPoint);

    return {
      id: qualityPointId ? qualityPointId : null,
      name: qualityPoint ? qualityPoint.name : null,
      qualityPointUser1s: user1s ? user1s : [],
      qualityPointUser2s: user2s ? user2s : [],
      formalityRate: formalityRate,
      numberOfTime: numberOfTime,
    };
  }

  // Map dữ liệu từ Quality Plan Bom trong QMSX
  private async getDataQualityPlanBom(
    qualityPlanBoms: any,
    createKeyBomTree: any,
    bomIdOfPlanBom: any,
    producingStepId: any,
  ) {
    let qualityPlanBomData: any;

    if (qualityPlanBoms) {
      qualityPlanBomData = qualityPlanBoms.filter((qualityPlanBom) => {
        if (
          qualityPlanBom.keyBomTree === createKeyBomTree &&
          bomIdOfPlanBom &&
          producingStepId &&
          qualityPlanBom.bomId === bomIdOfPlanBom &&
          qualityPlanBom.producingStepId === producingStepId
        ) {
          return qualityPlanBom;
        }
      })[0];
    } else {
      qualityPlanBomData = null;
    }

    const user1Ids = qualityPlanBomData
      ? qualityPlanBomData.qualityPlanBomQualityPointUsers.map((user) =>
          user && user?.numberOfTimeQc == 1 ? user.userId : null,
        )
      : [];

    const user2Ids = qualityPlanBomData
      ? qualityPlanBomData.qualityPlanBomQualityPointUsers.map((user) =>
          user && user?.numberOfTimeQc == 2 ? user.userId : null,
        )
      : [];

    const user1s = (await this.userService.getListByIDs(user1Ids)).map((u) => {
      return {
        userId: u.id,
        userName: u.username,
      };
    });

    const user2s = (await this.userService.getListByIDs(user2Ids)).map((u) => {
      return {
        userId: u.id,
        userName: u.username,
      };
    });

    return {
      id: qualityPlanBomData ? qualityPlanBomData.id : null,
      qualityPlanBomQualityPointUser1s: user1s ? user1s : [],
      qualityPlanBomQualityPointUser2s: user2s ? user2s : [],
      planFrom: qualityPlanBomData ? qualityPlanBomData.planFrom : null,
      planTo: qualityPlanBomData ? qualityPlanBomData.planTo : null,
      planErrorRate: qualityPlanBomData
        ? qualityPlanBomData.planErrorRate
        : null,
      planQcQuantity: qualityPlanBomData
        ? qualityPlanBomData.planQcQuantity
        : null,
    };
  }

  // Map all dữ liệu bom lấy từ mo plan
  private async mapBomPlanDetail(
    planBoms: any,
    qualityPlanBoms?: any,
    keyBomTree?: string,
  ) {
    const errorReports =
      await this.errorReportRepository.getListErrorReportStageDetailByStageId(
        STAGES_OPTION.OUTPUT_PRODUCTION,
      );
    let createKeyBomTree: string;

    for (const bom of planBoms) {
      const bomIdOfPlanBom = bom?.planBom?.bomId; // ID of Bom In PlanBom
      const producingSteps = bom.planBom?.producingStep
        ? bom.planBom?.producingStep
        : [];
      bom.planingQuantity = bom?.planingQuantity
        ? Number(bom?.planingQuantity)
        : 0;

      // await this.removeProducingStep(producingSteps)
      await this.sortProducingStep(producingSteps);

      const str1 = keyBomTree ? keyBomTree.toString() : '';
      const str2 = bomIdOfPlanBom ? bomIdOfPlanBom.toString() : '';

      if (
        keyBomTree &&
        keyBomTree !== null &&
        keyBomTree !== undefined &&
        keyBomTree !== ''
      ) {
        createKeyBomTree = str1.concat('_', str2);
      } else {
        createKeyBomTree = str2;
      }

      for (const producingStep of producingSteps) {
        producingStep['bomId'] = bomIdOfPlanBom ? bomIdOfPlanBom : null;
        producingStep['keyBomTree'] = createKeyBomTree;

        const step = producingStep?.producingStep;
        const producingStepId = step?.id; // ID of ProducingStep In PlanBom

        const woId = producingStep?.workOrders[0]?.id; // ID of WO In producingStep
        const errorReportId = [];
        for (let i = 0; i < errorReports.length; i++) {
          if (errorReports[i].workOrderId === woId) {
            errorReportId.push(errorReports[i].errorReportId);
          }
        }

        // step?.qcCriteriaId ID tiêu chí
        step[QualityPlanService.IS_QC] = step?.qcCriteriaId ? true : false;

        // Map tiêu chí từ mo plan
        step[QualityPlanService.QUALITY_POINT_PROPERTY_NAME] =
          await this.getDataQualityPointByMoPlan(step?.qcCriteriaId);

        // Map dữ liệu trong QualityPlanBom
        step[QualityPlanService.QUALITY_PLAN_BOM_PROPERTY_NAME] =
          await this.getDataQualityPlanBom(
            qualityPlanBoms,
            createKeyBomTree,
            bomIdOfPlanBom,
            producingStepId,
          );

        const workOrders = producingStep?.workOrders;
        const workOrder = workOrders ? workOrders[0] : null;

        let actualQuantity = 0; // Là số lượng sản xuất + số lượng đã sửa
        let qcPassQuantity = 0; // Số lượng đạt
        let qcRejectQuantity = 0; // Số lượng lỗi hiện tại - hay số lượng lỗi còn lại
        let repairQuantity = 0; // Số lượng sửa
        let errorQuantity = 0; // tổng số lương lỗi của wo

        if (workOrder) {
          qcPassQuantity = workOrder?.qcPassQuantity
            ? Number(workOrder.qcPassQuantity)
            : 0;
          qcRejectQuantity = workOrder?.qcRejectQuantity
            ? Number(workOrder.qcRejectQuantity)
            : 0;
          actualQuantity = workOrder?.actualQuantity
            ? Number(workOrder.actualQuantity)
            : 0;
          repairQuantity = workOrder?.repairQuantity
            ? Number(workOrder.repairQuantity)
            : 0;
          errorQuantity = workOrder?.errorQuantity
            ? Number(workOrder.errorQuantity)
            : 0;
        }

        const qcDoneQuantity = qcPassQuantity + errorQuantity; // Số lượng đã QC
        const qcNeedQuantity = actualQuantity - qcDoneQuantity; // Số lượng cần QC

        step[QualityPlanService.NEED_QC_QUANTITY] =
          qcNeedQuantity < 0 ? 0 : qcNeedQuantity;
        step[QualityPlanService.DONE_QC_QUANTITY] = qcDoneQuantity;
        step[QualityPlanService.PASS_QC_QUANTITY] = qcPassQuantity;

        step[QualityPlanService.ERROR_REPORT_IDS] = errorReportId
          ? errorReportId
          : [];
      }

      const subBom = bom?.subBom;

      if (subBom && subBom.length > 0)
        await this.mapBomPlanDetail(subBom, qualityPlanBoms, createKeyBomTree);
    }
  }

  // Hình thức QC TODO
  qualityPointFormat(qualityPoint: QualityPoint) {
    let formalityRate: number;
    const qualityPointFormality = qualityPoint ? qualityPoint.formality : null;
    const qualityPointQuantity =
      qualityPoint && (qualityPoint.quantity || qualityPoint.quantity === 0)
        ? qualityPoint.quantity
        : null;

    if (qualityPointFormality !== null) {
      if (qualityPointFormality == Formality.Fully) {
        formalityRate = 1;
      } else if (
        qualityPointFormality == Formality.Partly &&
        qualityPointQuantity !== null
      ) {
        formalityRate = qualityPoint.quantity / 100;
      } else {
        formalityRate = null;
      }
    } else {
      formalityRate = null;
    }

    let numberOfTime: number;
    if (qualityPoint && qualityPoint.numberOfTime === NumberOfTime.OneTimes) {
      numberOfTime = 1;
    } else if (
      qualityPoint &&
      qualityPoint.numberOfTime === NumberOfTime.TwoTimes
    ) {
      numberOfTime = 2;
    } else {
      numberOfTime = null;
    }

    return { formalityRate, numberOfTime };
  }

  private async checkUnique(id: number, qualityPlanDto: any): Promise<string> {
    const existedRecordByCode =
      await this.qualityPlanRepository.getExistedRecord(id, qualityPlanDto);
    const msg = await this.i18n.translate('error.DB_RECORD_EXISTED');

    if (existedRecordByCode) {
      return stringFormat(msg, QUALITY_PLAN_DB.CODE.COL_NAME);
    }

    return null;
  }

  public async getListOrderByQualityPlanIOqc(
    request: GetListOrderByQualityPlanIOqcRequestDto,
  ): Promise<any> {
    const result = await this.saleService.getListOrderByQualityPlanIOqc(
      request,
    );

    if (!result) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData([])
        .build();
    }

    const response = plainToClass(IoqcOrderResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  // Lấy dữ liệu xưởng từ PLAN màn list plan
  public async qualityPlanGetListWorkCenterSchedule(
    request: QualityPlanQcWcRequestDto,
  ): Promise<any> {
    const { id, keyword } = request;
    const response =
      await this.produceService.qualityPlanGetListWorkCenterSchedule(id);

    if (isEmpty(response)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    let result = response?.data;

    if (!isEmpty(keyword)) {
      result = result.filter((x) =>
        x?.id?.toString()?.includes(keyword.trim()),
      );
    }
    // Check owner permission for FE
    const woIds = [];
    result.forEach((item) => {
      if (!isEmpty(item.workOrder) && !woIds.includes(item.workOrder.id)) {
        woIds.push(item.workOrder.id);
      }
    });

    const qcPlanUserCanEditByWo =
      await this.workCenterPlanQcShiftRepository.getQualityPlanBomByUserAndWo(
        woIds,
        request.userId,
      );
    const isQcEmployeeRole = checkQcEmployeeRole(request.user);
    if (isQcEmployeeRole) {
      if (!isEmpty(qcPlanUserCanEditByWo)) {
        result.forEach((item) => {
          item.currentUserCanEdit = true;
          const qcPlanFilter = qcPlanUserCanEditByWo.filter(
            (x) => x.workOrderId === item.workOrder.id,
          );
          if (isEmpty(qcPlanFilter)) {
            item.currentUserCanEdit = false;
          }
        });
      } else {
        result.forEach((item) => {
          item.currentUserCanEdit = false;
        });
      }
    } else {
      result.forEach((item) => {
        item.currentUserCanEdit = true;
      });
    }

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }

  // Detail Daily Plan WC
  public async qualityPlanGetWorkCenterScheduleDetail(
    payload: any,
  ): Promise<any> {
    const { id, workOrderId, workCenterId } = payload;

    // lấy dữ liệu WC từ Mes
    const result =
      await this.produceService.qualityPlanGetWorkCenterScheduleDetail(payload);

    if (isEmpty(result)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.NOT_FOUND_WC_SCHEDULE_DETAIL'),
        )
        .build();
    }

    // DATA kế hoạch cho xưởng MES
    const workCenterData = result?.data?.workCenter;
    const workOrderScheduleDetailData = result?.data?.workOrderScheduleDetail;

    if (isEmpty(workCenterData)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.WORK_CENTER_NOT_FOUND'))
        .build();
    }

    if (isEmpty(workOrderScheduleDetailData)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.WORK_CENTER_SHIFT_NOT_FOUND'),
        )
        .build();
    }

    const workCenterDetail = {
      wcName: workCenterData?.name,
      leaderName: workCenterData?.leader?.username,
      members: workCenterData?.members.map((member) => {
        return {
          username: member.username,
        };
      }),
      status: workOrderScheduleDetailData?.status,
      planQuantity: Number(workOrderScheduleDetailData?.quantity),
    };

    // Kế hoạch sản xuất
    const workOrder = await this.produceService.workOrderDetail(workOrderId);

    if (isEmpty(workOrder)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.WORK_ORDER_NOT_FOUND'))
        .build();
    }

    const dataWc = result?.data;
    if (isEmpty(dataWc)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.DATA_PLAN_WC_MES_NOT_FOUND'),
        )
        .build();
    }

    // DATA kế hoạch xưởng MES
    const workCenterScheduleDetails = dataWc?.workCenterScheduleDetails;
    if (isEmpty(workCenterScheduleDetails)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.DATA_PLAN_WC_QMSX_NOT_FOUND'),
        )
        .build();
    }

    const dayInShiftWc = workCenterScheduleDetails.map((item) => {
      const quantityOfShift = item?.scheduleShiftDetails?.length;
      const executionDay = moment(item?.executionDay)
        .tz(TIME_ZONE_VN)
        .startOf('day')
        .format();

      let index = 1;
      const scheduleShiftDetails = item?.scheduleShiftDetails?.map((val) => {
        const numberOfShift = index;
        index++;
        return {
          numberOfShift: numberOfShift,
          planQuantity: val?.quantity,
          actualQuantity: val?.actualQuantity,
          moderationQuantity: val?.moderationQuantity,
        };
      });

      return {
        quantityOfShift: quantityOfShift,
        executionDay: executionDay,
        scheduleShiftDetails: scheduleShiftDetails,
      };
    });

    const totalQuantityWc = workCenterScheduleDetails.reduce((x, y) => {
      const scheduleShiftDetails = y?.scheduleShiftDetails;
      for (let i = 0; i < scheduleShiftDetails?.length; i++) {
        const scheduleShiftDetail = scheduleShiftDetails[i];
        if (isEmpty(x[i])) {
          x[i] = {
            totalPlanQuantity: scheduleShiftDetail?.quantity,
            totalActualQuantity: scheduleShiftDetail?.actualQuantity,
            totalModerationQuantity: scheduleShiftDetail?.moderationQuantity,
          };
        } else {
          x[i] = {
            totalPlanQuantity:
              x[i]?.totalPlanQuantity + scheduleShiftDetail?.quantity,
            totalActualQuantity:
              x[i]?.totalActualQuantity + scheduleShiftDetail?.actualQuantity,
            totalModerationQuantity:
              x[i]?.totalModerationQuantity +
              scheduleShiftDetail?.moderationQuantity,
          };
        }
      }
      return x;
    }, []);

    // DATA kế hoạch qc wc plan default
    let defaultScheduleQcDetails = dataWc?.defaultScheduleQcDetails;
    let isDefault = true;

    const params = {
      workOrderId: workOrderId,
      workCenterId: workCenterId,
    };

    const workCenterPlanQcShift =
      await this.workCenterPlanQcShiftService.workCenterPlanQcShiftByWoIdAndWcId(
        params,
      );
    if (workCenterPlanQcShift.statusCode == ResponseCodeEnum.SUCCESS) {
      defaultScheduleQcDetails = workCenterPlanQcShift?.data?.workInShifts;
      isDefault = false;
    }

    if (isEmpty(defaultScheduleQcDetails)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.WORK_IN_SHIFT_NOT_FOUND'))
        .build();
    }

    const dayInShiftPlanQc = defaultScheduleQcDetails.map((item) => {
      const quantityOfShift = item?.scheduleShiftDetails?.length;
      const executionDay = moment(item?.executionDay)
        .tz(TIME_ZONE_VN)
        .startOf('day')
        .format();
      let index = 1;
      const scheduleShiftDetails = item?.scheduleShiftDetails?.map((val) => {
        const numberOfShift = isDefault ? index : val?.numberOfShift;
        index++;

        const planQuantity = isDefault ? val?.quantity : val?.planQuantity;
        const actualQuantity = isDefault ? 0 : val?.actualQuantity;
        const moderationQuantity = val?.moderationQuantity;

        return {
          numberOfShift: numberOfShift,
          planQuantity: planQuantity,
          actualQuantity: actualQuantity,
          moderationQuantity: moderationQuantity,
        };
      });

      return {
        quantityOfShift: quantityOfShift,
        executionDay: executionDay,
        scheduleShiftDetails: scheduleShiftDetails,
      };
    });

    const totalQuantityQcPlan = defaultScheduleQcDetails.reduce((x, y) => {
      const scheduleShiftDetails = y?.scheduleShiftDetails;
      for (let i = 0; i < scheduleShiftDetails?.length; i++) {
        const scheduleShiftDetail = scheduleShiftDetails[i];
        const planQuantity = isDefault
          ? scheduleShiftDetail?.quantity
          : scheduleShiftDetail?.planQuantity;
        const actualQuantity = scheduleShiftDetail?.actualQuantity;
        const moderationQuantity = scheduleShiftDetail?.moderationQuantity;

        if (isEmpty(x[i])) {
          x[i] = {
            totalPlanQuantity: planQuantity,
            totalActualQuantity: actualQuantity,
            totalModerationQuantity: moderationQuantity,
          };
        } else {
          x[i] = {
            totalPlanQuantity: x[i]?.totalPlanQuantity + planQuantity,
            totalActualQuantity: x[i]?.totalActualQuantity + actualQuantity,
            totalModerationQuantity:
              x[i]?.totalModerationQuantity + moderationQuantity,
          };
        }
      }
      return x;
    }, []);

    // DATA kế hoạch cho xưởng QMSx PLAN TIME-LINE
    const entity = await this.qualityPlanRepository.findOneById(id);

    if (isEmpty(entity)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.QUALITY_PLAN_NOT_FOUND'))
        .build();
    }

    const qualityPlan = await this.qualityPlanRepository.getDetail(entity);
    const qualityPlanBoms = qualityPlan?.qualityPlanDetail?.qualityPlanBoms;

    if (isEmpty(qualityPlanBoms)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.QUALITY_PLAN_BOM_NOT_FOUND'),
        )
        .build();
    }

    const timeOfPlanQc = qualityPlanBoms
      .filter((item) => item.workOrderId == workOrderId)
      .map((item) => {
        return {
          planFrom: moment(item?.planFrom)
            .tz(TIME_ZONE_VN)
            .startOf('day')
            .format(),
          planTo: moment(item?.planTo).tz(TIME_ZONE_VN).startOf('day').format(),
        };
      })[0];

    if (isEmpty(timeOfPlanQc)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.PRODUCING_STEP_NOT_QC'))
        .build();
    }

    const timeLinePlanQc = timeOfPlanQc
      ? timeOfPlanQc
      : { planFrom: null, planTo: null };

    const timeLineWc = {
      planFrom: moment(workOrder?.data?.planFrom)
        .tz(TIME_ZONE_VN)
        .startOf('day')
        .format(),
      planTo: moment(workOrder?.data?.planTo)
        .tz(TIME_ZONE_VN)
        .startOf('day')
        .format(),
    };

    // MAP Dữ liệu ngày rỗng
    if (timeLineWc?.planFrom > timeOfPlanQc?.planTo) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.ERROR_TIME_QC_PLAN'))
        .build();
    }

    const maxDate =
      timeLineWc?.planTo > timeOfPlanQc?.planTo
        ? timeLineWc?.planTo
        : timeOfPlanQc?.planTo;
    const minDate = timeLineWc?.planFrom;

    if (!maxDate || !minDate) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.ERROR_TIME_QC_PLAN'))
        .build();
    }

    const timeLines = enumerateDaysBetweenDates(minDate, maxDate);
    const listQuantityOfShift = dayInShiftPlanQc.map((x) => x.quantityOfShift);
    if (isEmpty(listQuantityOfShift)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.WORK_IN_SHIFT_NOT_FOUND'))
        .build();
    }

    const maxOfShift = Math.max(...listQuantityOfShift);
    const dayInShiftPlanQcMap = [];
    for (let i = 0; i < timeLines.length; i++) {
      const timeLine = timeLines[i];
      const scheduleShiftDetailMap = [];

      const dayInShiftPlanQcFilter = dayInShiftPlanQc.filter(
        (x) => x?.executionDay == timeLine,
      );
      if (dayInShiftPlanQcFilter.length > 0) {
        for (let j = 0; j < dayInShiftPlanQc.length; j++) {
          const dayInShiftPlanQcData = dayInShiftPlanQc[j];

          if (dayInShiftPlanQcData.executionDay == timeLine) {
            const scheduleShiftDetails =
              dayInShiftPlanQcData?.scheduleShiftDetails;

            for (let k = 0; k < maxOfShift; k++) {
              const scheduleShiftDetail = scheduleShiftDetails[k];

              if (scheduleShiftDetail) {
                scheduleShiftDetailMap.push(scheduleShiftDetail);
              } else {
                scheduleShiftDetailMap.push({
                  numberOfShift: k + 1,
                  planQuantity: 0,
                  actualQuantity: 0,
                  moderationQuantity: 0,
                });
              }
            }
          }
        }
      } else {
        for (let l = 0; l < maxOfShift; l++) {
          scheduleShiftDetailMap.push({
            numberOfShift: l + 1,
            planQuantity: 0,
            actualQuantity: 0,
            moderationQuantity: 0,
          });
        }
      }

      dayInShiftPlanQcMap.push({
        quantityOfShift: maxOfShift,
        executionDay: timeLine,
        scheduleShiftDetails: scheduleShiftDetailMap,
      });
    }

    const qualityPlanBom =
      await this.qualityPlanBomRepository.findOneByCondition({
        workOrderId: workOrderId,
      });

    if (isEmpty(qualityPlanBom)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.QUALITY_PLAN_BOM_NOT_FOUND'),
        )
        .build();
    }

    const planQcQuantityBom = qualityPlanBom?.planQcQuantity
      ? Number(qualityPlanBom?.planQcQuantity)
      : 0;

    const dataResponse = {
      workOrderId: workOrderId,
      workCenterId: workCenterId,
      planQcQuantity: planQcQuantityBom,
      workCenterDetail: workCenterDetail,
      workInShiftWc: {
        timeLine: timeLineWc,
        dayInShift: dayInShiftWc,
        totalQuantity: totalQuantityWc,
      },
      workInShiftQcPlan: {
        isDefault: isDefault,
        timeLineWc: timeLineWc,
        timeLine: timeLinePlanQc,
        dayInShift: dayInShiftPlanQcMap,
        totalQuantity: totalQuantityQcPlan,
      },
    };

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(dataResponse)
      .build();
  }

  public async getListInProgressInputPlans(
    request: GetDashboardIoQcProgressRequestDto,
    type: TransactionHistoryIOqcTypeEnum,
  ): Promise<any> {
    const response =
      await this.qualityPlanRepository.getListInProgressInputPlans(
        request,
        type,
      );
    const result = plainToClass(
      GetListInProgressInputPlansResponseDto,
      response,
      { excludeExtraneousValues: true },
    );

    return result;
  }

  public async getListProducingStepsQcPlans(
    request: GetDashboardFinishedItemProgressRequestDto,
  ): Promise<any> {
    const response =
      await this.qualityPlanRepository.getListInProgressProducingStepQcPlans(
        request,
      );
    const result = plainToClass(
      GetListInProgressProducingStepsPlansResponseDto,
      response,
    );
    return result;
  }
}
