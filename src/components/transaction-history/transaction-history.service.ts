import { Inject, Injectable } from '@nestjs/common';
import { ResponsePayload } from '@utils/response-payload';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { plainToClass } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';
import { TransactionHistoryServiceInterface } from '@components/transaction-history/interface/transaction-history.service.interface';
import { ProducingStepsTransactionHistoryResponseDto } from '@components/transaction-history/dto/response/producing-steps-transaction-history.response.dto';
import { GetListProducingStepsTransactionHistoryRequestDto } from '@components/transaction-history/dto/request/get-list-producing-steps-transaction-history.request.dto';
import { GetListProducingStepsTransactionHistoryResponseDto } from '@components/transaction-history/dto/response/get-list-producing-steps-transaction-history.response.dto';
import { ProduceServiceInterface } from '@components/produce/interface/produce.service.interface';
import { ProducingStepsTransactionHistoryDetailResponseDto } from '@components/transaction-history/dto/response/producing-steps-transaction-history-detail.response.dto';
import { CreateProducingStepsTransactionHistoryRequestDto } from '@components/transaction-history/dto/request/create-producing-steps-transaction-history-request.dto';
import { ApiError } from '@utils/api.error';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, In } from 'typeorm';
import { TransactionHistoryRepositoryInterface } from '@components/transaction-history/interface/transaction-history.repository.interface';
import {
  IS_QC_NEEDED_ENUM,
  TRANSACTION_HISTORY,
  TransactionHistoryIOqcTypeEnum,
  TransactionHistoryItemTypeEnum,
  TransactionHistoryLogTimeStatusEnum,
  TransactionHistoryLogTimeTypeEnum,
  TransactionHistoryProducingStepsQcTypes,
  TransactionHistoryTypeEnum,
} from '@components/transaction-history/transaction-history.constant';
import {
  TransactionHistory,
  TransactionHistoryNumberOfTimeQc,
} from '@entities/transaction-history/transaction-history.entity';
import { GetWOSummaryScanRequestDto } from '@components/transaction-history/dto/request/get-wo-summary-scan-request.dto';
import { GetWoSummaryScanResponseDto } from '@components/transaction-history/dto/response/get-wo-summary-scan-response.dto';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { QualityPointServiceInterface } from '@components/quality-point/interface/quality-point.service.interface';
import { QualityProgressServiceInterface } from '@components/quality-progress/interface/quality-progress.service.interface';
import { GetMoListRequestDto } from '@components/produce/dto/request/get-mo-list-request.dto';
import { GetMoListResponseDto } from '@components/produce/dto/response/get-mo-list-response.dto';
import { GetPlanItemMoListResponseDto } from '@components/produce/dto/response/get-plan-item-mo-list-response.dto';
import { GetPlanItemMoListRequestDto } from '@components/produce/dto/request/get-plan-item-mo-list-request.dto';
import { CreateProducingStepsTransactionHistoryResponseDto } from '@components/transaction-history/dto/response/create-producing-steps-transaction-history-response.dto';
import { GetMoItemDetailRequestDto } from '@components/produce/dto/request/get-mo-item-detail-request.dto';
import { GetMoItemDetailResponseDto } from '@components/produce/dto/response/get-mo-item-detail-response.dto';
import { SaleServiceInterface } from '@components/sale/interface/sale.service.interface';
import { GetListIoqcOrderRequestDto } from '@components/item/dto/request/get-list-ioqc-order.request.dto';
import { GetListIoqcOrderResponseDto } from '@components/item/dto/response/get-list-ioqc-order.response.dto';
import { IoqcOrderResponseDto } from '@components/item/dto/response/ioqc-order.response.dto';
import { GetListIoqcWarehouseByOrderRequestDto } from '@components/item/dto/request/get-list-ioqc-warehouse-by-order.request.dto';
import { GetListIoqcWarehouseByOrderResponseDto } from '@components/item/dto/response/get-list-ioqc-warehouse-by-order.response.dto';
import { IoqcWarehouseByOrderResponseDto } from '@components/item/dto/response/ioqc-warehouse-by-order.response.dto';
import { GetListIoqcItemByWarehouseAndOrderRequestDto } from '@components/item/dto/request/get-list-ioqc-item-by-warehouse-and-order.request.dto';
import { GetListIoqcItemByWarehouseAndOrderResponseDto } from '@components/item/dto/response/get-list-ioqc-item-by-warehouse-and-order.response.dto';
import { IoqcItemByWarehouseAndOrderResponseDto } from '@components/item/dto/response/ioqc-item-by-warehouse-and-order-response.dto';
import { PagingResponse } from '@utils/paging.response';
import { STAGE_VALUE, STAGES_OPTION } from '@constant/qc-stage.constant';
import { TransactionHistoryListRequestDto } from './dto/request/transaction-history-list.request.dto';
import { BASE_ENTITY_CONST } from '../../constant/entity.constant';
import { DEFAULT_INIT_PAGE_SIZE } from '../../constant/common';
import {
  checkUserRoleSettings,
  extractWorkOrderIdFromQrCode,
  plus,
  minus,
  validateInputQcQuantity,
} from '@utils/common';
import {
  DetailTransactionHistoryForAppResponseDto,
  TransactionHistoryForAppResponseDto,
} from '@components/transaction-history/dto/response/transaction-history-for-app.response.dto';
import { ItemServiceInterface } from '@components/item/interface/item.service.interface';
import { isEmpty, uniq } from 'lodash';
import { ProducingStepsTransactionHistoryNotReportedResponseDto } from '@components/transaction-history/dto/response/producing-steps-transaction-history-not-reported.response.dto';
import { UpdateWOQcQuantityRequestDto } from '@components/produce/dto/request/update-wo-qc-quantity.request.dto';
import { GetListQcTransactionInitDataRequestDto } from '@components/transaction-history/dto/request/get-list-qc-transaction-init-data.request.dto';
import { ItemBarcodeTypeEnum } from '@components/item/item.constant';
import { QcProgressScanQrRequestDto } from '@components/quality-progress/dto/request/qc-progress-scan-qr.request.dto';
import { TransactionHistoryForWebResponseDto } from '@components/transaction-history/dto/response/transaction-history-for-web.response.dto';
import { GetListQcTransactionInitDataForWebRequestDto } from '@components/transaction-history/dto/request/get-list-qc-transaction-init-data-for-web.request.dto';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { CreateTransactionHistoryLogTimeRequestDto } from '@components/transaction-history/dto/request/create-transaction-history-log-time.request.dto';
import { TransactionHistoryLogTimeRepositoryInterface } from '@components/transaction-history/interface/transaction-history-log-time.repository.interface';
import { UpdateTransactionHistoryLogTimeRequestDto } from '@components/transaction-history/dto/request/update-transaction-history-log-time.request.dto';
import { IOqcTransactionHistoryNotReportedResponseDto } from '@components/transaction-history/dto/response/ioqc-transaction-history-not-reported.response.dto';
import { TransactionHistoryLogTimeAdditionRepositoryInterface } from '@components/transaction-history/interface/transaction-history-log-time-addition-repository.interface';
import { CreateTransactionHistoryLogTimeAdditionRequestDto } from '@components/transaction-history/dto/request/create-transaction-history-log-time-addition.request.dto';
import { GetProduceStepQcLogTimeDetailResponseDto } from '@components/transaction-history/dto/response/get-produce-step-qc-log-time-detail.response.dto';
import { CreateTransactionHistoryLogTimeResponseDto } from '@components/transaction-history/dto/response/create-transaction-history-log-time.response.dto';
import { CreateTransactionHistoryLogTimeAdditionResponseDto } from '@components/transaction-history/dto/response/create-transaction-history-log-time-addition.response.dto';
import { UpdateTransactionHistoryLogTimeResponseDto } from '@components/transaction-history/dto/response/update-transaction-history-log-time.response.dto';
import { UpdateTransactionHistoryLogTimeAdditionRequestDto } from '@components/transaction-history/dto/request/update-transaction-history-log-time-addition.request.dto';
import { UpdateTransactionHistoryLogTimeAdditionResponseDto } from '@components/transaction-history/dto/response/update-transaction-history-log-time-addition.response.dto';
import { ErrorReportRepositoryInterface } from '@components/error-report/interface/error-report.repository.interface';
import { ActionCategoryServiceInterface } from '@components/action-category/interface/action-category.service.interface';
import { CreateInputProducingStepsTransactionHistoryRequestDto } from '@components/transaction-history/dto/request/create-input-producing-steps-transaction-history.request.dto';
import { TransactionHistoryProduceStepRepositoryInterface } from '@components/transaction-history/interface/transaction-history-produce-step-repository.interface';
import { UpdateWoMaterialInputQcQuantityRequestDto } from '@components/produce/dto/request/update-wo-material-input-qc-quantity.request.dto';
import { UpdateWoPreviousBomInputQcQuantityRequestDto } from '@components/produce/dto/request/update-wo-previous-bom-input-qc-quantity.request.dto';
import { QualityPointRepositoryInterface } from '@components/quality-point/interface/quality-point.repository.interface';
import { OrderTypeProductionOrderEnum } from '@components/sale/sale.constant';
import { TypeReport } from '@components/report/report.constant';
import { GetDashboardIoQcProgressRequestDto } from '@components/dashboard/dto/request/get-dashboard-io-qc-progress-request.dto';
import {
  QUALITY_POINT_FORMALITY,
  STAGE_MAP,
} from '@components/quality-point/quality-point.constant';
import { WorkCenterPlanQcShiftRepositoryInterface } from '@components/work-center-plan-qc-shift/interface/work-center-plan-qc-shift.repository.interface';
import { WorkCenterPlanQcShiftServiceInterface } from '@components/work-center-plan-qc-shift/interface/work-center-plan-qc-shift.service.interface';
import { QualityPlanRepositoryInterface } from '@components/quality-plan/interface/quality-plan.repository.interface';
import { QCPlanStatus } from '@entities/quality-plan/quality-plan.entity';
import { QualityPlanServiceInterface } from '@components/quality-plan/interface/quality-plan.service.interface';
import { GetNotFinishedQcLogTimeResponseDto } from '@components/transaction-history/dto/response/get-not-finished-qc-log-time.response.dto';
import { ValidateWcQcPlanForWorkOrderRequestDto } from '@components/transaction-history/dto/request/validate-wc-qc-plan-for-work-order.request.dto';
import { GetMaximumQcQuantityRequestDto } from '@components/transaction-history/dto/request/get-maximum-qc-quantity.request.dto';
import { GetMaximumQcQuantityResponseDto } from '@components/transaction-history/dto/response/get-maximum-qc-quantity.response.dto';
import { searchService, sortService, paginationService } from '@utils/common';
import { last } from 'rxjs/operators';
import { ManufacturingOrderFilterColumn } from '@components/produce/produce.constant';
import { GetListTransactionHistoryOverallRequestDto } from '@components/transaction-history/dto/request/get-list-transaction-history-overall.request.dto';
import { GetListTransactionHistoryOverallResponseDto } from '@components/transaction-history/dto/response/get-list-transaction-history-overall.response.dto';
import { TransactionHistoryOverallResponseDto } from '@components/transaction-history/dto/response/transaction-history-overall.response.dto';
import { IsEmpty } from 'class-validator';
import { QualityPlanBomRepositoryInterface } from '@components/quality-plan/interface/quality-plan-bom.repository.interface';
import { NumberOfTime } from '@entities/quality-point/quality-point.entity';
import { userStageNumberOfTimeQc } from '@entities/quality-plan/quality-plan-bom-quality-point-user.entity';
import { GetDashboardFinishedItemProgressRequestDto } from '@components/dashboard/dto/request/get-dashboard-finished-item-progress.request.dto';

const moment = extendMoment(Moment);

@Injectable()
export class TransactionHistoryService
  implements TransactionHistoryServiceInterface
{
  constructor(
    @Inject('SaleServiceInterface')
    private readonly saleService: SaleServiceInterface,

    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceServiceInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,

    @Inject('TransactionHistoryRepositoryInterface')
    private readonly transactionHistoryRepository: TransactionHistoryRepositoryInterface,

    @Inject('TransactionHistoryLogTimeRepositoryInterface')
    private readonly transactionHistoryLogTimeRepository: TransactionHistoryLogTimeRepositoryInterface,

    @Inject('QualityPointServiceInterface')
    private readonly qualityPointService: QualityPointServiceInterface,

    @Inject('QualityProgressServiceInterface')
    private readonly qualityProgressService: QualityProgressServiceInterface,

    @Inject('ItemServiceInterface')
    private readonly itemService: ItemServiceInterface,

    @Inject('TransactionHistoryLogTimeAdditionRepositoryInterface')
    private readonly transactionHistoryLogTimeAdditionRepository: TransactionHistoryLogTimeAdditionRepositoryInterface,

    @Inject('ErrorReportRepositoryInterface')
    private readonly errorReportRepository: ErrorReportRepositoryInterface,

    @Inject('ActionCategoryServiceInterface')
    private readonly actionCategoryService: ActionCategoryServiceInterface,

    @Inject('TransactionHistoryProduceStepRepositoryInterface')
    private readonly transactionHistoryProduceStepRepository: TransactionHistoryProduceStepRepositoryInterface,

    @Inject('QualityPointRepositoryInterface')
    private readonly qualityPointRepository: QualityPointRepositoryInterface,

    @Inject('WorkCenterPlanQcShiftRepositoryInterface')
    private readonly workCenterPlanQcShiftRepository: WorkCenterPlanQcShiftRepositoryInterface,

    @Inject('WorkCenterPlanQcShiftServiceInterface')
    private readonly workCenterPlanQcShiftService: WorkCenterPlanQcShiftServiceInterface,

    @Inject('QualityPlanRepositoryInterface')
    private readonly qualityPlanRepository: QualityPlanRepositoryInterface,

    @Inject('QualityPlanServiceInterface')
    private readonly qualityPlanService: QualityPlanServiceInterface,

    @Inject('QualityPlanBomRepositoryInterface')
    private readonly qualityPlanBomRepository: QualityPlanBomRepositoryInterface,

    private readonly i18n: I18nService,

    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  public async createProducingStepTransactionHistory(
    request: CreateProducingStepsTransactionHistoryRequestDto,
  ): Promise<ResponsePayload<any>> {
    const {
      numberOfTime,
      numberOfTimeQc,
      orderId,
      createdByUserId,
      note,
      qcPassQuantity,
      qcRejectQuantity,
      checkListDetails,
      qcQuantity,
      workCenterId,
      lotNumber,
      logTimeId,
      type,
      totalPlanQuantity,
      producedQuantity,
      totalQcRejectQuantity,
      totalUnQcQuantity,
      totalQcQuantity,
      totalQcPassQuantity,
      qcQuantityRule,
      qualityPointId,
    } = request;

    // check if current WO: user is assigned or not
    const isAdminOrLeader = checkUserRoleSettings(request.user);
    if (!isAdminOrLeader) {
      const qcPlans =
        await this.qualityPlanRepository.findProduceStepsQualityPlansByUser(
          createdByUserId,
        );

      if (isEmpty(qcPlans)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(
            await this.i18n.translate(
              'error.MO_WITH_QC_PLAN_USER_ASSIGN_NOT_FOUND',
            ),
          )
          .build();
      }
      const filterWoIds = [];
      qcPlans.forEach((item) => {
        if (!isEmpty(item.workOrders)) {
          item.workOrders.forEach((wo) => {
            if (!filterWoIds.includes(wo.workOrderId)) {
              filterWoIds.push(wo.workOrderId);
            }
          });
        }
      });
      const woId = orderId;
      if (!filterWoIds.includes(woId)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.WO_NOT_ASSIGN_TO_USER'))
          .build();
      }
    }

    // Validate input QC quantity
    const checkInputQcQuantity = validateInputQcQuantity({
      qcQuantity: qcQuantity,
      qcPassQuantity: qcPassQuantity,
      qcRejectQuantity: qcRejectQuantity,
      totalUnQcQuantity: totalUnQcQuantity,
      checkListDetails: checkListDetails,
    });
    if (!checkInputQcQuantity) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.QC_QUANTITY_INVALID'))
        .build();
    }

    const workOrder = await this.produceService.getWorkOrderById(orderId);
    if (!workOrder) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.WORK_ORDER_NOT_FOUND'))
        .build();
    }

    if (type == STAGES_OPTION.OUTPUT_PRODUCTION) {
      // validate produce QC by QC plans
      const workCenterPlanQcShift =
        await this.workCenterPlanQcShiftRepository.findOneByCondition({
          workOrderId: orderId,
          workCenterId: workCenterId,
        });
      if (isEmpty(workCenterPlanQcShift)) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate(
            'error.WORK_CENTER_PLAN_QC_SHIFT_NOT_FOUND',
          ),
        ).toResponse();
      }
    }

    // Validate input QC quantity by awaiting Error reports
    const maximumQcQuantity =
      await this.calculateMaximumQcQuantityByAwaitingErrorReports(
        orderId,
        workCenterId,
        totalUnQcQuantity,
        type,
      );
    if (maximumQcQuantity < qcQuantity) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.QC_QUANTITY_INVALID_NEED'),
        )
        .build();
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const itemId = workOrder.bom?.item?.id;
      const moId = workOrder.mo?.id;
      const producingStepId = workOrder.producingStep?.id;
      // create transactionHistoryEntity
      const transactionHistoryEntity =
        this.transactionHistoryRepository.createEntity({
          orderId: orderId,
          createdByUserId: createdByUserId,
          note: note,
          type: type,
          qcPassQuantity: qcPassQuantity,
          qcRejectQuantity: qcRejectQuantity,
          qcQuantity: qcQuantity,
          workCenterId: workCenterId,
          consignmentName: lotNumber,
          qcQuantityRule: qcQuantityRule,
          itemId: itemId,
          itemType: TransactionHistoryItemTypeEnum.OutputQcItem,
          qualityPointId: qualityPointId,
          numberOfTimeQc: numberOfTimeQc,
          moId: moId,
          producingStepId: producingStepId,
        });

      // Assign log time entity to transaction history entity
      const logTimeEntity =
        await this.transactionHistoryLogTimeRepository.findOneByCondition({
          id: logTimeId,
        });
      if (isEmpty(logTimeEntity)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.LOG_TIME_NOT_FOUND'))
          .build();
      }

      transactionHistoryEntity.transactionHistoryLogTime = logTimeEntity;
      await queryRunner.manager.save(
        TransactionHistory,
        transactionHistoryEntity,
      );

      // Create transaction history produce steps details log
      const transactionHistoryProduceStepEntity =
        this.transactionHistoryProduceStepRepository.createEntity({
          totalPlanQuantity: totalPlanQuantity,
          producedQuantity: producedQuantity,
          totalQcRejectQuantity: totalQcRejectQuantity,
          totalUnQcQuantity: totalUnQcQuantity,
          totalQcQuantity: totalQcQuantity,
          totalQcPassQuantity: totalQcPassQuantity,
        });
      transactionHistoryProduceStepEntity.transactionHistory =
        transactionHistoryEntity;
      await queryRunner.manager.save(transactionHistoryProduceStepEntity);

      // update new code
      transactionHistoryEntity.code =
        TRANSACTION_HISTORY.CODE_PREFIX + transactionHistoryEntity.id;
      await queryRunner.manager.save(
        TransactionHistory,
        transactionHistoryEntity,
      );

      // create transactionHistoryCheckListDetailEntity
      const checkListDetailEntities = request.checkListDetails.map(
        (checkListDetail) =>
          this.transactionHistoryRepository.createTransactionHistoryCheckListDetailEntity(
            {
              checkListDetailId: checkListDetail.id,
              transactionHistoryId: transactionHistoryEntity.id,
              qcPassQuantity: checkListDetail.qcPassQuantity,
              qcRejectedQuantity: checkListDetail.qcRejectQuantity,
            },
          ),
      );
      await queryRunner.manager.save(checkListDetailEntities);

      /*
        Update số lượng QC cho bên MESx nếu số lương lỗi(qcRejectQuantity) = 0
        Kiểm tra Transaction thực hiện qc 2 lần or 1 lần
      */

      let isUpdateData = false;
      let isBack = false;

      if (numberOfTime == NumberOfTime.OneTimes + 1 && qcRejectQuantity == 0) {
        isUpdateData = true;
        isBack = true;
      } else if (
        numberOfTime == NumberOfTime.TwoTimes + 1 &&
        numberOfTimeQc == TransactionHistoryNumberOfTimeQc.theSecondTime &&
        qcRejectQuantity == 0
      ) {
        isUpdateData = true;
        isBack = true;
      } else if (
        numberOfTime == NumberOfTime.TwoTimes + 1 &&
        numberOfTimeQc == TransactionHistoryNumberOfTimeQc.theFirstTime
      ) {
        isBack = true;
      }

      // Update số lượng QC vào PLAN Xưởng QMSx
      if (isUpdateData && type == STAGES_OPTION.OUTPUT_PRODUCTION) {
        const updatedWorkCenterPlanQcShift =
          await this.workCenterPlanQcShiftService.updateWcPlanQc(
            transactionHistoryEntity,
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

        // Update trạng thái(Status) của QC Plan kế hoạch
        const workOrderId = transactionHistoryEntity?.orderId;
        if (!workOrderId) {
          return new ApiError(
            ResponseCodeEnum.BAD_REQUEST,
            await this.i18n.translate('error.UPDATE_STATUS_PLAN_FAIL'),
          ).toResponse();
        }

        const qualityPlan = await this.qualityPlanRepository.findOneByCondition(
          {
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
          },
        );

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
      }

      // Gửi dữ liệu sang Mes để update WC + WO
      if (isUpdateData) {
        const updateResult = await this.updateWoQcQuantity(
          transactionHistoryEntity,
        );

        if (updateResult.statusCode !== ResponseCodeEnum.SUCCESS) {
          await queryRunner.rollbackTransaction();
          return new ApiError(
            ResponseCodeEnum.BAD_REQUEST,
            updateResult.message,
          ).toResponse();
        }
      }

      await queryRunner.commitTransaction();

      const response = plainToClass(
        CreateProducingStepsTransactionHistoryResponseDto,
        transactionHistoryEntity,
        { excludeExtraneousValues: true },
      );

      // isBack: Trở về màn hình kết thúc QC khi SL lỗi = 0 hoặc đang thực hiện QC lần 1 của công đoạn QC 2 lần.
      const responseWithIsBack = {
        isBack: isBack,
        ...response,
      };

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .withData(responseWithIsBack)
        .build();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CAN_NOT_CREATE'),
      ).toResponse();
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

  public async getListProducingStepsQCHistory(
    request: GetListProducingStepsTransactionHistoryRequestDto,
  ): Promise<
    ResponsePayload<GetListProducingStepsTransactionHistoryResponseDto | any>
  > {
    // get list QC from produce-service
    const { sort, keyword, filter, page, limit } = request;

    // FILTER MO
    let paramMoFilter: any;
    let woFiltersMo: any;
    let woFilterMoIds = [];

    const moIdFilter = filter?.find((item) => item.column == 'moId');
    const moCodeFilter = filter?.find((item) => item.column == 'moCode');
    const moNameFilter = filter?.find((item) => item.column == 'moName');

    const producingStepNameFilter = filter?.find(
      (item) => item.column == 'producingStepName',
    );

    if (moIdFilter || moCodeFilter || moNameFilter || producingStepNameFilter) {
      const paramFilterMo = [];
      for (let i = 0; i < filter.length; i++) {
        if (
          ['moId', 'moCode', 'moName', 'producingStepName'].includes(
            filter[i].column,
          )
        ) {
          paramFilterMo.push({
            column: filter[i].column,
            text: filter[i].text.trim(),
          });
        }
      }

      const paramMoFilter = {
        isGetAll: '1',
        filter: paramFilterMo,
      };

      woFiltersMo = await this.produceService.getWorkOrderByMoIdForWeb(
        paramMoFilter,
      );

      if (isEmpty(woFiltersMo)) {
        return new ResponseBuilder<PagingResponse>({
          items: [],
          meta: { total: 0, page: 0 },
        })
          .withCode(ResponseCodeEnum.SUCCESS)
          .build();
      }

      woFilterMoIds = !isEmpty(woFiltersMo) ? woFiltersMo.map((e) => e.id) : [];
    }

    // KEYWORD MO
    let woFilterKwIds = [];
    let itemFilterKwIds = [];
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

    // ITEM NAME
    let filterItemIds = [];
    const itemNameFilter = filter?.find(
      (item) => item.column == 'parentBomName',
    );

    if (itemNameFilter) {
      const paramItemFilter = {
        isGetAll: '1',
        user: request.user,
        filter: [
          {
            column: 'name',
            text: itemNameFilter.text.trim(),
          },
        ],
      };

      const dataFilterItems = await this.itemService.getItemByConditions(
        paramItemFilter,
      );

      if (isEmpty(dataFilterItems)) {
        return new ResponseBuilder<PagingResponse>({
          items: [],
          meta: { total: 0, page: 0 },
        })
          .withCode(ResponseCodeEnum.SUCCESS)
          .build();
      }

      filterItemIds = dataFilterItems.map((item) => item.id);
    }

    // QUERY TRANSACTION HISTORY
    let { result, count } =
      await this.transactionHistoryRepository.getListProducingStepsQC(
        request,
        woFilterMoIds,
        woFilterKwIds,
        filterItemIds,
        itemFilterKwIds,
      );

    if (!result) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const woFiltersMoMap = await this.produceService.getWorkOrderByMoId(null);
    const workOrdersRaw = {};
    // map workOrder to workOrderRaw with work order id
    woFiltersMoMap.forEach((wo) => {
      workOrdersRaw[wo.id] = wo;
    });

    const itemIdList = [];
    const itemRaws = {};
    result?.forEach((item) => {
      // map workOrder to QC history
      item.workOrder = workOrdersRaw[item.workOrderId]
        ? workOrdersRaw[item.workOrderId]
        : {};
      if (!itemIdList.includes(item.itemId) && item.itemId) {
        itemIdList.push(item.itemId);
      }
    });

    // map result with item if type is input produce step QC
    const itemList = await this.itemService.getListByIDs(itemIdList);
    if (!isEmpty(itemList)) {
      itemList.forEach((item) => {
        itemRaws[item.id] = item;
      });
    }

    result = result?.reduce((x, y) => {
      const bomNameValue = y?.workOrder?.bom?.itemName
        ? y?.workOrder?.bom?.itemName
        : '';
      const parentBomNameValue = y?.workOrder?.bom?.parentBom?.itemName
        ? y?.workOrder?.bom?.parentBom?.itemName
        : '';

      const bomName = y?.workOrder?.bom?.parentBom?.itemName
        ? bomNameValue
        : '';
      const parentBomName = y?.workOrder?.bom?.parentBom?.itemName
        ? parentBomNameValue
        : bomNameValue;

      y.numberOfTime = y?.numberOfTime == NumberOfTime.TwoTimes ? 2 : 1;
      y.numberOfTimeQc = y?.numberOfTimeQc ? Number(y?.numberOfTimeQc) : null;
      y.numberOfTimeSearch = `${y?.numberOfTimeQc}/${y?.numberOfTime}`;

      x.push({
        moName: y?.workOrder?.mo?.name ? y.workOrder.mo.name : '',
        bomName: bomName,
        parentBomName: parentBomName,
        producingStepName: y?.workOrder?.producingStep?.name
          ? y.workOrder.producingStep.name
          : '',
        ...y,
      });

      return x;
    }, []);

    result?.forEach((item) => {
      const qcType = item.type ? parseInt(item.type) : item.type;
      if (qcType == TransactionHistoryTypeEnum.InputProducingStep) {
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

    if (isEmpty(result)) {
      return new ResponseBuilder<PagingResponse>({
        items: [],
        meta: { total: 0, page: 1 },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    }

    // SEARCH BY SERVICE
    const parentBomNameFilter = filter?.find(
      (item) => item.column == 'parentBomName',
    );
    const bomNameFilter = filter?.find((item) => item.column == 'bomName');

    if (!isEmpty(parentBomNameFilter) || !isEmpty(bomNameFilter)) {
      for (let i = 0; i < filter.length; i++) {
        if (['bomName', 'parentBomName'].includes(filter[i].column)) {
          const textSearch = filter[i].text;
          const columnSearch = filter[i].column;
          result = searchService(result, textSearch, columnSearch);
        }
      }

      count = result?.length;
    }

    // SORT BY SERVICE
    result = sortService(result, sort, [
      'moName',
      'parentBomName',
      'bomName',
      'producingStepName',
      'numberOfTimeSearch',
    ]);

    // PAGINATE
    if (page && limit) {
      result = paginationService(result, Number(page), Number(limit));
    }

    // mapping result to response DTO
    const response = plainToClass(
      ProducingStepsTransactionHistoryResponseDto,
      result,
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder<PagingResponse>({
      items: response,
      meta: { total: count, page: page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async getListTransactionHistoryIOqcForWeb(
    request: GetListQcTransactionInitDataRequestDto,
    type: number,
  ): Promise<ResponsePayload<PagingResponse>> {
    const { sort, page, limit, keyword, filter, user } = request;

    // SO PRO PO
    const filterOrderIds = [];
    const orderCodeFilter = filter?.find((item) => item.column == 'orderCode');
    const orderNameFilter = filter?.find((item) => item.column == 'orderName');

    let poIds = [],
      proIds = [],
      soIds = [];
    if (orderCodeFilter || orderNameFilter) {
      const paramFilterOrder = [];
      for (let i = 0; i < filter.length; i++) {
        if (['orderCode', 'orderName'].includes(filter[i].column)) {
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

      const params = {
        isGetAll: '1',
        user: user,
        filter: paramFilterOrder,
      };

      let dataPos, dataPros, dataSos;
      if (type == OrderTypeProductionOrderEnum.Input) {
        dataPos = await this.saleService.getPurchasedOrderByConditions(params);

        if (!isEmpty(dataPos)) {
          const codeText = params?.filter?.find((x) => x.column == 'code');
          if (!isEmpty(codeText)) {
            dataPos = dataPos.filter((x) => x.code === codeText?.text);
          }
        }

        params.filter.push({
          column: 'type',
          text: '0',
        });

        dataPros = await this.saleService.getProductionOrderByConditions(
          params,
        );

        if (!isEmpty(dataPros)) {
          const codeText = params?.filter?.find((x) => x.column == 'code');
          if (!isEmpty(codeText)) {
            dataPros = dataPros.filter((x) => x.code === codeText?.text);
          }
        }

        if (isEmpty(dataPos) && isEmpty(dataPros)) {
          return new ResponseBuilder<PagingResponse>({
            items: [],
            meta: { total: 0, page: 0 },
          })
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
        }

        if (!isEmpty(dataPos)) {
          poIds = dataPos.map((po) => po.id);
        }

        if (!isEmpty(dataPros)) {
          proIds = dataPros.map((pro) => pro.id);
        }
      }

      if (type == OrderTypeProductionOrderEnum.Output) {
        dataSos = await this.saleService.getSaleOrderExportByConditions(params);

        if (!isEmpty(dataSos)) {
          const codeText = params?.filter?.find((x) => x.column == 'code');
          if (!isEmpty(codeText)) {
            dataSos = dataSos.filter((x) => x.code === codeText?.text);
          }
        }

        params.filter.push({
          column: 'type',
          text: '1',
        });

        dataPros = await this.saleService.getProductionOrderByConditions(
          params,
        );

        if (!isEmpty(dataPros)) {
          const codeText = params?.filter?.find((x) => x.column == 'code');
          if (!isEmpty(codeText)) {
            dataPros = dataPros.filter((x) => x.code === codeText?.text);
          }
        }

        if (isEmpty(dataSos) && isEmpty(dataPros)) {
          return new ResponseBuilder<PagingResponse>({
            items: [],
            meta: { total: 0, page: 0 },
          })
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
        }

        if (!isEmpty(dataSos)) {
          soIds = dataSos.map((so) => so.id);
        }

        if (!isEmpty(dataPros)) {
          proIds = dataPros.map((pro) => pro.id);
        }
      }
    }

    // ITEM NAME
    let filterItemIds = [];
    const itemNameFilter = filter?.find((item) => item.column == 'itemName');
    const itemCodeFilter = filter?.find((item) => item.column == 'itemCode');

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

      const paramSearchItemMes = {
        isGetAll: '1',
        user: user,
        filter: paramFilterItem,
      };

      dataFilterItems = await this.itemService.getItemByConditions(
        paramSearchItemMes,
      );

      if (isEmpty(dataFilterItems)) {
        return new ResponseBuilder<PagingResponse>({
          items: [],
          meta: { total: 0, page: 0 },
        })
          .withCode(ResponseCodeEnum.SUCCESS)
          .build();
      }

      filterItemIds = dataFilterItems.map((item) => item.id);
    }

    // STAGE
    const filterStageIds = [];
    const stageNameFilter = request.filter?.find(
      (item) => item.column === 'stageName',
    );

    if (!isEmpty(stageNameFilter)) {
      const stages = STAGE_VALUE;
      const valueStageNameFilter = stageNameFilter.text.trim();

      for (const stage of stages) {
        if (
          stage.text.toLowerCase().includes(valueStageNameFilter.toLowerCase())
        ) {
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

    // QUERY TRANSACTION HISTORY
    const { result, count } =
      await this.transactionHistoryRepository.getListTransactionHistoryIOqcForWeb(
        request,
        type,
        filterItemIds,
        filterStageIds,
        poIds,
        proIds,
        soIds,
      );

    let data = new TransactionHistoryForWebResponseDto();
    let responseData = [];
    const itemIds = result.map((q) => q.itemId);
    let itemData;
    if (itemIds.length > 0) {
      itemData = await this.itemService.getListByIDs(uniq(itemIds));
    }

    let poData, proData, soData;
    if (type == OrderTypeProductionOrderEnum.Input) {
      const poIds = result
        .filter((q) => q.type == STAGES_OPTION.PO_IMPORT)
        .map((q) => q.orderId);

      const proIds = result
        .filter((q) => q.type == STAGES_OPTION.PRO_IMPORT)
        .map((q) => q.orderId);

      if (poIds.length > 0) {
        poData = await this.saleService.getPurchasedOrderByIds(uniq(poIds));
      }

      if (proIds.length > 0) {
        proData = await this.saleService.getProductionOrderByIds(uniq(proIds));
      }
    }

    if (type == OrderTypeProductionOrderEnum.Output) {
      const proIds = result
        .filter((q) => q.type == STAGES_OPTION.PRO_EXPORT)
        .map((q) => q.orderId);

      const soIds = result
        .filter((q) => q.type == STAGES_OPTION.SO_EXPORT)
        .map((q) => q.orderId);

      if (proIds.length > 0) {
        proData = await this.saleService.getProductionOrderByIds(uniq(proIds));
      }

      if (soIds.length > 0) {
        soData = await this.saleService.getSaleOrderExportByIds(uniq(soIds));
      }
    }

    for (let i = 0; i < result.length; i++) {
      const transactionHistory = result[i];

      let order;
      let orderCode;
      let orderName;
      if (transactionHistory.type == STAGES_OPTION.PO_IMPORT) {
        order = poData.filter((or) => or.id == transactionHistory.orderId)[0];
      }

      if (
        transactionHistory.type == STAGES_OPTION.PRO_IMPORT ||
        transactionHistory.type == STAGES_OPTION.PRO_EXPORT
      ) {
        order = proData.filter((or) => or.id == transactionHistory.orderId)[0];
      }

      if (transactionHistory.type == STAGES_OPTION.SO_EXPORT) {
        order = soData.filter((or) => or.id == transactionHistory.orderId)[0];
      }
      orderCode = order?.code;
      orderName = order?.name;
      // ITEM
      const item = itemData.filter(
        (item) => item.id == transactionHistory.itemId,
      )[0];
      const itemCode = item?.code;
      const itemName = item?.name;

      const numberOfTime =
        transactionHistory.numberOfTime == NumberOfTime.TwoTimes ? 2 : 1;
      const numberOfTimeQc = transactionHistory?.numberOfTimeQc
        ? Number(transactionHistory?.numberOfTimeQc)
        : null;

      data = {
        id: transactionHistory.id,
        code: transactionHistory?.code,
        orderCode: orderCode,
        orderName: orderName,
        itemName: itemName,
        itemCode: itemCode,
        createdAt: transactionHistory?.createdAt,
        item: {
          name: itemName,
          code: itemCode,
        },
        errorReportCode: transactionHistory?.errorReportCode,
        errorReportName: transactionHistory?.errorReportName,
        numberOfTime: numberOfTime,
        numberOfTimeQc: numberOfTimeQc,
        numberOfTimeSearch: `${numberOfTimeQc}/${numberOfTime}`,
      };

      responseData.push(data);
    }

    // SORT BY SERVICE
    responseData = sortService(responseData, sort, [
      'orderName',
      'itemName',
      'itemCode',
      'numberOfTimeSearch',
    ]);

    // PAGINATE
    if (page && limit) {
      responseData = paginationService(
        responseData,
        Number(page),
        Number(limit),
      );
    }

    return new ResponseBuilder<PagingResponse>({
      items: responseData,
      meta: { total: count, page: request.page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async getListTransactionHistoryIOqcForApp(
    request: GetListQcTransactionInitDataRequestDto,
  ): Promise<ResponsePayload<PagingResponse>> {
    const { type, filter, keyword, user } = request;

    // SO PRO PO TODO
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

    // QUERY TRANSACTION HISTORY
    const { result, total } =
      await this.transactionHistoryRepository.getListTransactionHistoryIOqcForApp(
        request,
        keywordOrderIds,
        keywordItemIds,
        filterOrderIds,
        filteredArrayOrderIds,
      );

    let data = new TransactionHistoryForWebResponseDto();
    const responseData = [];
    const itemIds = result.map((q) => q.itemId);
    let itemData;
    if (itemIds.length > 0) {
      itemData = await this.itemService.getListByIDs(uniq(itemIds));
    }

    let poData, proData, soData;
    if (type == OrderTypeProductionOrderEnum.Input) {
      const poIds = result
        .filter((q) => q.type == STAGES_OPTION.PO_IMPORT)
        .map((q) => q.orderId);

      const proIds = result
        .filter((q) => q.type == STAGES_OPTION.PRO_IMPORT)
        .map((q) => q.orderId);

      if (poIds.length > 0) {
        poData = await this.saleService.getPurchasedOrderByIds(uniq(poIds));
      }

      if (proIds.length > 0) {
        proData = await this.saleService.getProductionOrderByIds(uniq(proIds));
      }
    }

    if (type == OrderTypeProductionOrderEnum.Output) {
      const proIds = result
        .filter((q) => q.type == STAGES_OPTION.PRO_EXPORT)
        .map((q) => q.orderId);

      const soIds = result
        .filter((q) => q.type == STAGES_OPTION.SO_EXPORT)
        .map((q) => q.orderId);

      if (proIds.length > 0) {
        proData = await this.saleService.getProductionOrderByIds(uniq(proIds));
      }

      if (soIds.length > 0) {
        soData = await this.saleService.getSaleOrderExportByIds(uniq(soIds));
      }
    }

    for (let i = 0; i < result.length; i++) {
      const transactionHistory = result[i];

      let order;
      let orderCode;
      let orderName;
      if (transactionHistory.type == STAGES_OPTION.PO_IMPORT) {
        order = poData.filter((or) => or.id == transactionHistory.orderId)[0];
      }

      if (
        transactionHistory.type == STAGES_OPTION.PRO_IMPORT ||
        transactionHistory.type == STAGES_OPTION.PRO_EXPORT
      ) {
        order = proData.filter((or) => or.id == transactionHistory.orderId)[0];
      }

      if (transactionHistory.type == STAGES_OPTION.SO_EXPORT) {
        order = soData.filter((or) => or.id == transactionHistory.orderId)[0];
      }
      orderCode = order?.code;
      orderName = order?.name;
      // ITEM
      const item = itemData.filter(
        (item) => item.id == transactionHistory.itemId,
      )[0];
      const itemCode = item?.code;
      const itemName = item?.name;

      const numberOfTime =
        transactionHistory.numberOfTime == NumberOfTime.TwoTimes ? 2 : 1;
      const numberOfTimeQc = transactionHistory?.numberOfTimeQc
        ? Number(transactionHistory?.numberOfTimeQc)
        : null;

      data = {
        id: transactionHistory.id,
        code: transactionHistory?.code,
        orderCode: orderCode,
        orderName: orderName,
        itemName: itemName,
        itemCode: itemCode,
        createdAt: transactionHistory?.createdAt,
        item: {
          name: itemName,
          code: itemCode,
        },
        errorReportCode: transactionHistory?.errorReportCode,
        errorReportName: transactionHistory?.errorReportName,
        numberOfTime:
          transactionHistory.numberOfTime == NumberOfTime.TwoTimes ? 2 : 1,
        numberOfTimeQc: transactionHistory?.numberOfTimeQc
          ? Number(transactionHistory?.numberOfTimeQc)
          : null,
        numberOfTimeSearch: `${numberOfTimeQc}/${numberOfTime}`,
      };

      responseData.push(data);
    }

    return new ResponseBuilder<PagingResponse>({
      items: responseData,
      meta: { total: total, page: request.page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async getDetailProducingStepsQCHistory(
    id: number,
  ): Promise<
    ResponsePayload<ProducingStepsTransactionHistoryResponseDto | any>
  > {
    const result =
      await this.transactionHistoryRepository.getProducingStepsQCDetail(id);
    if (!result) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    // get information from work order
    const workOrder = await this.produceService.getWorkOrderById(
      result.workOrderId,
    );
    if (!workOrder) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.WORK_ORDER_NOT_FOUND'))
        .build();
    }
    // filter workCenters with current work center id of transaction history detail
    workOrder.workCenters = workOrder.workCenters?.filter(
      (x) => x.id == result.workCenterId,
    );

    result.workOrder = workOrder;
    const pic = await this.userService.getUserByID(result.createdByUserId);
    if (!pic) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.USER_NOT_FOUND'))
        .build();
    }
    result.pic = pic;
    // Get check list details by transaction history Id
    const checkListDetails =
      await this.transactionHistoryRepository.getCheckListDetailsByTransactionHistory(
        result.transactionHistoryId,
      );
    result.checkListDetails = checkListDetails;
    // map result with item if type is input produce step QC
    const itemType = result.itemType
      ? parseInt(result.itemType)
      : result.itemType;
    const type = result.type ? parseInt(result.type) : result.type;
    let item;
    if (result.itemId) {
      item = await this.itemService.getItemById(result.itemId);
    }
    if (type == TransactionHistoryTypeEnum.InputProducingStep) {
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

    result.consignmentName = result?.lotNumber;
    result.formality = QUALITY_POINT_FORMALITY[0].text;
    result.qcStageName = STAGE_MAP[type];

    const errorReport = await this.errorReportRepository.findOneByCondition({
      transactionHistoryId: id,
    });

    result.errorReportCode = errorReport?.code ? errorReport.code : '';
    result.errorReportName = errorReport?.name ? errorReport.name : '';
    result.errorReportId = errorReport?.id ? errorReport.id : '';

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

    // mapping result to response DTO
    const response = plainToClass(
      ProducingStepsTransactionHistoryDetailResponseDto,
      result,
      {
        excludeExtraneousValues: true,
      },
    );
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async getWOSummaryOfProducingStepsTransactionHistory(
    request: GetWOSummaryScanRequestDto,
  ): Promise<ResponsePayload<GetWoSummaryScanResponseDto | any>> {
    const { userId } = request;
    const woResponse = await this.produceService.getWorkOrderByQrCode(request);

    if (!woResponse) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.WORK_ORDER_NOT_FOUND'))
        .build();
    }
    // check if current WO: user is assigned or not
    const isAdminOrLeader = checkUserRoleSettings(request.user);

    /*
      đang đợi làm Plan cho công đoạn đầu vào thì bỏ comment
      TODO COMMENT
     */

    // if (!isAdminOrLeader) {
    //   const qcPlans =
    //     await this.qualityPlanRepository.findProduceStepsQualityPlansByUser(
    //       request.userId,
    //     );

    //   if (isEmpty(qcPlans)) {
    //     return new ResponseBuilder()
    //       .withCode(ResponseCodeEnum.NOT_FOUND)
    //       .withMessage(
    //         await this.i18n.translate(
    //           'error.MO_WITH_QC_PLAN_USER_ASSIGN_NOT_FOUND',
    //         ),
    //       )
    //       .build();
    //   }
    //   const filterWoIds = [];
    //   qcPlans.forEach((item) => {
    //     if (!isEmpty(item.workOrders)) {
    //       item.workOrders.forEach((wo) => {
    //         if (!filterWoIds.includes(wo.workOrderId)) {
    //           filterWoIds.push(wo.workOrderId);
    //         }
    //       });
    //     }
    //   });
    //   const woId = parseInt(extractWorkOrderIdFromQrCode(request.qrCode));
    //   if (!filterWoIds.includes(woId)) {
    //     return new ResponseBuilder()
    //       .withCode(ResponseCodeEnum.BAD_REQUEST)
    //       .withMessage(await this.i18n.translate('error.WO_NOT_ASSIGN_TO_USER'))
    //       .build();
    //   }
    // }

    /*
      START UPDATE: DUYTU "qc 2 lần" đầu ra
     */

    // Danh sách WC
    const workCenterIds = woResponse?.workCenters?.map((x) => x.id);
    if (isEmpty(workCenterIds)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.WORK_CENTER_NOT_FOUND'))
        .build();
    }

    // Kiểm tra công đoạn qc 1 lần hay 2 lần
    const qualityPoint = await this.qualityPointRepository.findOneById(
      woResponse?.producingStep?.qcCriteriaId,
    );
    if (!isEmpty(qualityPoint)) {
      // Số lần cần thực hiện QC của công đoạn (1 or 2)
      const numberOfTime = qualityPoint?.numberOfTime;
      if (
        numberOfTime != NumberOfTime.OneTimes &&
        numberOfTime != NumberOfTime.TwoTimes
      ) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(await this.i18n.translate('error.DATA_NOT_QC'))
          .build();
      }

      // Thực hiện QC 2 lần Công đoạn đầu ra
      if (numberOfTime == NumberOfTime.TwoTimes) {
        // Nếu là QC 2 lần
        // Kiểm tra người đang đăng nhập có thuộc nhóm QC lần 2 của công đoạn hay không
        const qualityPlanBom =
          await this.qualityPlanBomRepository.findQualityPlanBomByUserAndWo(
            userId,
            woResponse?.id,
          );

        if (isEmpty(qualityPlanBom)) {
          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.NOT_FOUND)
            .withMessage(
              await this.i18n.translate('error.QUALITY_PLAN_BOM_NOT_FOUND'),
            )
            .build();
        }

        // người QC lần 1 or 2
        const numberOfTimeUserQc =
          qualityPlanBom?.qualityPlanBomQualityPointUsers[0]?.numberOfTimeQc;
        if (
          numberOfTimeUserQc != userStageNumberOfTimeQc.theFirstTime &&
          numberOfTimeUserQc != userStageNumberOfTimeQc.theSecondTime
        ) {
          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.NOT_FOUND)
            .withMessage(await this.i18n.translate('error.USER_NOT_QC'))
            .build();
        }

        const theFirstTimeTransactionForWc =
          await this.transactionHistoryRepository.totalQuantityForWC(
            woResponse?.id,
            STAGES_OPTION.OUTPUT_PRODUCTION, // Đầu ra
            TransactionHistoryNumberOfTimeQc.theFirstTime, // TH QC lần 1
            workCenterIds,
          );

        woResponse?.workCenters?.forEach((x) => {
          const theFirstTimeData = theFirstTimeTransactionForWc.find(
            (y) => x?.id == y?.workCenterId,
          );

          // Số lượng đã QC lần 1 theo WC
          const qcDoneQuantity1 = theFirstTimeData?.qcQuantity
            ? Number(theFirstTimeData.qcQuantity)
            : 0;

          // Số lượng Order
          const totalUnQcQuantity = x?.totalUnQcQuantity
            ? x.totalUnQcQuantity
            : 0;
          const totalQcQuantity = x?.totalQcQuantity ? x.totalQcQuantity : 0;
          const actualQuantity = x?.actualQuantity ? x.actualQuantity : 0;
          const repairedQuantity =
            totalUnQcQuantity + totalQcQuantity - actualQuantity;

          x.numberOfTime = 2; // QC 2 lần
          if (numberOfTimeUserQc == userStageNumberOfTimeQc.theFirstTime) {
            x.totalUnQcQuantity =
              actualQuantity + repairedQuantity - qcDoneQuantity1;
            x.totalQcQuantity = qcDoneQuantity1; // Tổng số lượng trong TH lần 1
            x.numberOfTimeQc = TransactionHistoryNumberOfTimeQc.theFirstTime; // QC lần 1
          } else if (
            numberOfTimeUserQc == userStageNumberOfTimeQc.theSecondTime
          ) {
            x.totalUnQcQuantity = qcDoneQuantity1 - totalQcQuantity;
            x.totalQcQuantity = totalQcQuantity;
            x.numberOfTimeQc = TransactionHistoryNumberOfTimeQc.theSecondTime; // QC lần 2
          }
        });
      } else if (numberOfTime == NumberOfTime.OneTimes) {
        // nếu là QC 1 lần
        woResponse?.workCenters?.forEach((x) => {
          x.numberOfTime = 1; // QC 1 lần
          x.numberOfTimeQc = TransactionHistoryNumberOfTimeQc.theFirstTime; // QC lần 1
        });
      }
    }
    // END UPDATE: DUYTU "qc 2 lần" đầu ra

    const pic = await this.userService.getUserByID(request.userId);
    if (!pic) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.USER_NOT_FOUND'))
        .build();
    }
    woResponse.pic = pic;
    // Check if producing step of current WO need QC or not
    if (
      woResponse.producingStep?.qcCheck == IS_QC_NEEDED_ENUM.NOT_NEEDED &&
      woResponse.producingStep?.inputQcCheck == IS_QC_NEEDED_ENUM.NOT_NEEDED
    ) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.QC_NOT_NEED'))
        .build();
    }
    if (woResponse.producingStep?.qcCheck == IS_QC_NEEDED_ENUM.NEEDED) {
      const qualityPointId = woResponse.producingStep?.qcCriteriaId;
      // Validate if output QC is needed base on quality point Id
      if (qualityPointId) {
        // if output QC need
        // Get check list by quality point id
        const checkList =
          await this.qualityPointService.getCheckListDetailsByQualityPoint(
            qualityPointId,
          );
        woResponse.checkListDetails = checkList.data;
        // get QC quantity rule by producing steps criteria ID
        const qualityPoint = await this.qualityPointRepository.getDetail(
          qualityPointId,
        );
        woResponse.producingStep.qcQuantityRule = qualityPoint?.formality;
      } else {
        woResponse.producingStep.qcCheck = IS_QC_NEEDED_ENUM.NOT_NEEDED;
      }
    }

    if (woResponse.producingStep?.inputQcCheck == 1) {
      // get input check list QC check list for materials
      if (!isEmpty(woResponse.materials)) {
        await this.getQcQuantityRuleForInputProduceQc(woResponse.materials);
        await this.getCheckListDetailsData(woResponse.materials);
        await this.convertItemQcQuantity(woResponse.materials);
      }
      // get input check list QC check list for previous Boms
      if (!isEmpty(woResponse.previousBoms)) {
        await this.getQcQuantityRuleForInputProduceQc(woResponse.previousBoms);
        await this.getCheckListDetailsData(woResponse.previousBoms);
        await this.convertItemQcQuantity(woResponse.previousBoms);
      }

      /*
        QC 2 lần công đoạn đầu vào.
       */

      // 1.Lấy tiêu chí
      const qualityPointIdByMaterials = woResponse?.materials.map(
        (x) => x.criteriaId,
      );
      const qualityPointIdByPreviousBoms = woResponse?.previousBoms.map(
        (x) => x.criteriaId,
      );
      const qualityPointIds = uniq(
        qualityPointIdByMaterials.concat(qualityPointIdByPreviousBoms),
      );
      const qualityPoints = await this.qualityPointRepository.findWithRelations(
        {
          where: {
            id: In(qualityPointIds),
          },
          relations: ['qualityPointUser1s', 'qualityPointUser2s'],
        },
      );

      // 2.Lấy Transaction
      const theFirstTimeTransactionForWcAndItem =
        await this.transactionHistoryRepository.totalQuantityForWCInputProduction(
          woResponse?.id, // id WO
          STAGES_OPTION.INPUT_PRODUCTION, // Đầu vào
          TransactionHistoryNumberOfTimeQc.theFirstTime, // TH QC lần 1
          workCenterIds,
        );

      // map dữ liệu
      for (let i = 0; i < woResponse.workCenters.length; i++) {
        const wc = woResponse.workCenters[i];

        if (!isEmpty(wc.materials)) {
          await this.getQcQuantityRuleForInputProduceQc(wc.materials);
          await this.getCheckListDetailsData(wc.materials);
          await this.convertItemQcQuantity(wc.materials);
        }

        if (!isEmpty(wc.previousBoms)) {
          await this.getQcQuantityRuleForInputProduceQc(wc.previousBoms);
          await this.getCheckListDetailsData(wc.previousBoms);
          await this.convertItemQcQuantity(wc.previousBoms);
        }

        wc?.materials?.forEach((m) => {
          m.planQuantity = m?.planQuantity ? m.planQuantity : 0;
          m.producedQuantity = m?.totalImportQuantity
            ? m.totalImportQuantity
            : 0;
          /*
            Bên Mobile đang view producedQuantity làm số lượng đã sản xuất.
            Thực tế đối với nguyên vật liệu thì nó sẽ là số lượng đã nhập(totalImportQuantity)
           */
          m.totalUnQcQuantity = m?.totalUnQcQuantity ? m.totalUnQcQuantity : 0;
          m.totalImportQuantity = m?.totalImportQuantity
            ? m.totalImportQuantity
            : 0;
          m.totalQcRejectQuantity = m?.totalQcRejectQuantity
            ? m.totalQcRejectQuantity
            : 0;
          m.totalQcPassQuantity = m?.totalQcPassQuantity
            ? m.totalQcPassQuantity
            : 0;
          m.totalQcQuantity = m?.totalQcQuantity ? m.totalQcQuantity : 0;

          // Tiêu chí
          const qualityPoint = qualityPoints.find(
            (q) => q?.id == m?.criteriaId,
          );
          let numberOfTimeUserQcM: number;

          if (
            !isEmpty(
              qualityPoint?.qualityPointUser1s?.find(
                (x) => x?.userId == userId,
              ),
            )
          ) {
            numberOfTimeUserQcM = userStageNumberOfTimeQc.theFirstTime;
          } else if (
            !isEmpty(
              qualityPoint?.qualityPointUser2s?.find(
                (x) => x?.userId == userId,
              ),
            )
          ) {
            numberOfTimeUserQcM = userStageNumberOfTimeQc.theSecondTime;
          }

          const theFirstTimeData = theFirstTimeTransactionForWcAndItem.find(
            (y) => wc?.id == y?.workCenterId && m?.item?.id == y?.itemId,
          );

          // Số lượng đã QC lần 1 theo WC
          const qcDoneQuantity1 = theFirstTimeData?.qcQuantity
            ? Number(theFirstTimeData.qcQuantity)
            : 0;

          // Số lượng Order trong Material
          const totalUnQcQuantity = m?.totalUnQcQuantity
            ? m.totalUnQcQuantity
            : 0;
          const totalQcQuantity = m?.totalQcQuantity ? m.totalQcQuantity : 0;
          const actualQuantity = m?.producedQuantity ? m.producedQuantity : 0;
          const repairedQuantity =
            totalUnQcQuantity + totalQcQuantity - actualQuantity;

          if (qualityPoint?.numberOfTime == NumberOfTime.TwoTimes) {
            // Nếu là QC 2 lần
            // người QC lần 1 or 2
            m.numberOfTime = 2;
            if (numberOfTimeUserQcM == userStageNumberOfTimeQc.theFirstTime) {
              m.totalUnQcQuantity =
                actualQuantity + repairedQuantity - qcDoneQuantity1;
              m.totalQcQuantity = qcDoneQuantity1; // Tổng số lượng trong TH lần 1
              m.numberOfTimeQc = TransactionHistoryNumberOfTimeQc.theFirstTime; // QC lần 1
            } else if (
              numberOfTimeUserQcM == userStageNumberOfTimeQc.theSecondTime
            ) {
              m.totalUnQcQuantity = qcDoneQuantity1 - totalQcQuantity;
              m.totalQcQuantity = totalQcQuantity;
              m.numberOfTimeQc = TransactionHistoryNumberOfTimeQc.theSecondTime; // QC lần 2
            } else {
              m.numberOfTime = 0;
              m.numberOfTimeQc = 0;
            }
          } else if (qualityPoint?.numberOfTime == NumberOfTime.OneTimes) {
            // nếu là QC 1 lần
            m.numberOfTime = 1; // QC 1 lần
            m.numberOfTimeQc = TransactionHistoryNumberOfTimeQc.theFirstTime; // QC lần 1
          }
        });

        wc?.previousBoms?.forEach((m) => {
          m.planQuantity = m?.planQuantity ? m.planQuantity : 0;
          m.producedQuantity = m?.totalImportQuantity
            ? m.totalImportQuantity
            : 0;
          /*
            Bên Mobile đang view producedQuantity làm số lượng đã sản xuất.
            Thực tế đối với sản phẩm công đoạn trước thì nó sẽ là số lượng đã nhập(totalImportQuantity)
           */
          m.totalUnQcQuantity = m?.totalUnQcQuantity ? m.totalUnQcQuantity : 0;
          m.totalImportQuantity = m?.totalImportQuantity
            ? m.totalImportQuantity
            : 0;
          m.totalQcRejectQuantity = m?.totalQcRejectQuantity
            ? m.totalQcRejectQuantity
            : 0;
          m.totalQcPassQuantity = m?.totalQcPassQuantity
            ? m.totalQcPassQuantity
            : 0;
          m.totalQcQuantity = m?.totalQcQuantity ? m.totalQcQuantity : 0;

          // Tiêu chí
          const qualityPoint = qualityPoints.find(
            (q) => q?.id == m?.criteriaId,
          );
          let numberOfTimeUserQcP: number;

          if (
            !isEmpty(
              qualityPoint?.qualityPointUser1s?.find(
                (x) => x?.userId == userId,
              ),
            )
          ) {
            numberOfTimeUserQcP = userStageNumberOfTimeQc.theFirstTime;
          } else if (
            !isEmpty(
              qualityPoint?.qualityPointUser2s?.find(
                (x) => x?.userId == userId,
              ),
            )
          ) {
            numberOfTimeUserQcP = userStageNumberOfTimeQc.theSecondTime;
          }

          const theFirstTimeData = theFirstTimeTransactionForWcAndItem.find(
            (y) => wc?.id == y?.workCenterId && m?.item?.id == y?.itemId,
          );

          // Số lượng đã QC lần 1 theo WC
          const qcDoneQuantity1 = theFirstTimeData?.qcQuantity
            ? Number(theFirstTimeData.qcQuantity)
            : 0;

          // Số lượng Order trong Material
          const totalUnQcQuantity = m?.totalUnQcQuantity
            ? m.totalUnQcQuantity
            : 0;
          const totalQcQuantity = m?.totalQcQuantity ? m.totalQcQuantity : 0;
          const actualQuantity = m?.producedQuantity ? m.producedQuantity : 0;
          const repairedQuantity =
            totalUnQcQuantity + totalQcQuantity - actualQuantity;

          if (qualityPoint?.numberOfTime == NumberOfTime.TwoTimes) {
            // Nếu là QC 2 lần
            // người QC lần 1 or 2
            m.numberOfTime = 2;
            if (numberOfTimeUserQcP == userStageNumberOfTimeQc.theFirstTime) {
              m.totalUnQcQuantity =
                actualQuantity + repairedQuantity - qcDoneQuantity1;
              m.totalQcQuantity = qcDoneQuantity1; // Tổng số lượng trong TH lần 1
              m.numberOfTimeQc = TransactionHistoryNumberOfTimeQc.theFirstTime; // QC lần 1
            } else if (
              numberOfTimeUserQcP == userStageNumberOfTimeQc.theSecondTime
            ) {
              m.totalUnQcQuantity = qcDoneQuantity1 - totalQcQuantity;
              m.totalQcQuantity = totalQcQuantity;
              m.numberOfTimeQc = TransactionHistoryNumberOfTimeQc.theSecondTime; // QC lần 2
            } else {
              m.numberOfTime = 0;
              m.numberOfTimeQc = 0;
            }
          } else if (qualityPoint?.numberOfTime == NumberOfTime.OneTimes) {
            // nếu là QC 1 lần
            m.numberOfTime = 1; // QC 1 lần
            m.numberOfTimeQc = TransactionHistoryNumberOfTimeQc.theFirstTime; // QC lần 1
          }
        });
      }
    }

    const result = plainToClass(GetWoSummaryScanResponseDto, woResponse, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }

  public async getMoList(request: GetMoListRequestDto): Promise<any> {
    // TODO: check if user is admin or leader in QC department
    const isAdminOrLeader = checkUserRoleSettings(request.user);
    const filterMoIds = [];

    /*
      đang đợi làm Plan cho công đoạn đầu vào thì bỏ comment
      TODO COMMENT
     */

    // if (!isAdminOrLeader) {
    //   // filter QC plan with MO Ids and assigned users
    //   const qcPlans =
    //     await this.qualityPlanRepository.findProduceStepsQualityPlansByUser(
    //       request.userId,
    //     );

    //   if (isEmpty(qcPlans)) {
    //     return new ResponseBuilder()
    //       .withCode(ResponseCodeEnum.NOT_FOUND)
    //       .withMessage(
    //         await this.i18n.translate(
    //           'error.MO_WITH_QC_PLAN_USER_ASSIGN_NOT_FOUND',
    //         ),
    //       )
    //       .build();
    //   }

    //   qcPlans.forEach((item) => {
    //     if (!filterMoIds.includes(item.moId)) {
    //       filterMoIds.push(item.moId);
    //     }
    //   });
    //   request.filter = [
    //     {
    //       column: ManufacturingOrderFilterColumn.ID,
    //       text: filterMoIds,
    //     },
    //   ];
    // }
    const { items, total } = await this.produceService.getMoList(request);

    if (isEmpty(items)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.MO_NOT_FOUND'))
        .build();
    }

    const result = plainToClass(GetMoListResponseDto, items, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder<PagingResponse>({
      items: result,
      meta: { total: total },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async getPlanItemMoList(
    request: GetPlanItemMoListRequestDto,
  ): Promise<any> {
    const response = await this.produceService.getPlanItemMoList(request);
    if (isEmpty(response)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.MO_PLAN_ITEM_NOT_FOUND'))
        .build();
    }
    const result = plainToClass(GetPlanItemMoListResponseDto, response.data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }

  public async getMoItemDetail(
    request: GetMoItemDetailRequestDto,
  ): Promise<any> {
    const response = await this.produceService.getMoItemDetail(request);
    if (isEmpty(response)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(
          await this.i18n.translate('error.MO_PLAN_ITEM_DETAIL_NOT_FOUND'),
        )
        .build();
    }
    // TODO: check if user is admin or leader in QC department
    const isAdminOrLeader = checkUserRoleSettings(request.user);
    const filterWoIds = [];
    const filterProduceStepIds = [];

    /*
      đang đợi làm Plan cho công đoạn đầu vào thì bỏ comment
      TODO COMMENT
     */

    // if (!isAdminOrLeader) {
    //   // filter QC plan with MO Ids and assigned users
    //   const qcPlans =
    //     await this.qualityPlanRepository.findProduceStepsQualityPlansByUser(
    //       request.userId,
    //     );

    //   if (isEmpty(qcPlans)) {
    //     return new ResponseBuilder()
    //       .withCode(ResponseCodeEnum.NOT_FOUND)
    //       .withMessage(
    //         await this.i18n.translate(
    //           'error.MO_WITH_QC_PLAN_USER_ASSIGN_NOT_FOUND',
    //         ),
    //       )
    //       .build();
    //   }
    //   qcPlans.forEach((item) => {
    //     if (!isEmpty(item.workOrders)) {
    //       item.workOrders.forEach((wo) => {
    //         if (!filterWoIds.includes(wo.workOrderId)) {
    //           filterWoIds.push(wo.workOrderId);
    //         }
    //         if (!filterProduceStepIds.includes(wo.producingStepId)) {
    //           filterProduceStepIds.push(wo.producingStepId);
    //         }
    //       });
    //     }
    //   });
    //   // filter
    //   response = this.filterMoItemDetail(
    //     response,
    //     filterProduceStepIds,
    //     filterWoIds,
    //   );
    // }

    const result = plainToClass(GetMoItemDetailResponseDto, response, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }

  // App SO
  // List Get PO AND PRO OutPut
  public async getListIoqcOrder(
    request: GetListIoqcOrderRequestDto,
  ): Promise<GetListIoqcOrderResponseDto | any> {
    const { type, userId } = request;

    const isAdminOrLeader = checkUserRoleSettings(request.user);
    const filterOrderIds = [];
    if (!isAdminOrLeader) {
      const qcPlans = await this.qualityPlanRepository.findIoQcPlanByUser(
        userId,
        type,
      );
      if (isEmpty(qcPlans)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(
            await this.i18n.translate('error.IO_QC_PLAN_USER_ASSIGN_NOT_FOUND'),
          )
          .build();
      }
      qcPlans.forEach((item) => {
        if (!isEmpty(item.orderDetails)) {
          item.orderDetails.forEach((e) => {
            if (!filterOrderIds.includes(e.orderId)) {
              filterOrderIds.push(e.orderId);
            }
          });
        }
      });
      // filter by orderId:
      request.filterOrderIds = filterOrderIds;
    }

    const result = await this.saleService.getListIoqcOrder(request);

    if (!result) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData({
          items: [],
          meta: { total: 0, page: 0 },
        })
        .build();
    }

    const response = plainToClass(IoqcOrderResponseDto, result?.data?.items, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData({
        items: response,
        meta: result?.data?.meta,
      })
      .build();
  }

  // List Get Qc OutPut Warehouse By Order
  public async getListIoqcWarehouseByOrder(
    request: GetListIoqcWarehouseByOrderRequestDto,
  ): Promise<GetListIoqcWarehouseByOrderResponseDto | any> {
    const { userId, type } = request;

    const result = await this.saleService.getListIoqcWarehouseByOrder(request);

    if (!result) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const response = plainToClass(
      IoqcWarehouseByOrderResponseDto,
      result.data.items,
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData({
        items: response,
        meta: result.data.meta,
      })
      .build();
  }

  // List Get Qc OutPut Warehouse By Order
  public async getListIoqcItemByWarehouseAndOrder(
    request: GetListIoqcItemByWarehouseAndOrderRequestDto,
  ): Promise<GetListIoqcItemByWarehouseAndOrderResponseDto | any> {
    const { userId, type } = request;

    const result = await this.saleService.getListIoqcItemByWarehouseAndOrder(
      request,
    );

    if (!result) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const isAdminOrLeader = checkUserRoleSettings(request.user);
    const filterOrderIds = [];
    const filterWarehouseIds = [];
    const filterItemIds = [];
    if (!isAdminOrLeader) {
      // const qcPlans = await this.qualityPlanRepository.findIoQcPlanByUser(
      //   userId,
      //   type,
      // );
      // if (isEmpty(qcPlans)) {
      //   return new ResponseBuilder()
      //     .withCode(ResponseCodeEnum.NOT_FOUND)
      //     .withMessage(
      //       await this.i18n.translate('error.IO_QC_PLAN_USER_ASSIGN_NOT_FOUND'),
      //     )
      //     .build();
      // }
      // qcPlans.forEach((item) => {
      //   if (!isEmpty(item.orderDetails)) {
      //     item.orderDetails.forEach((e) => {
      //       if (!filterOrderIds.includes(e.orderId)) {
      //         filterOrderIds.push(e.orderId);
      //       }
      //       if (!filterWarehouseIds.includes(e.warehouseId)) {
      //         filterWarehouseIds.push(e.warehouseId);
      //       }
      //       if (!filterItemIds.includes(e.itemId)) {
      //         filterItemIds.push(e.itemId);
      //       }
      //     });
      //   }
      // });
      // // filter by orderId and userId:
      // result.items = result.items.filter(
      //   (e) =>
      //     filterOrderIds.includes(e.orderId) &&
      //     filterWarehouseIds.includes(e.warehouseId) &&
      //     filterItemIds.includes(e.id),
      // );
    }

    const response = plainToClass(
      IoqcItemByWarehouseAndOrderResponseDto,
      result.items,
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData({
        items: response,
        meta: result.meta,
      })
      .build();
  }

  public async getInitData(
    type: TransactionHistoryTypeEnum,
  ): Promise<ResponsePayload<any>> {
    const ordersPromise = this.saleService.getListTransactionHistoryPOs(
      DEFAULT_INIT_PAGE_SIZE,
    );
    const request = new TransactionHistoryListRequestDto();
    const date = new Date().toISOString();

    request.type = type;
    request.filter = [
      {
        column: BASE_ENTITY_CONST.CREATED_AT.COL_NAME,
        text: `${date}|${date}`,
      },
    ];

    const transactionsPromise =
      this.transactionHistoryRepository.getList(request);

    const [orders, transactions] = await Promise.all([
      ordersPromise,
      transactionsPromise,
    ]);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData({
        orders: orders.map((order) => {
          return {
            id: order.id,
            code: order.code,
          };
        }),
        transactions: transactions,
      })
      .build();
  }

  public async delete(id: number): Promise<any> {
    return await this.transactionHistoryRepository.softDelete(id);
  }
  public async detail(id: number): Promise<any> {
    return await this.transactionHistoryRepository.getDetail(id);
  }

  async getTransactionHistory(
    request: GetListQcTransactionInitDataRequestDto,
    type: number,
  ): Promise<ResponsePayload<any>> {
    let res;
    if (type === TransactionHistoryIOqcTypeEnum.output) {
      res = [
        ...(await this.getDataProExportHistoryTransaction()),
        ...(await this.getDataSoHistoryTransaction()),
      ];
    } else {
      res = [
        ...(await this.getDataProImportHistoryTransaction()),
        ...(await this.getDataPoHistoryTransaction()),
      ];
    }

    const paginate = (dataSearch, page, limit) => {
      return dataSearch.slice((page - 1) * limit, page * limit);
    };

    const dataPaginate = paginate(
      res,
      parseInt(`${request.page}`),
      parseInt(`${request.limit}`),
    );

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData({
        items: dataPaginate,
        meta: { total: res.length, page: request.page },
      })
      .build();
  }

  private async getListSaleAndItemFromTransactionHistory(type: number) {
    const data = await this.transactionHistoryRepository.findByCondition({
      type: type,
    });
    const listIdsSale = [],
      listIdsItem = [];
    for (let i = 0; i < data.length; i++) {
      listIdsSale.push(data[i].orderId);
      listIdsItem.push(data[i].itemId);
    }
    return { data, listIdsSale, listIdsItem };
  }

  private async getDataProExportHistoryTransaction() {
    const { data, listIdsSale, listIdsItem } =
      await this.getListSaleAndItemFromTransactionHistory(
        STAGES_OPTION.PRO_EXPORT,
      );
    let orderProData;
    if (listIdsSale.length > 0) {
      orderProData = await this.saleService.getProductionOrderByIds([
        ...new Set(listIdsSale),
      ]);
    }
    return this.exportDataTransactionForApp(data, orderProData, listIdsItem);
  }

  private async getDataSoHistoryTransaction() {
    const { data, listIdsSale, listIdsItem } =
      await this.getListSaleAndItemFromTransactionHistory(
        STAGES_OPTION.SO_EXPORT,
      );
    let orderSoData;
    if (listIdsSale.length > 0) {
      orderSoData = await this.saleService.getSaleOrderExportByIds([
        ...new Set(listIdsSale),
      ]);
    }
    return this.exportDataTransactionForApp(data, orderSoData, listIdsItem);
  }

  private async getDataPoHistoryTransaction() {
    const { data, listIdsSale, listIdsItem } =
      await this.getListSaleAndItemFromTransactionHistory(
        STAGES_OPTION.PO_IMPORT,
      );
    let orderProData;
    if (listIdsSale.length > 0) {
      orderProData = await this.saleService.getPurchasedOrderByIds([
        ...new Set(listIdsSale),
      ]);
    }
    return this.exportDataTransactionForApp(data, orderProData, listIdsItem);
  }

  private async getDataProImportHistoryTransaction() {
    const { data, listIdsSale, listIdsItem } =
      await this.getListSaleAndItemFromTransactionHistory(
        STAGES_OPTION.PRO_IMPORT,
      );
    let orderSoData;
    if (listIdsSale.length > 0) {
      orderSoData = await this.saleService.getProductionOrderByIds([
        ...new Set(listIdsSale),
      ]);
    }
    return this.exportDataTransactionForApp(data, orderSoData, listIdsItem);
  }

  private async exportDataTransactionForApp(data, order, listIdsItem) {
    let itemData;
    if (listIdsItem.length > 0) {
      itemData = await this.itemService.getListByIDs(listIdsItem);
    }

    const res = [];
    for (let i = 0; i < data.length; i++) {
      const dto = new TransactionHistoryForAppResponseDto();
      dto.code = data[i].code;
      dto.id = data[i].id;
      dto.orderCode =
        order && order.length > 0
          ? order.find((obj) => {
              return obj.id == data[i].orderId;
            })?.code
          : '';
      dto.createdAt = data[i].createdAt;
      dto.item = itemData.find((obj) => {
        return obj.id == data[i].itemId;
      });
      res.push(dto);
    }
    return res;
  }

  async getDetailTransactionHistory(id: number): Promise<ResponsePayload<any>> {
    const detail =
      await this.transactionHistoryRepository.findTransactionHistoryById(id);
    if (!detail) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.TRANSACTION_HISTORY_NOT_FOUND'),
      ).toResponse();
    }

    const qualityPoint = await this.qualityPointRepository.findOneById(
      detail?.qualityPointId,
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

    const itemData = await this.itemService.getItemById(detail.itemId);
    const userData = await this.userService.getUserByID(detail.createdByUserId);
    const res = new DetailTransactionHistoryForAppResponseDto();

    res.code = detail ? detail.code : ''; // mã giao dịch
    res.note = detail ? detail.note : ''; // chú ý
    res.createdAt = detail ? detail.createdAt : null; // ngày thực hiện
    res.userCreate = userData ? userData.username : ''; // người thực hiện
    res.consignmentName = detail ? detail.consignmentName : ''; // Số lô
    res.formality = formality; // Hình thức Qc

    res.item = {
      name: itemData ? itemData.name : '', // tên sản phẩm
      code: itemData ? itemData.code : '', // mã sản phẩm
    };

    const qrScanRequest = new QcProgressScanQrRequestDto();

    qrScanRequest.user = userData;
    qrScanRequest.warehouseId = detail.warehouseId;
    qrScanRequest.orderId = detail.orderId;
    qrScanRequest.qrCode = res.item.code;
    qrScanRequest.qcStageId = detail.type;

    switch (detail.type) {
      case STAGES_OPTION.PRO_EXPORT:
        qrScanRequest.type = ItemBarcodeTypeEnum.PRO;
        break;
      case STAGES_OPTION.SO_EXPORT:
        qrScanRequest.type = ItemBarcodeTypeEnum.SO;
        break;
      case STAGES_OPTION.PO_IMPORT:
        qrScanRequest.type = ItemBarcodeTypeEnum.PO;
        break;
      case STAGES_OPTION.PRO_IMPORT:
        qrScanRequest.type = ItemBarcodeTypeEnum.PRO;
        break;
      default:
        break;
    }
    const order = await this.qualityProgressService.scanQRCode(
      qrScanRequest,
      true,
    );

    const orderData = order ? order.data : null;
    const item = orderData?.qcProgress ? orderData.qcProgress.item : null;

    const checkListQC = [];
    for (let i = 0; i < detail.transactionHistoryCheckListDetails.length; i++) {
      const temp = {
        name: detail.transactionHistoryCheckListDetails[i]?.checkListDetail
          .title,
        value: detail.transactionHistoryCheckListDetails[i]?.qcRejectQuantity,
      };
      checkListQC.push(temp);
    }
    res.checkList = checkListQC;
    res.orderCode = orderData ? orderData?.order?.code : '';
    res.orderName = orderData ? orderData?.order?.name : '';
    res.wareHouse = orderData ? orderData?.warehouse?.name : '';

    res.itemDetailQC = {
      itemUnit: item ? item.unitName : '',
      itemUnitName: item ? item.unitName : '',
      code: item ? item.code : '',
      name: item ? item.name : '',
      qcQuantity: detail ? Number(detail.qcQuantity) : 0,
      planQuantity: detail
        ? Number(detail?.transactionHistoryIOqc?.planQuantity)
        : 0,
      qcPassTotalQuantity: detail
        ? Number(detail?.transactionHistoryIOqc?.qcPassQuantity)
        : 0,
      qcDoneTotalQuantity: detail
        ? Number(detail?.transactionHistoryIOqc?.qcDoneQuantity)
        : 0,
      qcNeedTotalQuantity: detail
        ? Number(detail?.transactionHistoryIOqc?.qcNeedQuantity)
        : 0,
      qcPassQuantity: detail ? Number(detail.qcPassQuantity) : 0,
      qcRejectQuantity: detail ? Number(detail.qcRejectQuantity) : 0,
    };

    res.numberOfTime =
      qualityPoint?.numberOfTime == NumberOfTime.TwoTimes ? 2 : 1;
    res.numberOfTimeQc = detail?.numberOfTimeQc;

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(res)
      .build();
  }

  async getDetailTransactionHistoryIOqcWeb(
    id: number,
  ): Promise<ResponsePayload<any>> {
    const detail =
      await this.transactionHistoryRepository.findTransactionHistoryById(id);
    if (!detail) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.TRANSACTION_HISTORY_NOT_FOUND'),
      ).toResponse();
    }

    const itemData = await this.itemService.getItemById(detail.itemId);
    const userData = await this.userService.getUserByID(detail.createdByUserId);
    const res = new DetailTransactionHistoryForAppResponseDto();
    res.code = detail ? detail.code : ''; // mã giao dịch
    res.note = detail ? detail.note : ''; // chú ý
    res.createdAt = detail ? detail.createdAt : null; // ngày thực hiện
    res.userCreate = userData ? userData.username : ''; // người thực hiện
    res.consignmentName = detail ? detail.consignmentName : ''; // Số lô
    res.errorReportCode = detail?.errorReport ? detail.errorReport.code : '';
    res.errorReportName = detail.errorReport ? detail.errorReport.name : '';

    const qualityPoint = await this.qualityPointRepository.findOneById(
      detail?.qualityPointId,
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

    res.formality = formality;

    // QC lần 1 Or 2
    res.numberOfTime =
      qualityPoint.numberOfTime == NumberOfTime.TwoTimes ? 2 : 1;

    res.numberOfTimeQc = detail?.numberOfTimeQc
      ? Number(detail?.numberOfTimeQc)
      : null;

    res.item = {
      name: itemData ? itemData.name : '', // tên sản phẩm
      code: itemData ? itemData.code : '', // mã sản phẩm
    };

    const qrScanRequest = new QcProgressScanQrRequestDto();

    qrScanRequest.user = userData;
    qrScanRequest.warehouseId = detail.warehouseId;
    qrScanRequest.orderId = detail.orderId;
    qrScanRequest.qcStageId = detail.type;
    qrScanRequest.qrCode = res.item.code;

    switch (detail.type) {
      case STAGES_OPTION.PRO_EXPORT:
        qrScanRequest.type = ItemBarcodeTypeEnum.PRO;
        break;
      case STAGES_OPTION.SO_EXPORT:
        qrScanRequest.type = ItemBarcodeTypeEnum.SO;
        break;
      case STAGES_OPTION.PO_IMPORT:
        qrScanRequest.type = ItemBarcodeTypeEnum.PO;
        break;
      case STAGES_OPTION.PRO_IMPORT:
        qrScanRequest.type = ItemBarcodeTypeEnum.PRO;
        break;
      default:
        break;
    }

    const order = await this.qualityProgressService.scanQRCode(
      qrScanRequest,
      true,
    );
    const orderData = order ? order.data : null;
    const item = orderData?.qcProgress ? orderData.qcProgress.item : null;

    const checkList =
      await this.transactionHistoryRepository.getCheckListDetailsByTransactionHistory(
        id,
      );

    res.checkList = checkList;
    res.orderName = orderData ? orderData?.order?.name : '';
    res.orderCode = orderData ? orderData?.order?.code : '';
    res.wareHouse = orderData ? orderData?.warehouse?.name : '';

    res.itemDetailQC = {
      itemUnit: item ? item.unitName : '',
      itemUnitName: item ? item.unitName : '',
      code: item ? item.code : '',
      name: item ? item.name : '',
      qcQuantity: detail ? Number(detail.qcQuantity) : 0,
      planQuantity: detail
        ? Number(detail?.transactionHistoryIOqc?.planQuantity)
        : 0,
      qcPassTotalQuantity: detail
        ? Number(detail?.transactionHistoryIOqc?.qcPassQuantity)
        : 0,
      qcDoneTotalQuantity: detail
        ? Number(detail?.transactionHistoryIOqc?.qcDoneQuantity)
        : 0,
      qcNeedTotalQuantity: detail
        ? Number(detail?.transactionHistoryIOqc?.qcNeedQuantity)
        : 0,
      qcPassQuantity: detail ? Number(detail.qcPassQuantity) : 0,
      qcRejectQuantity: detail ? Number(detail.qcRejectQuantity) : 0,
    };

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(res)
      .build();
  }

  private addTypeToOrderList(list: any, type: number) {
    const result = [];
    for (let i = 0; i < list.length; i++) {
      list[i].type = type;
      result.push(list[i]);
    }
    return result;
  }

  async getListOrder(type: number): Promise<ResponsePayload<any>> {
    let data = [];
    //OUTPUT = 1;
    //INPUT = 2;
    let outputDataSOSale,
      outputDataProSale,
      outputDataPOSale,
      outputDataProOutSale;
    if (type == 1) {
      outputDataSOSale = await this.saleService.getListSaleOrderExport();
      outputDataProSale = await this.saleService.getListProductionOrder(1);
      if (outputDataSOSale.length > 0) {
        outputDataSOSale = this.addTypeToOrderList(
          outputDataSOSale,
          STAGES_OPTION.SO_EXPORT,
        );
        data = [...outputDataSOSale];
      }
      if (outputDataSOSale.length > 0) {
        outputDataProSale = this.addTypeToOrderList(
          outputDataProSale,
          STAGES_OPTION.PRO_EXPORT,
        );
        data = [...data, ...outputDataProSale];
      }
    } else {
      outputDataPOSale = await this.saleService.getAlertEnvListPurchasedOrder();
      outputDataProOutSale = await this.saleService.getListProductionOrder(0);
      if (outputDataPOSale.length > 0) {
        outputDataPOSale = this.addTypeToOrderList(
          outputDataPOSale,
          STAGES_OPTION.PO_IMPORT,
        );
        data = [...outputDataPOSale, ...data];
      }
      if (outputDataProOutSale.length > 0) {
        outputDataProOutSale = this.addTypeToOrderList(
          outputDataProOutSale,
          STAGES_OPTION.PRO_IMPORT,
        );
        data = [...data, ...outputDataProOutSale];
      }
    }

    const responseData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].id && data[i].code) {
        responseData.push(data[i]);
      }
    }
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(responseData)
      .build();
  }

  public async getNotReportedProducingTransactionHistory(
    createdBy: number,
  ): Promise<any> {
    const response =
      await this.transactionHistoryRepository.getNotReportedProducingTransactionHistory(
        createdBy,
      );

    if (isEmpty(response)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData({})
        .build();
    }

    /*
      QC x lần
     */
    const qualityPointIds = response.map((x) => x.qualityPointId);
    const qualityPoints = await this.qualityPointRepository.findByCondition({
      id: In(qualityPointIds),
    });

    if (!qualityPoints) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.QUALITY_POINT_NOT_FOUND'))
        .build();
    }

    // Lọc dữ liệu cần tạo PBCL theo QC 1 lần hoặc 2 lần
    const responseFilter = response.reduce((x, y) => {
      const qualityPoint = qualityPoints.filter(
        (z) => z.id == y.qualityPointId,
      )[0];
      y.numberOfTime =
        qualityPoint.numberOfTime == NumberOfTime.TwoTimes ? 2 : 1;

      y.numberOfTimeQc = y?.numberOfTimeQc ? Number(y?.numberOfTimeQc) : null;

      if (!(y.numberOfTime == 2 && y.numberOfTimeQc == 1)) {
        x.push(y);
      }
      return x;
    }, []);

    if (isEmpty(responseFilter)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData({})
        .build();
    }

    const responseFirst = responseFilter[0] ? responseFilter[0] : [];

    const result = plainToClass(
      ProducingStepsTransactionHistoryNotReportedResponseDto,
      responseFirst,
      { excludeExtraneousValues: true },
    );

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }

  // TODO
  public async getNotReportedOutputQcTransactionHistory(
    createdBy: number,
  ): Promise<any> {
    const response =
      await this.transactionHistoryRepository.getNotReportedOutputQcTransactionHistory(
        createdBy,
      );

    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData({})
        .build();
    }

    const itemIds = response.map((res) => res.itemId);
    const items = await this.itemService.getListByIDs(itemIds);
    const dataMapItem = response.map((res) => {
      const item = items.filter((item) => item.id == res.itemId)[0];
      res.itemCode = item.code;
      res.itemName = item.name;
      return res;
    });

    if (isEmpty(dataMapItem)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData([])
        .build();
    }

    /*
      QC x lần
     */
    const qualityPointIds = dataMapItem.map((x) => x.qualityPointId);
    const qualityPoints = await this.qualityPointRepository.findByCondition({
      id: In(qualityPointIds),
    });

    if (!qualityPoints) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.QUALITY_POINT_NOT_FOUND'))
        .build();
    }

    // Lọc dữ liệu cần tạo PBCL theo QC 1 lần hoặc 2 lần
    const responseFilter = dataMapItem.reduce((x, y) => {
      const qualityPoint = qualityPoints.filter(
        (z) => z.id == y.qualityPointId,
      )[0];
      y.numberOfTime =
        qualityPoint?.numberOfTime == NumberOfTime.TwoTimes ? 2 : 1;

      y.numberOfTimeQc = y?.numberOfTimeQc ? Number(y?.numberOfTimeQc) : null;

      if (!(y.numberOfTime == 2 && y.numberOfTimeQc == 1)) {
        x.push(y);
      }
      return x;
    }, []);

    if (isEmpty(responseFilter)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData([])
        .build();
    }

    const result = plainToClass(
      IOqcTransactionHistoryNotReportedResponseDto,
      responseFilter,
      { excludeExtraneousValues: true },
    );

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }

  public async getNotReportedInputQcTransactionHistory(
    createdBy: number,
  ): Promise<any> {
    const response =
      await this.transactionHistoryRepository.getNotReportedInputQcTransactionHistory(
        createdBy,
      );

    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData({})
        .build();
    }

    const itemIds = response.map((res) => res.itemId);
    const items = await this.itemService.getListByIDs(itemIds);
    const dataMapItem = response.map((res) => {
      const item = items.filter((item) => item.id == res.itemId)[0];
      res.itemCode = item.code;
      res.itemName = item.name;
      return res;
    });

    if (isEmpty(dataMapItem)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData([])
        .build();
    }

    /*
      QC x lần
     */
    const qualityPointIds = dataMapItem.map((x) => x.qualityPointId);
    const qualityPoints = await this.qualityPointRepository.findByCondition({
      id: In(qualityPointIds),
    });

    if (!qualityPoints) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.QUALITY_POINT_NOT_FOUND'))
        .build();
    }

    // Lọc dữ liệu cần tạo PBCL theo QC 1 lần hoặc 2 lần
    const responseFilter = dataMapItem.reduce((x, y) => {
      const qualityPoint = qualityPoints.filter(
        (z) => z.id == y.qualityPointId,
      )[0];
      y.numberOfTime =
        qualityPoint?.numberOfTime == NumberOfTime.TwoTimes ? 2 : 1;

      y.numberOfTimeQc = y?.numberOfTimeQc ? Number(y?.numberOfTimeQc) : null;

      if (!(y.numberOfTime == 2 && y.numberOfTimeQc == 1)) {
        x.push(y);
      }
      return x;
    }, []);

    if (isEmpty(responseFilter)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData([])
        .build();
    }

    const result = plainToClass(
      IOqcTransactionHistoryNotReportedResponseDto,
      responseFilter,
      { excludeExtraneousValues: true },
    );

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }

  public async updateWoQcQuantity(transactionHistoryEntity: any) {
    const updateQcRequest = new UpdateWOQcQuantityRequestDto();
    updateQcRequest.workOrderId = transactionHistoryEntity.orderId;
    updateQcRequest.passQuantity = parseInt(
      transactionHistoryEntity.qcPassQuantity,
    );
    updateQcRequest.rejectQuantity = parseInt(
      transactionHistoryEntity.qcRejectQuantity,
    );
    updateQcRequest.createdByUserId = transactionHistoryEntity.createdByUserId;
    updateQcRequest.note = transactionHistoryEntity.note;
    updateQcRequest.workCenterId = transactionHistoryEntity.workCenterId;
    updateQcRequest.executionDay = moment().toDate();
    const updateResult = await this.produceService.updateWOQcQuantity(
      updateQcRequest,
    );
    return updateResult;
  }

  //Get data ioqc for web
  //
  //
  private async exportDataTransactionForWeb(data, order, listIdsItem) {
    let itemData;
    if (listIdsItem.length > 0) {
      itemData = await this.itemService.getListByIDs(listIdsItem);
    }
    const res = [];
    for (let i = 0; i < data.length; i++) {
      const dto = new TransactionHistoryForWebResponseDto();
      dto.code = data[i].code;
      dto.id = data[i].id;
      dto.orderCode =
        order && order.length > 0
          ? order.find((obj) => {
              return obj.id == data[i].orderId;
            })?.code
          : '';
      dto.createdAt = data[i].createdAt;
      dto.item = itemData.find((obj) => {
        return obj.id == data[i].itemId;
      });
      res.push(dto);
    }
    return res;
  }
  private async getDataProHistoryTransactionForWeb() {
    const { data, listIdsSale, listIdsItem } =
      await this.getListSaleAndItemFromTransactionHistoryForWeb(
        STAGES_OPTION.PRO_EXPORT,
      );
    let orderProData;
    if (listIdsSale.length > 0) {
      orderProData = await this.saleService.getProductionOrderByIds([
        ...new Set(listIdsSale),
      ]);
    }
    return this.exportDataTransactionForWeb(data, orderProData, listIdsItem);
  }

  private async getDataSoHistoryTransactionForWeb() {
    const { data, listIdsSale, listIdsItem } =
      await this.getListSaleAndItemFromTransactionHistoryForWeb(
        STAGES_OPTION.SO_EXPORT,
      );
    let orderSoData;
    if (listIdsSale.length > 0) {
      orderSoData = await this.saleService.getSaleOrderExportByIds([
        ...new Set(listIdsSale),
      ]);
    }
    return this.exportDataTransactionForWeb(data, orderSoData, listIdsItem);
  }

  private async getDataPoHistoryTransactionForWeb() {
    const { data, listIdsSale, listIdsItem } =
      await this.getListSaleAndItemFromTransactionHistoryForWeb(
        STAGES_OPTION.PO_IMPORT,
      );
    let orderProData;
    if (listIdsSale.length > 0) {
      orderProData = await this.saleService.getPurchasedOrderByIds([
        ...new Set(listIdsSale),
      ]);
    }
    return this.exportDataTransactionForWeb(data, orderProData, listIdsItem);
  }

  private async getDataProImportHistoryTransactionForWeb() {
    const { data, listIdsSale, listIdsItem } =
      await this.getListSaleAndItemFromTransactionHistoryForWeb(
        STAGES_OPTION.PRO_IMPORT,
      );
    let orderSoData;
    if (listIdsSale.length > 0) {
      orderSoData = await this.saleService.getProductionOrderByIds([
        ...new Set(listIdsSale),
      ]);
    }
    return this.exportDataTransactionForWeb(data, orderSoData, listIdsItem);
  }

  private async getListSaleAndItemFromTransactionHistoryForWeb(type: number) {
    const data = await this.transactionHistoryRepository.findByCondition({
      type: type,
    });
    const listIdsSale = [],
      listIdsItem = [];
    for (let i = 0; i < data.length; i++) {
      listIdsSale.push(data[i].orderId);
      listIdsItem.push(data[i].itemId);
    }
    return { data, listIdsSale, listIdsItem };
  }

  async getTransactionHistoryForWeb(
    request: GetListQcTransactionInitDataForWebRequestDto,
    type: number,
  ): Promise<ResponsePayload<any>> {
    let res;
    if (type === TransactionHistoryIOqcTypeEnum.output) {
      res = [
        ...(await this.getDataSoHistoryTransactionForWeb()),
        ...(await this.getDataProHistoryTransactionForWeb()),
      ];
    } else {
      res = [
        ...(await this.getDataPoHistoryTransactionForWeb()),
        ...(await this.getDataProImportHistoryTransactionForWeb()),
      ];
    }

    const paginate = (dataSearch, page, limit) => {
      return dataSearch.slice((page - 1) * limit, page * limit);
    };

    const dataPaginate = paginate(
      res,
      parseInt(`${request.page}`),
      parseInt(`${request.limit}`),
    );

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData({
        items: dataPaginate,
        meta: { total: res.length, page: request.page },
      })
      .build();
  }

  public async createProduceStepQcLogTime(
    request: CreateTransactionHistoryLogTimeRequestDto,
  ): Promise<any> {
    const { start, end, pause, play, duration } = request;
    if (!start && !end && !pause && !play && !duration) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.LOG_TIME_INVALID'))
        .build();
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      let logTimeEntity;
      // Create log time record when Start QC (Automatic)
      if (start) {
        logTimeEntity =
          await this.transactionHistoryLogTimeRepository.createEntity({
            startTime: moment(start).toDate(),
            type: TransactionHistoryLogTimeTypeEnum.AUTOMATIC,
            status: TransactionHistoryLogTimeStatusEnum.IN_PROGRESS,
          });
      }
      // Create log time record when Start QC (Manual)
      else if (duration) {
        logTimeEntity =
          await this.transactionHistoryLogTimeRepository.createEntity({
            type: TransactionHistoryLogTimeTypeEnum.MANUAL,
            status: TransactionHistoryLogTimeStatusEnum.COMPLETED,
            duration: duration,
          });
      }
      const response = await queryRunner.manager.save(logTimeEntity);
      const result = plainToClass(
        CreateTransactionHistoryLogTimeResponseDto,
        response,
        { excludeExtraneousValues: true },
      );
      await queryRunner.commitTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData(result)
        .build();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CANNOT_CREATE_LOG_TIME'))
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  public async updateProduceStepQcLogTime(
    request: UpdateTransactionHistoryLogTimeRequestDto,
  ): Promise<any> {
    const { id, start, end, pause, play, duration } = request;
    if (!start && !end && !pause && !play && !duration) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.LOG_TIME_INVALID'))
        .build();
    }
    const logTimeEntity =
      await this.transactionHistoryLogTimeRepository.findOneByCondition({
        id: id,
      });
    if (!logTimeEntity) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.LOG_TIME_NOT_FOUND'))
        .build();
    }
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      if (start) {
        logTimeEntity.startTime = moment(start).toDate();
      } else if (end) {
        if (
          !(logTimeEntity.status == TransactionHistoryLogTimeStatusEnum.PAUSED)
        ) {
          const newEndTime = moment(end).toDate();
          const playTime = logTimeEntity.playTime;
          const startTime = logTimeEntity.startTime;
          logTimeEntity.duration =
            playTime && logTimeEntity.duration
              ? plus(
                  logTimeEntity.duration,
                  moment
                    .duration(moment(newEndTime).diff(moment(playTime)))
                    .asSeconds(),
                )
              : moment
                  .duration(moment(newEndTime).diff(moment(startTime)))
                  .asSeconds();
          logTimeEntity.endTime = newEndTime;
        }
        logTimeEntity.status = TransactionHistoryLogTimeStatusEnum.COMPLETED;
      } else if (pause) {
        if (
          logTimeEntity.status ==
          TransactionHistoryLogTimeStatusEnum.IN_PROGRESS
        ) {
          const endTime = moment(pause);
          const startTime = logTimeEntity.playTime
            ? logTimeEntity.playTime
            : logTimeEntity.startTime;
          logTimeEntity.duration = logTimeEntity.duration
            ? plus(
                logTimeEntity.duration,
                moment.duration(endTime.diff(startTime)).asSeconds(),
              )
            : moment.duration(endTime.diff(startTime)).asSeconds();
          logTimeEntity.endTime = endTime.toDate();
          logTimeEntity.status = TransactionHistoryLogTimeStatusEnum.PAUSED;
        }
      } else if (play) {
        logTimeEntity.playTime = moment(play).toDate();
        logTimeEntity.status = TransactionHistoryLogTimeStatusEnum.IN_PROGRESS;
      }
      if (duration) {
        const currentDuration = moment
          .duration(
            moment(logTimeEntity.endTime).diff(moment(logTimeEntity.startTime)),
          )
          .asSeconds();
        logTimeEntity.duration = currentDuration + duration;
        logTimeEntity.status = TransactionHistoryLogTimeStatusEnum.COMPLETED;
      }
      const response = await queryRunner.manager.save(logTimeEntity);
      const result = plainToClass(
        UpdateTransactionHistoryLogTimeResponseDto,
        response,
        { excludeExtraneousValues: true },
      );
      await queryRunner.commitTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData(result)
        .build();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CANNOT_UPDATE_LOG_TIME'))
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  public async createProduceStepQcLogTimeAddition(
    request: CreateTransactionHistoryLogTimeAdditionRequestDto,
  ): Promise<any> {
    const { logTimeId, start, end } = request;
    const logTimeEntity =
      await this.transactionHistoryLogTimeRepository.findOneByCondition({
        id: logTimeId,
      });
    if (!logTimeEntity) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.LOG_TIME_NOT_FOUND'));
    }

    const startTime = start ? moment(start).toDate() : null;
    const endTime = end ? moment(end).toDate() : null;
    const duration =
      start && end
        ? moment.duration(moment(end).diff(moment(start))).asSeconds()
        : null;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const logTimeAdditionEntity =
        this.transactionHistoryLogTimeAdditionRepository.createEntity({
          startTime: startTime,
          endTime: endTime,
          duration: duration,
          transactionHistoryLogTimeId: logTimeId,
        });
      const response = await queryRunner.manager.save(logTimeAdditionEntity);
      const result = plainToClass(
        CreateTransactionHistoryLogTimeAdditionResponseDto,
        response,
        { excludeExtraneousValues: true },
      );
      await queryRunner.commitTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData(result)
        .build();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.CANNOT_CREATE_LOG_TIME_DETAIL'),
        )
        .build();
    } finally {
      await queryRunner.release();
    }
  }
  public async getLogTimeEntityByTransactionHistoryId(
    transactionHistoryId: number,
  ): Promise<any> {
    const logTimeEntity =
      await this.transactionHistoryLogTimeRepository.findOneByCondition({
        where: {
          transactionHistoryId: transactionHistoryId,
        },
        relations: ['transactionHistory'],
      });
    return logTimeEntity;
  }

  public async getProduceStepQcLogTimeDetail(id: number): Promise<any> {
    const response =
      await this.transactionHistoryLogTimeRepository.getProduceStepQcLogTimeDetail(
        id,
      );
    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.LOG_TIME_NOT_FOUND'))
        .build();
    }
    const result = plainToClass(
      GetProduceStepQcLogTimeDetailResponseDto,
      response,
      { excludeExtraneousValues: true },
    );
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }

  public async updateProduceStepQcLogTimeAddition(
    request: UpdateTransactionHistoryLogTimeAdditionRequestDto,
  ): Promise<any> {
    const { logTimeId, logTimeAdditionId, start, end } = request;
    if (!end) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.LOG_TIME_INVALID'))
        .build();
    }
    const logTimeEntity =
      await this.transactionHistoryLogTimeRepository.findOneByCondition({
        id: logTimeId,
      });
    if (!logTimeEntity) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.LOG_TIME_NOT_FOUND'));
    }

    const logTimeAdditionEntity =
      await this.transactionHistoryLogTimeAdditionRepository.findOneById(
        logTimeAdditionId,
      );
    if (!logTimeAdditionEntity) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.LOG_TIME_ADDITION_NOT_FOUND'),
        )
        .build();
    }
    const startTime = logTimeAdditionEntity.startTime
      ? moment(logTimeAdditionEntity.startTime).toDate()
      : null;
    const endTime = moment(end).toDate();
    const duration =
      startTime && endTime
        ? moment.duration(moment(endTime).diff(moment(startTime))).asSeconds()
        : null;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      logTimeAdditionEntity.endTime = endTime;
      logTimeAdditionEntity.duration = duration;
      const response = await queryRunner.manager.save(logTimeAdditionEntity);
      const result = plainToClass(
        UpdateTransactionHistoryLogTimeAdditionResponseDto,
        response,
        { excludeExtraneousValues: true },
      );
      await queryRunner.commitTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData(result)
        .build();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.CANNOT_UPDATE_LOG_TIME_ADDITION'),
        )
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  private async getCheckListDetailsData(obj: any) {
    const materialCriteriaIdList = [];
    obj.forEach((item) => {
      if (
        item.criteriaId &&
        !materialCriteriaIdList.includes(item.criteriaId)
      ) {
        materialCriteriaIdList.push(item.criteriaId);
      }
    });
    const checkListRaws = {};
    const checkListDetails = !isEmpty(materialCriteriaIdList)
      ? await this.qualityPointService.getCheckListDetailsByQualityPointList(
          materialCriteriaIdList,
        )
      : [];

    if (!isEmpty(checkListDetails.data)) {
      checkListDetails.data.forEach((item) => {
        if (!checkListRaws[item.criteriaId]) {
          checkListRaws[item.criteriaId] = [item];
        } else {
          checkListRaws[item.criteriaId].push(item);
        }
      });
    }
    obj.forEach((item) => {
      item.checkListDetails = !isEmpty(checkListRaws[item.criteriaId])
        ? checkListRaws[item.criteriaId]
        : [];
    });
  }

  private async convertItemQcQuantity(obj: any) {
    if (!isEmpty(obj)) {
      obj.forEach((item) => {
        item.totalQcQuantity =
          item.totalQcPassQuantity + item.totalQcRejectQuantity || 0;
        item.totalUnQcQuantity =
          item.totalImportQuantity -
            (item.totalQcPassQuantity + item.totalQcRejectQuantity) || 0;
      });
    }
  }

  public async createInputProducingStepTransactionHistory(
    request: CreateInputProducingStepsTransactionHistoryRequestDto,
  ): Promise<ResponsePayload<any>> {
    const {
      numberOfTime,
      numberOfTimeQc,
      orderId,
      createdByUserId,
      note,
      qcPassQuantity,
      qcRejectQuantity,
      checkListDetails,
      qcQuantity,
      workCenterId,
      logTimeId,
      itemId,
      type,
      itemType,
      totalPlanQuantity,
      producedQuantity,
      totalImportQuantity,
      totalUnQcQuantity,
      totalQcPassQuantity,
      totalQcRejectQuantity,
      totalQcQuantity,
      previousBomId,
      lotNumber,
      qcQuantityRule,
      qualityPointId,
    } = request;

    const checkInputQcQuantity = validateInputQcQuantity({
      qcQuantity: qcQuantity,
      qcPassQuantity: qcPassQuantity,
      qcRejectQuantity: qcRejectQuantity,
      totalUnQcQuantity: totalUnQcQuantity,
      checkListDetails: checkListDetails,
    });

    if (!checkInputQcQuantity) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.QC_QUANTITY_INVALID'))
        .build();
    }
    const workOrder = await this.produceService.getWorkOrderById(orderId);
    if (!workOrder) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.WORK_ORDER_NOT_FOUND'))
        .build();
    }

    // Validate input QC quantity by awaiting Error reports
    const maximumQcQuantity =
      await this.calculateMaximumQcQuantityByAwaitingErrorReports(
        orderId,
        workCenterId,
        totalUnQcQuantity,
        type,
        itemId,
      );

    if (maximumQcQuantity < qcQuantity) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.QC_QUANTITY_INVALID_NEED'),
        )
        .build();
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const moId = workOrder.mo?.id;
      const producingStepId = workOrder.producingStep?.id;
      // create transactionHistoryEntity
      const transactionHistoryEntity =
        this.transactionHistoryRepository.createEntity({
          orderId: orderId,
          createdByUserId: createdByUserId,
          note: note,
          type: type,
          qcPassQuantity: qcPassQuantity,
          qcRejectQuantity: qcRejectQuantity,
          qcQuantity: qcQuantity,
          workCenterId: workCenterId,
          consignmentName: lotNumber,
          qcQuantityRule: qcQuantityRule,
          itemId: itemId,
          itemType: itemType,
          previousBomId: previousBomId,
          qualityPointId: qualityPointId,
          numberOfTimeQc: numberOfTimeQc,
          moId: moId,
          producingStepId: producingStepId,
        });

      // Assign log time entity to transaction history entity
      const logTimeEntity =
        await this.transactionHistoryLogTimeRepository.findOneByCondition({
          id: logTimeId,
        });
      if (isEmpty(logTimeEntity)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.LOG_TIME_NOT_FOUND'))
          .build();
      }

      transactionHistoryEntity.transactionHistoryLogTime = logTimeEntity;

      // Create transaction history produce steps details log
      const transactionHistoryProduceStepEntity =
        this.transactionHistoryProduceStepRepository.createEntity({
          totalPlanQuantity: totalPlanQuantity,
          producedQuantity: producedQuantity,
          totalImportQuantity: totalImportQuantity,
          totalQcPassQuantity: totalQcPassQuantity,
          totalUnQcQuantity: totalUnQcQuantity,
          totalQcQuantity: totalQcQuantity,
          totalQcRejectQuantity: totalQcRejectQuantity,
          previousBomId: previousBomId,
        });

      await queryRunner.manager.save(
        TransactionHistory,
        transactionHistoryEntity,
      );
      transactionHistoryProduceStepEntity.transactionHistory =
        transactionHistoryEntity;
      await queryRunner.manager.save(transactionHistoryProduceStepEntity);
      // update new code
      transactionHistoryEntity.code =
        TRANSACTION_HISTORY.CODE_PREFIX + transactionHistoryEntity.id;
      await queryRunner.manager.save(
        TransactionHistory,
        transactionHistoryEntity,
      );
      // create transactionHistoryCheckListDetailEntity
      const checkListDetailEntities = request.checkListDetails.map(
        (checkListDetail) =>
          this.transactionHistoryRepository.createTransactionHistoryCheckListDetailEntity(
            {
              checkListDetailId: checkListDetail.id,
              transactionHistoryId: transactionHistoryEntity.id,
              qcPassQuantity: checkListDetail.qcPassQuantity,
              qcRejectedQuantity: checkListDetail.qcRejectQuantity,
            },
          ),
      );

      await queryRunner.manager.save(checkListDetailEntities);

      /*
        Update số lượng QC cho bên MESx nếu số lương lỗi(qcRejectQuantity) = 0
        Kiểm tra Transaction thực hiện qc 2 lần or 1 lần
      */

      let isUpdateData = false;
      let isBack = false;

      if (numberOfTime == NumberOfTime.OneTimes + 1 && qcRejectQuantity == 0) {
        isUpdateData = true;
        isBack = true;
      } else if (
        numberOfTime == NumberOfTime.TwoTimes + 1 &&
        numberOfTimeQc == TransactionHistoryNumberOfTimeQc.theSecondTime &&
        qcRejectQuantity == 0
      ) {
        isUpdateData = true;
        isBack = true;
      } else if (
        numberOfTime == NumberOfTime.TwoTimes + 1 &&
        numberOfTimeQc == TransactionHistoryNumberOfTimeQc.theFirstTime
      ) {
        isBack = true;
      }

      // Gửi dữ liệu sang Mes
      if (isUpdateData) {
        let updateResult;
        switch (type) {
          case TransactionHistoryTypeEnum.OutputProducingStep:
            updateResult = await this.updateWoQcQuantity(
              transactionHistoryEntity,
            );
            break;
          case TransactionHistoryTypeEnum.InputProducingStep:
            //TODO: update WoQcQuantity for QC input produce step materials or previous BOM
            if (itemType == TransactionHistoryItemTypeEnum.Materials) {
              // send qc quantity to material update API
              updateResult = await this.updateWoMaterialQcQuantity(
                transactionHistoryEntity,
              );
            } else if (itemType == TransactionHistoryItemTypeEnum.PreviousBom) {
              // send qc quantity to previous bom update API
              updateResult = await this.updateWoPreviousBomQcQuantity({
                ...transactionHistoryEntity,
                id: previousBomId,
              });
            }
            break;
          default:
            break;
        }

        // if update WC
        if (updateResult.statusCode !== ResponseCodeEnum.SUCCESS) {
          await queryRunner.rollbackTransaction();
          return new ApiError(
            ResponseCodeEnum.BAD_REQUEST,
            updateResult.message,
          ).toResponse();
        }
      }

      await queryRunner.commitTransaction();

      const response = plainToClass(
        CreateProducingStepsTransactionHistoryResponseDto,
        transactionHistoryEntity,
        { excludeExtraneousValues: true },
      );

      // isBack: Trở về màn hình kết thúc QC khi SL lỗi = 0 hoặc đang thực hiện QC lần 1 của công đoạn QC 2 lần.
      const responseWithIsBack = {
        isBack: isBack,
        ...response,
      };

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .withData(responseWithIsBack)
        .build();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CAN_NOT_CREATE'),
      ).toResponse();
    } finally {
      await queryRunner.release();
    }
  }

  public async updateWoMaterialQcQuantity(request: any): Promise<any> {
    const updateRequest = new UpdateWoMaterialInputQcQuantityRequestDto();
    updateRequest.workOrderId = request.orderId;
    updateRequest.passQuantity = parseInt(request.qcPassQuantity);
    updateRequest.rejectQuantity = parseInt(request.qcRejectQuantity);
    updateRequest.itemId = request.itemId;
    updateRequest.note = request.note;
    updateRequest.createdByUserId = request.createdByUserId;
    updateRequest.workCenterId = request.workCenterId;
    updateRequest.executionDay = moment().toDate();
    const updateResult = await this.produceService.updateWoMaterialQcQuantity(
      updateRequest,
    );
    return updateResult;
  }

  public async updateWoPreviousBomQcQuantity(request: any): Promise<any> {
    const updateRequest = new UpdateWoPreviousBomInputQcQuantityRequestDto();
    updateRequest.workOrderId = request.orderId;
    updateRequest.passQuantity = parseInt(request.qcPassQuantity);
    updateRequest.rejectQuantity = parseInt(request.qcRejectQuantity);
    updateRequest.itemId = request.itemId;
    updateRequest.note = request.note;
    updateRequest.id = request.id;
    updateRequest.createdByUserId = request.createdByUserId;
    updateRequest.workCenterId = request.workCenterId;
    updateRequest.executionDay = moment().toDate();
    const updateResult =
      await this.produceService.updateWoPreviousBomQcQuantity(updateRequest);
    return updateResult;
  }

  private async getQcQuantityRuleForInputProduceQc(obj: any) {
    const qualityPointIds = [];
    obj.forEach((item, index, obj) => {
      if (!item.criteriaId) {
        obj.splice(index);
      } else if (!qualityPointIds.includes(item.criteriaId)) {
        qualityPointIds.push(item.criteriaId);
      }
    });
    const qualityPointRaws = {};
    const qualityPointList = await this.qualityPointRepository.getListByIds(
      qualityPointIds,
    );
    if (!isEmpty(qualityPointList)) {
      qualityPointList.forEach((item) => {
        qualityPointRaws[item.id] = item;
      });
    }
    obj.forEach((item) => {
      item.qcQuantityRule = qualityPointRaws[item.criteriaId]
        ? qualityPointRaws[item.criteriaId].formality
        : null;
    });
  }

  public async getIoQcProgressItems(
    request: GetDashboardIoQcProgressRequestDto,
    type: TransactionHistoryIOqcTypeEnum,
  ): Promise<any> {
    const response =
      await this.transactionHistoryRepository.getIoQcProgressItems(
        request,
        type,
      );
    return response;
  }

  private async calculateMaximumQcQuantityByAwaitingErrorReports(
    orderId: number,
    workCenterId: number,
    totalUnQcQuantity: number,
    type: TransactionHistoryTypeEnum,
    itemId?: number,
  ) {
    const result =
      await this.errorReportRepository.getProduceStepsSumQcQuantityByNotConfirmedStatus(
        orderId,
        workCenterId,
        type,
        itemId,
      );
    const sumQcQuantityByNotConfirmedErrorReport =
      parseInt(result?.sumQcQuantity) || 0;
    const maximumQcQuantity =
      totalUnQcQuantity - sumQcQuantityByNotConfirmedErrorReport;
    return maximumQcQuantity;
  }

  async getNotFinishedQcLogTime(): Promise<any> {
    const response =
      await this.transactionHistoryLogTimeRepository.getNotFinishedQcLogTime();
    const result = plainToClass(GetNotFinishedQcLogTimeResponseDto, response, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder()
      .withData(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async validateWcQcPlanForWorkOrder(
    request: ValidateWcQcPlanForWorkOrderRequestDto,
  ): Promise<any> {
    const { workOrderId, workCenterId } = request;
    const woResponse = await this.produceService.getWorkOrderById(workOrderId);
    if (!woResponse) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.WORK_ORDER_NOT_FOUND'))
        .build();
    }
    if (woResponse.producingStep?.qcCheck) {
      // validate produce QC by QC plans if output producing step QC
      const workCenterPlanQcShift =
        await this.workCenterPlanQcShiftRepository.findOneByCondition({
          workOrderId: workOrderId,
          workCenterId: workCenterId,
        });
      if (isEmpty(workCenterPlanQcShift)) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate(
            'error.WORK_CENTER_PLAN_QC_SHIFT_NOT_FOUND',
          ),
        ).toResponse();
      }
    }

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .build();
  }

  public async getMaximumProduceStepQcQuantity(
    request: GetMaximumQcQuantityRequestDto,
  ): Promise<any> {
    const { orderId, itemId, type, totalUnQcQuantity, workCenterId } = request;

    const maximumQcQuantity =
      await this.calculateMaximumQcQuantityByAwaitingErrorReports(
        orderId,
        workCenterId,
        totalUnQcQuantity,
        type,
        itemId,
      );

    const result = plainToClass(
      GetMaximumQcQuantityResponseDto,
      {
        orderId: orderId,
        type: type,
        totalUnQcQuantity: totalUnQcQuantity,
        maximumQcQuantity: maximumQcQuantity,
      },
      { excludeExtraneousValues: true },
    );
    return new ResponseBuilder()
      .withData(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private filterMoItemDetail(
    response: any,
    filterProduceStepIds: any[],
    filterWoIds: any[],
  ): any {
    response.forEach((item) => {
      if (!isEmpty(item.producingSteps)) {
        // filter response by ProduceSteps id
        item.producingSteps.forEach((pr) => {
          // filter response by work order id
          if (!isEmpty(pr.workOrders)) {
            pr.workOrders = pr.workOrders.filter((wo) =>
              filterWoIds.includes(wo.id),
            );
          }
        });

        item.producingSteps = item.producingSteps.filter(
          (pr) =>
            filterProduceStepIds.includes(pr.id) && !isEmpty(pr.workOrders),
        );
      }
    });

    response = response.filter((item) => !isEmpty(item.producingSteps));
    return response;
  }

  async getListTransactionHistoryOverall(
    request: GetListTransactionHistoryOverallRequestDto,
  ): Promise<any> {
    const { keyword, user } = request;
    let poIds = [];
    let soIds = [];
    let proImportIds = [];
    let proExportIds = [];
    let itemIds = [];
    if (keyword) {
      [poIds, soIds, proImportIds, proExportIds] =
        await this.filterOutputQcOrdersByKw(request);
      itemIds = await this.filterItemsByKw(request);
    }
    const { result, count } =
      await this.transactionHistoryRepository.getListTransactionHistoryOverall(
        request,
        poIds,
        soIds,
        proImportIds,
        proExportIds,
        itemIds,
      );
    // Get item information
    await this.mapItemInformation(result);

    // Get order information
    await this.mapOrderInformation(result);

    // QC x lần
    result.forEach((x) => {
      x.numberOfTime = x?.numberOfTime == NumberOfTime.TwoTimes ? 2 : 1;
      x.numberOfTimeQc = x?.numberOfTimeQc ? Number(x.numberOfTimeQc) : null;
    });

    const response = plainToClass(
      TransactionHistoryOverallResponseDto,
      result,
      { excludeExtraneousValues: true },
    );
    return new ResponseBuilder<PagingResponse>({
      items: response,
      meta: {
        total: count,
        page: request.page,
      },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private async mapItemInformation(response: any) {
    const itemIds = [];
    const itemRaws = {};
    if (!isEmpty(response)) {
      response.forEach((item) => {
        if (item.itemId && !itemIds.includes(item.itemId)) {
          itemIds.push(item.itemId);
        }
      });
      const itemList = await this.itemService.getListByIDs(itemIds);
      if (!isEmpty(itemList)) {
        itemList.forEach((item) => {
          itemRaws[item.id] = item;
        });
      }

      response.forEach((res) => {
        res.item = itemRaws[res.itemId];
      });
    }
  }

  private async mapOrderInformation(response: any) {
    const woIds = [];
    const poIds = [];
    const soIds = [];
    const proImportIds = [];
    const proExportIds = [];
    const woRaws = {};
    const poRaws = {};
    const soRaws = {};
    const proImportRaws = {};
    const proExportRaws = {};
    if (!isEmpty(response)) {
      // Get order id list by Type
      response.forEach((item) => {
        if (
          TransactionHistoryProducingStepsQcTypes.includes(parseInt(item.type))
        ) {
          if (item.orderId && !woIds.includes(item.orderId)) {
            woIds.push(item.orderId);
          }
        } else if (item.type == TransactionHistoryTypeEnum.Purchased) {
          if (item.orderId && !poIds.includes(item.orderId)) {
            poIds.push(item.orderId);
          }
        } else if (item.type == TransactionHistoryTypeEnum.ProductionImport) {
          if (item.orderId && !proImportIds.includes(item.orderId)) {
            proImportIds.push(item.orderId);
          }
        } else if (item.type == TransactionHistoryTypeEnum.ProductionExport) {
          if (item.orderId && !proExportIds.includes(item.orderId)) {
            proExportIds.push(item.orderId);
          }
        } else if (item.type == TransactionHistoryTypeEnum.SaleExport) {
          if (item.orderId && !soIds.includes(item.orderId)) {
            soIds.push(item.orderId);
          }
        }
      });
      // Get order list by ids
      const woList = !isEmpty(woIds)
        ? await this.produceService.getWorkOrderByIds(woIds)
        : [];
      const poList = !isEmpty(poIds)
        ? await this.saleService.getPurchasedOrderByIds(poIds)
        : [];
      const soList = !isEmpty(soIds)
        ? await this.saleService.getSaleOrderExportByIds(soIds)
        : [];
      const proImportList = !isEmpty(proImportIds)
        ? await this.saleService.getProductionOrderByIds(proImportIds)
        : [];
      const proExportList = !isEmpty(proExportIds)
        ? await this.saleService.getProductionOrderByIds(proExportIds)
        : [];

      if (!isEmpty(woList)) {
        woList.forEach((wo) => {
          woRaws[wo.id] = wo;
        });
      }
      if (!isEmpty(poList)) {
        poList.forEach((po) => {
          poRaws[po.id] = po;
        });
      }
      if (!isEmpty(soList)) {
        soList.forEach((so) => {
          soRaws[so.id] = so;
        });
      }
      if (!isEmpty(proImportList)) {
        proImportList.forEach((pro) => {
          proImportRaws[pro.id] = pro;
        });
      }
      if (!isEmpty(proExportList)) {
        proExportList.forEach((pro) => {
          proExportRaws[pro.id] = pro;
        });
      }

      // Mapping order by type
      const defaultOrder = {
        id: '',
        code: '',
        name: '',
      };

      response.forEach((item) => {
        if (
          TransactionHistoryProducingStepsQcTypes.includes(parseInt(item.type))
        ) {
          item.order = woRaws[item.orderId]
            ? woRaws[item.orderId]
            : defaultOrder;
        } else if (item.type == TransactionHistoryTypeEnum.Purchased) {
          item.order = poRaws[item.orderId]
            ? poRaws[item.orderId]
            : defaultOrder;
        } else if (item.type == TransactionHistoryTypeEnum.ProductionImport) {
          item.order = proImportRaws[item.orderId]
            ? proImportRaws[item.orderId]
            : defaultOrder;
        } else if (item.type == TransactionHistoryTypeEnum.ProductionExport) {
          item.order = proExportRaws[item.orderId]
            ? proExportRaws[item.orderId]
            : defaultOrder;
        } else if (item.type == TransactionHistoryTypeEnum.SaleExport) {
          item.order = soRaws[item.orderId]
            ? soRaws[item.orderId]
            : defaultOrder;
        }
      });
    }
  }

  private async filterOutputQcOrdersByKw(
    request: GetListTransactionHistoryOverallRequestDto,
  ): Promise<any> {
    const { keyword, user } = request;
    const params = {
      isGetAll: '1',
      user: user,
      filter: [
        {
          column: 'code',
          text: keyword.trim(),
        },
      ],
    };
    const poList = await this.saleService.getPurchasedOrderByConditions(params);
    const proImportParams = params;
    proImportParams.filter.push({
      column: 'type',
      text: TransactionHistoryTypeEnum.ProductionImport.toString(),
    });
    const proImportList = await this.saleService.getProductionOrderByConditions(
      proImportParams,
    );
    const proExportParams = params;
    proImportParams.filter.push({
      column: 'type',
      text: TransactionHistoryTypeEnum.ProductionExport.toString(),
    });
    const proExportList = await this.saleService.getProductionOrderByConditions(
      proExportParams,
    );
    const soParams = params;
    soParams.filter.push({
      column: 'type',
      text: TransactionHistoryTypeEnum.SaleExport.toString(),
    });
    const soList = await this.saleService.getSaleOrderExportByConditions(
      soParams,
    );

    const poIds = !isEmpty(poList) ? uniq(poList.map((item) => item.id)) : [];
    const soIds = !isEmpty(soList) ? uniq(soList.map((item) => item.id)) : [];
    const proImportIds = !isEmpty(proImportList)
      ? uniq(proImportList.map((item) => item.id))
      : [];
    const proExportIds = !isEmpty(proExportList)
      ? uniq(proExportList.map((item) => item.id))
      : [];
    return await Promise.all([poIds, soIds, proImportIds, proExportIds]);
  }

  private async filterItemsByKw(
    request: GetListTransactionHistoryOverallRequestDto,
  ): Promise<any> {
    const { keyword } = request;
    const items = await this.itemService.getItemByConditions({
      isGetAll: '1',
      filter: [
        {
          column: 'name',
          text: keyword.trim(),
        },
      ],
    });
    const itemIds = !isEmpty(items) ? uniq(items.map((item) => item.id)) : [];
    return itemIds;
  }

  public async getProducingStepsQcProgressItems(
    request: GetDashboardFinishedItemProgressRequestDto,
  ): Promise<any> {
    const response =
      await this.transactionHistoryRepository.getProducingStepsQcProgressItems(
        request,
      );
    return response;
  }
}
