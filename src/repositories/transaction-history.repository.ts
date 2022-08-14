import {
  TransactionHistory,
  TransactionHistoryNumberOfTimeQc,
} from '@entities/transaction-history/transaction-history.entity';
import { TransactionHistoryIOqc } from '@entities/transaction-history/transaction-history-ioqc.entity';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { TransactionHistoryRepositoryInterface } from '@components/transaction-history/interface/transaction-history.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Brackets, Connection, Repository } from 'typeorm';
import { TransactionHistoryCheckListDetail } from '@entities/transaction-history/transaction-history-check-list-detail.entity';
import { UpdateQcProgressRequestDto } from '@components/quality-progress/dto/request/update-qc-progress.request.dto';
import {
  DashBoardDateTimeFormat,
  TRANSACTION_HISTORY,
  TransactionHistoryInputQcTypes,
  TransactionHistoryIOqcTypeEnum,
  TransactionHistoryOutputQcTypes,
  TransactionHistoryProducingStepsQcTypes,
  TransactionHistoryTypeEnum,
} from '@components/transaction-history/transaction-history.constant';
import { GetListProducingStepsTransactionHistoryRequestDto } from '@components/transaction-history/dto/request/get-list-producing-steps-transaction-history.request.dto';
import {
  TRANSACTION_HISTORY_CONST,
  BASE_ENTITY_CONST,
} from '../constant/entity.constant';
import { escapeCharForSearch } from '../utils/common';
import { TransactionHistoryListRequestDto } from '../components/transaction-history/dto/request/transaction-history-list.request.dto';
import { isEmpty } from 'lodash';
import { STAGES_OPTION } from '@constant/qc-stage.constant';
import { UpdateIOQcQuantityRequestDto } from '@components/sale/dto/request/update-io-qc-quantity.request.dto';
import { SaleServiceInterface } from '@components/sale/interface/sale.service.interface';
import { I18nService } from 'nestjs-i18n';
import { UpdateQualityPlanIOqcByConfirmErrorReportRequestDto } from '@components/quality-plan/dto/request/update-quality-plan-ioqc.request.dto';
import { QualityPlanIOqcRepositoryInterface } from '@components/quality-plan/interface/quality-plan-ioqc.repository.interface';
import { QualityPlanRepositoryInterface } from '@components/quality-plan/interface/quality-plan.repository.interface';
import { GetListQcTransactionInitDataRequestDto } from '@components/transaction-history/dto/request/get-list-qc-transaction-init-data.request.dto';
import { OrderTypeProductionOrderEnum } from '@components/sale/sale.constant';
import { ActualQuantityImportHistoryRepositoryInterface } from '@components/actual-quantity-import-history/interface/actual-quantity-import-history.repository.interface';
import { GetDashboardIoQcProgressRequestDto } from '@components/dashboard/dto/request/get-dashboard-io-qc-progress-request.dto';
import { ErrorReportStatus } from '@entities/error-report/error-report.entity';
import { QCPlanStatus } from '@entities/quality-plan/quality-plan.entity';
import { GetListTransactionHistoryOverallRequestDto } from '@components/transaction-history/dto/request/get-list-transaction-history-overall.request.dto';
import { NumberOfTime } from '@entities/quality-point/quality-point.entity';
import { NUMBER_OF_TIMES_QC } from '@constant/number-of-times-qc.constant';
import { GetDashboardFinishedItemProgressRequestDto } from '@components/dashboard/dto/request/get-dashboard-finished-item-progress.request.dto';

@Injectable()
export class TransactionHistoryRepository
  extends BaseAbstractRepository<TransactionHistory>
  implements TransactionHistoryRepositoryInterface
{
  constructor(
    @InjectRepository(TransactionHistory)
    private readonly transactionHistoryRepository: Repository<TransactionHistory>,

    @Inject('QualityPlanIOqcRepositoryInterface')
    private readonly qualityPlanIOqcRepository: QualityPlanIOqcRepositoryInterface,

    @Inject('QualityPlanRepositoryInterface')
    private readonly qualityPlanRepository: QualityPlanRepositoryInterface,

    @Inject('SaleServiceInterface')
    private readonly saleService: SaleServiceInterface,

    @Inject('ActualQuantityImportHistoryRepositoryInterface')
    private readonly actualQuantityImportHistoryRepository: ActualQuantityImportHistoryRepositoryInterface,

    @InjectConnection()
    private readonly connection: Connection,

    private readonly i18n: I18nService,
  ) {
    super(transactionHistoryRepository);

    this.fieldMap.set(
      TRANSACTION_HISTORY_CONST.CODE.COL_NAME,
      TRANSACTION_HISTORY_CONST.CODE.DB_COL_NAME,
    );
  }

  createEntity(request: any): TransactionHistory {
    const {
      orderId,
      itemId,
      warehouseId,
      createdByUserId,
      note,
      type,
      qcPassQuantity,
      qcRejectQuantity,
      qcQuantity,
      workCenterId,
      itemType,
      previousBomId,
      consignmentName,
      qcQuantityRule,
      qualityPointId,
      numberOfTimeQc,
      moId,
      producingStepId,
    } = request;
    const transactionHistory = new TransactionHistory();

    transactionHistory.orderId = orderId;
    transactionHistory.warehouseId = warehouseId;
    transactionHistory.itemId = itemId;
    transactionHistory.createdByUserId = createdByUserId;
    transactionHistory.note = note;
    transactionHistory.type = type;
    transactionHistory.qcRejectQuantity = qcRejectQuantity;
    transactionHistory.qcPassQuantity = qcPassQuantity;
    transactionHistory.qcQuantity = qcQuantity;
    transactionHistory.workCenterId = workCenterId;
    transactionHistory.itemType = itemType;
    transactionHistory.previousBomId = previousBomId;
    transactionHistory.consignmentName = consignmentName;
    transactionHistory.qcQuantityRule = qcQuantityRule;
    transactionHistory.qualityPointId = qualityPointId;
    transactionHistory.numberOfTimeQc = numberOfTimeQc;
    transactionHistory.moId = moId;
    transactionHistory.producingStepId = producingStepId;
    return transactionHistory;
  }

  createTransactionHistoryIOqcEntity(request: any): TransactionHistoryIOqc {
    const {
      transactionHistoryId,
      planQuantityOrder,
      qcNeedQuantityOrder,
      qcDoneQuantityOrder,
      qcPassQuantityOrder,
      qcRejectQuantityOrder,
    } = request;
    const transactionHistoryIOqc = new TransactionHistoryIOqc();

    transactionHistoryIOqc.transactionHistoryId = transactionHistoryId;
    transactionHistoryIOqc.planQuantity = planQuantityOrder;
    transactionHistoryIOqc.qcNeedQuantity = qcNeedQuantityOrder;
    transactionHistoryIOqc.qcDoneQuantity = qcDoneQuantityOrder;
    transactionHistoryIOqc.qcPassQuantity = qcPassQuantityOrder;
    transactionHistoryIOqc.qcRejectQuantity = qcRejectQuantityOrder;

    return transactionHistoryIOqc;
  }

  createTransactionHistoryCheckListDetailEntity(
    request: any,
  ): TransactionHistoryCheckListDetail {
    const {
      checkListDetailId,
      transactionHistoryId,
      qcPassQuantity,
      qcRejectedQuantity,
    } = request;
    const transactionHistoryCheckListDetail =
      new TransactionHistoryCheckListDetail();
    transactionHistoryCheckListDetail.checkListDetailId = checkListDetailId;
    transactionHistoryCheckListDetail.transactionHistoryId =
      transactionHistoryId;
    transactionHistoryCheckListDetail.qcPassQuantity = qcPassQuantity;
    transactionHistoryCheckListDetail.qcRejectQuantity = qcRejectedQuantity;
    return transactionHistoryCheckListDetail;
  }

  async findTransactionHistoryById(id: number): Promise<TransactionHistory> {
    const transactionHistoryAlias = 'th';
    const transactionHistoryIOqcAlias = 'thio';
    const checkListDetailAlias = 'cld';
    const transactionHistoryCheckListDetailAlias = 'thcld';
    const errorReportAlias = 'er';

    return await this.transactionHistoryRepository
      .createQueryBuilder(transactionHistoryAlias)
      .leftJoinAndSelect(
        `${transactionHistoryAlias}.transactionHistoryCheckListDetails`,
        transactionHistoryCheckListDetailAlias,
      )
      .leftJoinAndSelect(
        `${transactionHistoryCheckListDetailAlias}.checkListDetail`,
        checkListDetailAlias,
      )
      .leftJoinAndSelect(
        `${transactionHistoryAlias}.transactionHistoryIOqc`,
        transactionHistoryIOqcAlias,
      )
      .leftJoinAndSelect(
        `${transactionHistoryAlias}.errorReport`,
        errorReportAlias,
      )
      .where(`"${transactionHistoryAlias}"."id" = :pId`, { pId: id })
      .getOne();
  }

  async updateQualityProgress(
    request: UpdateQcProgressRequestDto,
    type: TransactionHistoryTypeEnum,
  ): Promise<TransactionHistory> {
    const {
      createdByUserId,
      orderId,
      warehouseId,
      itemId,
      qcPassQuantity,
      qcRejectQuantity,
      qcQuantity,
      note,
      consignmentName,
      qcCriteriaId,
      numberOfTime,
      numberOfTimeQc,
    } = request;

    const queryRunner = await this.connection.createQueryRunner();
    const manager = queryRunner.manager;

    try {
      await queryRunner.startTransaction();

      const requestTransactionHistoryCheckListDetails =
        request.transactionHistoryCheckListDetails;
      const transactionHistory = this.createEntity({
        type: type,
        createdByUserId: createdByUserId,
        orderId: orderId,
        itemId: itemId,
        warehouseId: warehouseId,
        qcPassQuantity: qcPassQuantity,
        qcRejectQuantity: qcRejectQuantity,
        qcQuantity: qcQuantity,
        note: note,
        consignmentName: consignmentName,
        qualityPointId: qcCriteriaId,
        numberOfTimeQc: numberOfTimeQc,
      });

      await manager.save(transactionHistory);

      const executionDateByQualityPlan =
        await this.checkExecutionDateByQualityPlan(
          transactionHistory.type,
          transactionHistory.orderId,
          transactionHistory.warehouseId,
          transactionHistory.itemId,
          transactionHistory.executionDateByPlan,
        );

      if (executionDateByQualityPlan) {
        transactionHistory.executionDateByPlan = executionDateByQualityPlan;
      }

      transactionHistory.code =
        TRANSACTION_HISTORY.CODE_PREFIX + transactionHistory.id;
      await manager.save(transactionHistory);

      const transactionHistoryIOqc = this.createTransactionHistoryIOqcEntity({
        transactionHistoryId: transactionHistory.id,
        planQuantityOrder: request?.transactionHistoryIOqc?.planQuantity,
        qcNeedQuantityOrder:
          request?.transactionHistoryIOqc?.qcNeedTotalQuantity,
        qcDoneQuantityOrder:
          request?.transactionHistoryIOqc?.qcDoneTotalQuantity,
        qcPassQuantityOrder:
          request?.transactionHistoryIOqc?.qcPassTotalQuantity,
        qcRejectQuantityOrder:
          request?.transactionHistoryIOqc?.qcRejectTotalQuantity,
      });
      await manager.save(transactionHistoryIOqc);

      const checkListDetailEntities =
        requestTransactionHistoryCheckListDetails.map((checkListDetail) =>
          this.createTransactionHistoryCheckListDetailEntity({
            checkListDetailId: checkListDetail.checkListDetailId,
            transactionHistoryId: transactionHistory.id,
            qcPassQuantity: checkListDetail.qcPassQuantity,
            qcRejectedQuantity: checkListDetail.qcRejectQuantity,
          }),
        );
      await queryRunner.manager.save(checkListDetailEntities);

      /*
        Update số lượng QC cho bên MESx nếu số lương lỗi(qcRejectQuantity) = 0
        Kiểm tra Transaction thực hiện qc 2 lần or 1 lần
      */

      let isUpdateData = false;

      if (numberOfTime == NumberOfTime.OneTimes + 1 && qcRejectQuantity == 0) {
        isUpdateData = true;
      } else if (
        numberOfTime == NumberOfTime.TwoTimes + 1 &&
        numberOfTimeQc == TransactionHistoryNumberOfTimeQc.theSecondTime &&
        qcRejectQuantity == 0
      ) {
        isUpdateData = true;
      }

      if (isUpdateData) {
        // Update kế hoạch QC QMSX (kế hoạch Tổng)
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
          throw new Error(
            await this.i18n.translate('error.CANNOT_UPDATE_IO_QC'),
          );
          await queryRunner.rollbackTransaction();
        }
        await queryRunner.manager.save(updateQualityPlanIOqc);

        // UPDATE STATUS PLAN TODO
        const orderId = transactionHistory?.orderId;
        if (!orderId) {
          throw new Error(
            await this.i18n.translate('error.UPDATE_STATUS_PLAN_FAIL'),
          );
        }

        const qualityPlan = await this.qualityPlanRepository.findOneByCondition(
          {
            join: {
              alias: 'qp',
              innerJoin: {
                qpio: 'qp.qualityPlanIOqcs',
              },
            },
            where: (er) => {
              er.where('qpio.orderId = :orderId', { orderId: orderId });
            },
          },
        );

        if (!qualityPlan) {
          throw new Error(
            await this.i18n.translate('error.UPDATE_STATUS_PLAN_FAIL'),
          );
        }

        if (qualityPlan?.status == QCPlanStatus?.Confirmed) {
          qualityPlan.status = QCPlanStatus?.InProgress;
          await queryRunner.manager.save(qualityPlan);
        }

        // UPDATE DATA FOR MES
        const updateIORequest = new UpdateIOQcQuantityRequestDto();

        switch (Number(transactionHistory.type)) {
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

        updateIORequest.lotNumber = transactionHistory.consignmentName;
        updateIORequest.lotDate = transactionHistory.createdAt;
        updateIORequest.warehouseId = transactionHistory.warehouseId;
        updateIORequest.itemId = transactionHistory.itemId;
        updateIORequest.qcPassQuantity = Number(
          transactionHistory.qcPassQuantity,
        );
        updateIORequest.qcRejectQuantity = Number(
          transactionHistory.qcRejectQuantity,
        );
        updateIORequest.lotNumber = transactionHistory.consignmentName;

        const updateResult = await this.saleService.updateIOQcQuantity(
          updateIORequest,
          Number(transactionHistory.type),
        );

        if (!updateResult) {
          throw new Error(await this.i18n.translate('error.UPDATE_ORDER_FAIL'));
        }
      }

      await queryRunner.commitTransaction();

      return transactionHistory;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error?.message || error);
    } finally {
      if (manager) manager.release();
      if (queryRunner) queryRunner.release();
    }
  }

  public async checkExecutionDateByQualityPlan(
    qcStageId: number,
    orderId: number,
    warehouseId: number,
    itemId: number,
    executionDateByPlan: any,
  ): Promise<any> {
    const qualityPlanByExecutionDate =
      await this.qualityPlanRepository.findQualityPlanByExecutionDate(
        qcStageId,
        orderId,
        warehouseId,
        itemId,
        executionDateByPlan,
      );

    if (!qualityPlanByExecutionDate) {
      const qualityPlan =
        await this.qualityPlanRepository.findQualityPlanByExecutionDate(
          qcStageId,
          orderId,
          warehouseId,
          itemId,
        );

      const qualityPlanIOqcDetails =
        qualityPlan.qualityPlanIOqcs[0]?.qualityPlanIOqcDetails;
      const planToList = qualityPlanIOqcDetails.map((x) => x.planTo);
      const maxDatePlanTo = new Date(Math.max.apply(null, planToList));

      return maxDatePlanTo;
    }

    return null;
  }

  async getListProducingStepsQC(
    request: GetListProducingStepsTransactionHistoryRequestDto,
    woFilterMoIds?: number[],
    woFilterKwIds?: number[],
    filterItemIds?: number[],
    itemFilterKwIds?: number[],
  ): Promise<any> {
    const { keyword, filter, take, skip, sort } = request;

    let query = this.transactionHistoryRepository
      .createQueryBuilder('th')
      .withDeleted()
      .select([
        'th.id as "id"',
        'th.createdAt as "createdAt"',
        'th.code as "code"',
        'th.orderId as "workOrderId"',
        'th.itemId as "itemId"',
        'th.type as "type"',
        'th.itemType as "itemType"',
        'th.numberOfTimeQc as "numberOfTimeQc"',
        'qp.formality as "formality"',
        'qp.numberOfTime as "numberOfTime"',
        'ther.code as "errorReportCode"',
        'ther.name as "errorReportName"',
        `CASE WHEN COUNT(ther) = 0 THEN '{}' ELSE JSONB_BUILD_OBJECT( 'id', ther.id,'name', ther.name, 'code', ther.code) END AS "errorReport"`,
      ])
      .where(`th.type IN (:...t)`, {
        t: [
          TransactionHistoryTypeEnum.OutputProducingStep,
          TransactionHistoryTypeEnum.InputProducingStep,
        ],
      })
      .leftJoin('th.errorReport', 'ther')
      .leftJoin('quality_points', 'qp', 'th.quality_point_id = qp.id');

    if (keyword) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where(`LOWER("th"."code") LIKE LOWER(:pkeyWord) escape '\\'`, {
            pkeyWord: `%${escapeCharForSearch(keyword)}%`,
          });
          if (!isEmpty(woFilterKwIds)) {
            qb.orWhere(`"th"."order_id" IN (:...woFilterKwIds)`, {
              woFilterKwIds: woFilterKwIds,
            });
          }
          if (!isEmpty(itemFilterKwIds)) {
            qb.orWhere(`"th"."item_id" IN (:...itemFilterKwIds)`, {
              itemFilterKwIds: itemFilterKwIds,
            });
          }
        }),
      );
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'createdAt':
            const createdFrom = item.text.split('|')[0];
            const createdTo = item.text.split('|')[1];
            query = query.andWhere(
              `"th"."created_at" between :createdFrom AND :createdTo`,
              {
                createdFrom: createdFrom,
                createdTo: createdTo,
              },
            );
            break;
          case 'code':
            query.andWhere(`LOWER("th"."code") LIKE LOWER(:code) ESCAPE '\\'`, {
              code: `%${escapeCharForSearch(item.text)}%`,
            });
            break;
          // case 'parentBomName':
          //   if (!isEmpty(filterItemIds)) {
          //     query.andWhere(`"th"."item_id" IN (:...itemIds)`, {
          //       itemIds: filterItemIds,
          //     });
          //   }
          //   break;
          case 'producingStepName':
            if (!isEmpty(woFilterMoIds)) {
              query.andWhere(`"th"."order_id" IN (:...woFilterMoIds)`, {
                woFilterMoIds: woFilterMoIds,
              });
            }
            break;
          case 'moId':
            if (!isEmpty(woFilterMoIds)) {
              query.andWhere(`"th"."order_id" IN (:...woFilterMoIds)`, {
                woFilterMoIds: woFilterMoIds,
              });
            }
            break;
          case 'moCode':
            if (!isEmpty(woFilterMoIds)) {
              query.andWhere(`"th"."order_id" IN (:...woFilterMoIds)`, {
                woFilterMoIds: woFilterMoIds,
              });
            }
            break;
          case 'moName':
            if (!isEmpty(woFilterMoIds)) {
              query.andWhere(`"th"."order_id" IN (:...woFilterMoIds)`, {
                woFilterMoIds: woFilterMoIds,
              });
            }
            break;
          case 'errorReportCode':
            query.andWhere(`LOWER(ther.code) LIKE LOWER(:code) ESCAPE '\\'`, {
              code: `%${escapeCharForSearch(item.text)}%`,
            });
            break;
          case 'numberOfTimeSearch':
            switch (Number(item?.text)) {
              case NUMBER_OF_TIMES_QC.QC_ONE:
                query.andWhere(`qp.number_of_time = :numberOfTime1`, {
                  numberOfTime1: NumberOfTime.OneTimes,
                });
                break;
              case NUMBER_OF_TIMES_QC.QC_ONE_TWO:
                query
                  .andWhere(`th.number_of_time_qc = :numberOfTimeQc12`, {
                    numberOfTimeQc12:
                      TransactionHistoryNumberOfTimeQc.theFirstTime,
                  })
                  .andWhere(`qp.number_of_time = :numberOfTime12`, {
                    numberOfTime12: NumberOfTime.TwoTimes,
                  });
                break;
              case NUMBER_OF_TIMES_QC.QC_TWO_TWO:
                query
                  .andWhere(`th.number_of_time_qc = :numberOfTimeQc22`, {
                    numberOfTimeQc22:
                      TransactionHistoryNumberOfTimeQc.theSecondTime,
                  })
                  .andWhere(`qp.number_of_time = :numberOfTime22`, {
                    numberOfTime22: NumberOfTime.TwoTimes,
                  });
                break;
              case NUMBER_OF_TIMES_QC.QC_TWO:
                query.andWhere(`qp.number_of_time = :numberOfTime2`, {
                  numberOfTime2: NumberOfTime.TwoTimes,
                });
                break;
              default:
                break;
            }
            break;
          default:
            break;
        }
      });
    }

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        switch (item.column) {
          case 'code':
            query = query.orderBy('"id"', item.order);
            break;
          case 'createdAt':
            query = query.orderBy('"createdAt"', item.order);
            break;
          case 'errorReportCode':
            query = query.orderBy('ther.id', item.order);
            break;
          default:
            break;
        }
      });
    } else {
      query = query.orderBy('th.id', 'DESC');
    }

    query = query.groupBy('th.id').addGroupBy('ther.id').addGroupBy('qp.id');

    const result = await query.getRawMany();
    const count = await query.getCount();

    return {
      result: result,
      count: count,
    };
  }

  async getListTransactionHistoryIOqcForWeb(
    request: GetListQcTransactionInitDataRequestDto,
    type: number,
    filterItemIds: number[],
    filterStageIds: number[],
    poIds: number[],
    proIds: number[],
    soIds: number[],
  ): Promise<any> {
    const { filter, sort, keyword, skip, take } = request;
    let qcStageInputIds;

    if (type == OrderTypeProductionOrderEnum.Input) {
      qcStageInputIds = [STAGES_OPTION.PO_IMPORT, STAGES_OPTION.PRO_IMPORT];
    } else if (type == OrderTypeProductionOrderEnum.Output) {
      qcStageInputIds = [STAGES_OPTION.PRO_EXPORT, STAGES_OPTION.SO_EXPORT];
    }

    let query = this.transactionHistoryRepository
      .createQueryBuilder('th')
      .select([
        'th.id as "id"',
        'th.code as "code"',
        'th.orderId as "orderId"',
        'th.itemId as "itemId"',
        'th.createdAt as "createdAt"',
        'th.type as "type"',
        'th.numberOfTimeQc as "numberOfTimeQc"',
        'qp.formality as "formality"',
        'qp.numberOfTime as "numberOfTime"',
        'er.code as "errorReportCode"',
        'er.name as "errorReportName"',
      ])
      .where(`th.type IN (:...type)`, { type: qcStageInputIds })
      .leftJoin('th.errorReport', 'er')
      .leftJoin('quality_points', 'qp', 'th.quality_point_id = qp.id');

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'code':
            query.andWhere(`LOWER("th"."code") LIKE LOWER(:code) ESCAPE '\\'`, {
              code: `%${escapeCharForSearch(item.text)}%`,
            });
            break;
          case 'orderCode':
            if (type == OrderTypeProductionOrderEnum.Input) {
              const subQueryInput = this.transactionHistoryRepository
                .createQueryBuilder('th')
                .select('th.id')
                .where(
                  new Brackets((qb) => {
                    qb.where(
                      new Brackets((qb0) => {
                        qb0
                          .where('th.type = :qcStageId0', {
                            qcStageId0: STAGES_OPTION.PO_IMPORT,
                          })
                          .andWhere('th.orderId IN (:...orderId0)', {
                            orderId0: [null, ...poIds],
                          });
                      }),
                    ).orWhere(
                      new Brackets((qb2) => {
                        qb2
                          .where('th.type = :qcStageId2', {
                            qcStageId2: STAGES_OPTION.PRO_IMPORT,
                          })
                          .andWhere('th.orderId IN (:...orderId2)', {
                            orderId2: [null, ...proIds],
                          });
                      }),
                    );
                  }),
                )
                .distinct();

              query = query
                .andWhere('th.id IN (' + subQueryInput.getQuery() + ')')
                .setParameters(subQueryInput.getParameters());
            } else if (type == OrderTypeProductionOrderEnum.Output) {
              const subQueryOutput = this.transactionHistoryRepository
                .createQueryBuilder('th')
                .select('th.id')
                .where(
                  new Brackets((qb) => {
                    qb.where(
                      new Brackets((qb3) => {
                        qb3
                          .where('th.type = :qcStageId3', {
                            qcStageId3: STAGES_OPTION.PRO_EXPORT,
                          })
                          .andWhere('th.orderId IN (:...orderId3)', {
                            orderId3: [null, ...proIds],
                          });
                      }),
                    ).orWhere(
                      new Brackets((qb5) => {
                        qb5
                          .where('th.type = :qcStageId5', {
                            qcStageId5: STAGES_OPTION.SO_EXPORT,
                          })
                          .andWhere('th.orderId IN (:...orderId5)', {
                            orderId5: [null, ...soIds],
                          });
                      }),
                    );
                  }),
                )
                .distinct();

              query = query
                .andWhere('th.id IN (' + subQueryOutput.getQuery() + ')')
                .setParameters(subQueryOutput.getParameters());
            }
            break;
          case 'orderName':
            if (type == OrderTypeProductionOrderEnum.Input) {
              const subQueryInput = this.transactionHistoryRepository
                .createQueryBuilder('th')
                .select('th.id')
                .where(
                  new Brackets((qb) => {
                    qb.where(
                      new Brackets((qb0) => {
                        qb0
                          .where('th.type = :qcStageId0', {
                            qcStageId0: STAGES_OPTION.PO_IMPORT,
                          })
                          .andWhere('th.orderId IN (:...orderId0)', {
                            orderId0: [null, ...poIds],
                          });
                      }),
                    ).orWhere(
                      new Brackets((qb2) => {
                        qb2
                          .where('th.type = :qcStageId2', {
                            qcStageId2: STAGES_OPTION.PRO_IMPORT,
                          })
                          .andWhere('th.orderId IN (:...orderId2)', {
                            orderId2: [null, ...proIds],
                          });
                      }),
                    );
                  }),
                )
                .distinct();

              query = query
                .andWhere('th.id IN (' + subQueryInput.getQuery() + ')')
                .setParameters(subQueryInput.getParameters());
            } else if (type == OrderTypeProductionOrderEnum.Output) {
              const subQueryOutput = this.transactionHistoryRepository
                .createQueryBuilder('th')
                .select('th.id')
                .where(
                  new Brackets((qb) => {
                    qb.where(
                      new Brackets((qb3) => {
                        qb3
                          .where('th.type = :qcStageId3', {
                            qcStageId3: STAGES_OPTION.PRO_EXPORT,
                          })
                          .andWhere('th.orderId IN (:...orderId3)', {
                            orderId3: [null, ...proIds],
                          });
                      }),
                    ).orWhere(
                      new Brackets((qb5) => {
                        qb5
                          .where('th.type = :qcStageId5', {
                            qcStageId5: STAGES_OPTION.SO_EXPORT,
                          })
                          .andWhere('th.orderId IN (:...orderId5)', {
                            orderId5: [null, ...soIds],
                          });
                      }),
                    );
                  }),
                )
                .distinct();

              query = query
                .andWhere('th.id IN (' + subQueryOutput.getQuery() + ')')
                .setParameters(subQueryOutput.getParameters());
            }
            break;
          case 'itemName':
            if (!isEmpty(filterItemIds)) {
              query.andWhere(`"th"."item_id" IN (:...itemIds)`, {
                itemIds: filterItemIds,
              });
            }
            break;
          case 'itemCode':
            if (!isEmpty(filterItemIds)) {
              query.andWhere(`"th"."item_id" IN (:...itemIds)`, {
                itemIds: filterItemIds,
              });
            }
            break;
          case 'createdAt':
            const createdFrom = item.text.split('|')[0];
            const createdTo = item.text.split('|')[1];
            query = query.andWhere(
              `"th"."created_at" between :createdFrom AND :createdTo`,
              {
                createdFrom: createdFrom,
                createdTo: createdTo,
              },
            );
            break;
          case 'stageName':
            if (!isEmpty(filterStageIds)) {
              query.andWhere(`"th"."type" IN (:...stageIds)`, {
                stageIds: filterStageIds,
              });
            }
            break;
          case 'errorReportCode':
            query.andWhere(`LOWER(er.code) LIKE LOWER(:code) ESCAPE '\\'`, {
              code: `%${escapeCharForSearch(item.text)}%`,
            });
            break;
          case 'numberOfTimeSearch':
            switch (Number(item?.text)) {
              case NUMBER_OF_TIMES_QC.QC_ONE:
                query.andWhere(`qp.number_of_time = :numberOfTime1`, {
                  numberOfTime1: NumberOfTime.OneTimes,
                });
                break;
              case NUMBER_OF_TIMES_QC.QC_ONE_TWO:
                query
                  .andWhere(`th.number_of_time_qc = :numberOfTimeQc12`, {
                    numberOfTimeQc12:
                      TransactionHistoryNumberOfTimeQc.theFirstTime,
                  })
                  .andWhere(`qp.number_of_time = :numberOfTime12`, {
                    numberOfTime12: NumberOfTime.TwoTimes,
                  });
                break;
              case NUMBER_OF_TIMES_QC.QC_TWO_TWO:
                query
                  .andWhere(`th.number_of_time_qc = :numberOfTimeQc22`, {
                    numberOfTimeQc22:
                      TransactionHistoryNumberOfTimeQc.theSecondTime,
                  })
                  .andWhere(`qp.number_of_time = :numberOfTime22`, {
                    numberOfTime22: NumberOfTime.TwoTimes,
                  });
                break;
              case NUMBER_OF_TIMES_QC.QC_TWO:
                query.andWhere(`qp.number_of_time = :numberOfTime2`, {
                  numberOfTime2: NumberOfTime.TwoTimes,
                });
                break;
              default:
                break;
            }
            break;
          default:
            break;
        }
      });
    }

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        switch (item.column) {
          case 'code':
            query = query.orderBy('"id"', item.order);
            break;
          case 'createdAt':
            query = query.orderBy('"createdAt"', item.order);
            break;
          case 'errorReportCode':
            query = query.orderBy('er.id', item.order);
            break;
          default:
            break;
        }
      });
    } else {
      query = query.orderBy('th.id', 'DESC');
    }

    query = query.groupBy('th.id').addGroupBy('er.id').addGroupBy('qp.id');

    const result = await query.getRawMany();
    const count = await query.getCount();

    return {
      result: result,
      count: count,
    };
  }

  async getListTransactionHistoryIOqcForApp(
    request: GetListQcTransactionInitDataRequestDto,
    keywordOrderIds: number[],
    keywordItemIds: number[],
    filterOrderIds: number[],
    filteredArrayOrderIds: number[],
  ): Promise<any> {
    const { type, filter, skip, take } = request;
    let qcStageInputIds;

    if (type == OrderTypeProductionOrderEnum.Input) {
      qcStageInputIds = [STAGES_OPTION.PO_IMPORT, STAGES_OPTION.PRO_IMPORT];
    } else if (type == OrderTypeProductionOrderEnum.Output) {
      qcStageInputIds = [STAGES_OPTION.PRO_EXPORT, STAGES_OPTION.SO_EXPORT];
    }

    let query = this.transactionHistoryRepository
      .createQueryBuilder('th')
      .select([
        'th.id as "id"',
        'th.code as "code"',
        'th.order_id as "orderId"',
        'th.item_id as "itemId"',
        'th.created_at as "createdAt"',
        'th.type as "type"',
      ])
      .where(`th.type IN (:...type)`, { type: qcStageInputIds });

    const keyword = request.keyword?.trim();

    if (!isEmpty(keyword)) {
      if (!isEmpty(keywordOrderIds) && !isEmpty(keywordItemIds)) {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where('th.orderId IN (:...orderIds)', {
              orderIds: keywordOrderIds,
            })
              .orWhere('th.itemId IN (:...itemIds)', {
                itemIds: keywordItemIds,
              })
              .orWhere(`LOWER(th.code) LIKE LOWER(:pkeyWord) escape '\\'`, {
                pkeyWord: `%${escapeCharForSearch(keyword)}%`,
              });
          }),
        );
      } else if (!isEmpty(keywordOrderIds) && isEmpty(keywordItemIds)) {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where('th.orderId IN (:...orderIds)', {
              orderIds: keywordOrderIds,
            }).orWhere(`LOWER(th.code) LIKE LOWER(:pkeyWord) escape '\\'`, {
              pkeyWord: `%${escapeCharForSearch(keyword)}%`,
            });
          }),
        );
      } else if (isEmpty(keywordOrderIds) && !isEmpty(keywordItemIds)) {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where('th.itemId IN (:...itemIds)', {
              itemIds: keywordItemIds,
            }).orWhere(`LOWER(th.code) LIKE LOWER(:pkeyWord) escape '\\'`, {
              pkeyWord: `%${escapeCharForSearch(keyword)}%`,
            });
          }),
        );
      } else if (isEmpty(keywordOrderIds) && isEmpty(keywordItemIds)) {
        query = query.andWhere(
          `LOWER(th.code) LIKE LOWER(:pkeyWord) escape '\\'`,
          { pkeyWord: `%${escapeCharForSearch(keyword)}%` },
        );
      }
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'code':
            if (!isEmpty(filterOrderIds)) {
              query.andWhere('th.orderId IN (:...orderIds)', {
                orderIds: filterOrderIds,
              });
            }
            break;
          case 'createdAt':
            const createdFrom = item.text.split('|')[0];
            const createdTo = item.text.split('|')[1];
            query = query.andWhere(
              'th.createdAt between :createdFrom AND :createdTo',
              {
                createdFrom: createdFrom,
                createdTo: createdTo,
              },
            );
            break;
          default:
            break;
        }
      });
    }

    // Query last
    if (!isEmpty(filteredArrayOrderIds)) {
      query.andWhere('th.orderId IN (:...orderIds)', {
        orderIds: filteredArrayOrderIds,
      });
    }

    query = query.orderBy('th.id', 'DESC');

    const result = await query.offset(skip).limit(take).getRawMany();
    const count = await query.getCount();

    return {
      result: result,
      total: count,
    };
  }

  public async getProducingStepsQCDetail(id: number): Promise<any> {
    const query = this.transactionHistoryRepository
      .createQueryBuilder('th')
      .select([
        'th.id as "id"',
        'th.createdAt as "createdAt"',
        'th.code as "code"',
        'th.orderId as "workOrderId"',
        'th.createdByUserId as "createdByUserId"',
        'th.qcPassQuantity as "qcPassQuantity"',
        'th.qcRejectQuantity as "qcRejectQuantity"',
        'th.consignmentName as "lotNumber"',
        'th.qcQuantityRule as "qcQuantityRule"',
        'thps.transactionHistoryId as "transactionHistoryId"',
        'thps.totalPlanQuantity as "totalPlanQuantity"',
        'thps.totalQcPassQuantity as "totalQcPassQuantity"',
        'thps.totalQcRejectQuantity as "totalQcRejectQuantity"',
        'thps.totalUnQcQuantity as "totalUnQcQuantity"',
        'thps.totalQcQuantity as "totalQcQuantity"',
        'thps.producedQuantity as "producedQuantity"',
        'th.workCenterId as "workCenterId"',
        'th.note as "note"',
        'th.itemType as "itemType"',
        'th.type as "type"',
        'th.itemId as "itemId"',
        'th.previousBomId as "previousBomId"',
        'th.numberOfTimeQc as "numberOfTimeQc"',
        'th.qualityPointId as "qualityPointId"',
      ])
      .innerJoin('th.transactionHistoryProduceStep', 'thps')
      .groupBy('th.id')
      .addGroupBy('thps.id')
      .where('th.id = :Id', { Id: id });
    return await query.getRawOne();
  }

  public async getDataQCDetailShowCreateForm(id: number): Promise<any> {
    const query = this.transactionHistoryRepository
      .createQueryBuilder('th')
      .select([
        'th.id as "id"',
        'th.createdAt as "createdAt"',
        'th.code as "code"',
        'th.orderId as "workOrderId"',
        'th.createdByUserId as "createdByUserId"',
        'th.qcPassQuantity as "qcPassQuantity"',
        'th.qcRejectQuantity as "qcRejectQuantity"',
        'th.workCenterId as "workCenterId"',
        'th.consignmentName as "consignmentName"',
        'th.itemType as "itemType"',
        'th.type as "type"',
        'th.itemId as "itemId"',
      ])
      .where('th.id = :Id', { Id: id });

    return await query.getRawOne();
  }

  public async getTransactionQcDetail(id: number): Promise<any> {
    const query = this.transactionHistoryRepository
      .createQueryBuilder('th')
      .select([
        'th.id as "id"',
        'th.code as "code"',
        'th.workCenterId as "workCenterId"',
        'th.qualityPointId as "qualityPointId"',
        'th.numberOfTimeQc as "numberOfTimeQc"',
        'th.consignmentName as "consignmentName"',
      ])
      .where('th.id = :Id', { Id: id });
    return await query.getRawOne();
  }

  public async getCheckListDetailsByTransactionHistory(
    transactionHistoryId: number,
  ): Promise<any> {
    const query = this.transactionHistoryRepository
      .createQueryBuilder('th')
      .select([
        'cd.id as "id"',
        'cd.title as "title"',
        'thcd.qc_pass_quantity as "qcPassQuantity"',
        'thcd.qc_reject_quantity as "qcRejectQuantity"',
        `CASE WHEN COUNT(eg) = 0 THEN '{}' ELSE JSONB_BUILD_OBJECT( 'id', eg.id,'name', eg.name) END AS "errorGroup"`,
      ])
      .innerJoin('th.transactionHistoryCheckListDetails', 'thcd')
      .innerJoin('thcd.checkListDetail', 'cd')
      .innerJoin('cd.errorGroup', 'eg')
      .groupBy('th.id')
      .addGroupBy('cd.id')
      .addGroupBy('eg.id')
      .addGroupBy('thcd.qcPassQuantity')
      .addGroupBy('thcd.qc_reject_quantity')
      .where(`th.id = :tId`, {
        tId: transactionHistoryId,
      });
    return await query.getRawMany();
  }

  public async getList(request: TransactionHistoryListRequestDto) {
    const alias = 'th';
    const { orderId, type, skip, take } = request;
    const keyword = request.keyword?.trim();

    let query = this.transactionHistoryRepository
      .createQueryBuilder(alias)
      .where(
        `"${alias}"."${TRANSACTION_HISTORY_CONST.TYPE.DB_COL_NAME}" = :pType`,
        { pType: type },
      );

    if (orderId)
      query.andWhere(
        `"${alias}"."${TRANSACTION_HISTORY_CONST.ORDER_ID.DB_COL_NAME}" = :pOrderId`,
        { pOrderId: orderId },
      );

    if (keyword) {
      query = query.andWhere(
        `(LOWER("${alias}"."${TRANSACTION_HISTORY_CONST.CODE.DB_COL_NAME}") LIKE LOWER(:pkeyWord) escape '\\'`,
        {
          pkeyWord: `%${escapeCharForSearch(keyword)}%`,
        },
      );
    }

    query = await request.buildSearchFilterQuery(query, this.fieldMap);

    const [result, total] = await query
      .offset(skip)
      .limit(take)
      .getManyAndCount();

    return {
      result: result,
      count: total,
    };
  }
  public async getDetail(id: number): Promise<any> {
    const query = this.transactionHistoryRepository
      .createQueryBuilder('th')
      .select([
        'th.id as "id"',
        'th.createdByUserId as "createdByUserId"',
        'th.createdAt as "createdAt"',
        'th.code as "code"',
        'th.orderId as "orderId"',
        'th.workCenterId as "workCenterId"',
        'th.warehouseId as "warehouseId"',
        'th.itemId as "itemId"',
        'th.itemType as "itemType"',
        'th.previousBomId as "previousBomId"',
        'th.createdByUserId as "createdByUserId"',
        'th.qcPassQuantity as "qcPassQuantity"',
        'th.qcRejectQuantity as "qcRejectQuantity"',
        'th.qcQuantity as "qcQuantity"',
        'th.consignmentName as "lotNumber"',
        'th.note as "note"',
        'th.type as "type"',
        'th.deletedAt as "deletedAt"',
        `CASE
          WHEN COUNT(er) = 0
            THEN 'null'
          ELSE JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'id', er.id,
              'code', er.code
            )
          )
        END AS "errorReport"`,
      ])
      .where('th.id = :Id', { Id: id })
      .leftJoin('th.errorReport', 'er')
      .groupBy('th.id');
    return await query.getRawOne();
  }

  public async getNotReportedProducingTransactionHistory(
    createdBy: number,
  ): Promise<any> {
    const query = this.transactionHistoryRepository
      .createQueryBuilder('th')
      .select([
        'th.id as "id"',
        'th.createdAt as "createdAt"',
        'th.code as "code"',
        'th.orderId as "orderId"',
        'th.warehouseId as "warehouseId"',
        'th.itemId as "itemId"',
        'th.createdByUserId as "createdByUserId"',
        'th.qcPassQuantity as "qcPassQuantity"',
        'th.qcRejectQuantity as "qcRejectQuantity"',
        'th.qcQuantity as "qcQuantity"',
        'th.note as "note"',
        'th.type as "type"',
        'th.numberOfTimeQc as "numberOfTimeQc"',
        'th.qualityPointId as "qualityPointId"',
        'th.deletedAt as "deletedAt"',
        `CASE 
          WHEN COUNT(thlt) = 0 
            THEN '{}' 
            ELSE JSONB_BUILD_OBJECT(
                'id', thlt.id,
                'status', thlt.status,
                'start', thlt.start_time,
                'end', thlt.end_time,
                'duration', thlt.duration
              ) END AS "logTime"`,
        `CASE 
          WHEN COUNT(er) = 0
            THEN '{}'
          ELSE JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'id', er.id,
              'code', er.code
            )
          )
        END AS "errorReport"`,
      ])
      .where('th.createdByUserId = :createdBy', { createdBy: createdBy })
      .andWhere('th.type IN (:...type)', {
        type: [
          TransactionHistoryTypeEnum.OutputProducingStep,
          TransactionHistoryTypeEnum.InputProducingStep,
        ],
      })
      .having(`COUNT(er) = 0`)
      .andWhere('th.qcRejectQuantity > 0')
      .leftJoin('th.errorReport', 'er')
      .leftJoin('th.transactionHistoryLogTime', 'thlt')
      .groupBy('th.id')
      .addGroupBy('thlt.id');
    return await query.getRawMany();
  }

  public async getNotReportedOutputQcTransactionHistory(
    createdBy: number,
  ): Promise<any> {
    const query = this.transactionHistoryRepository
      .createQueryBuilder('th')
      .select([
        'th.id as "id"',
        'th.createdAt as "createdAt"',
        'th.code as "code"',
        'th.orderId as "orderId"',
        'th.warehouseId as "warehouseId"',
        'th.itemId as "itemId"',
        'th.createdByUserId as "createdByUserId"',
        'th.qcPassQuantity as "qcPassQuantity"',
        'th.qcRejectQuantity as "qcRejectQuantity"',
        'th.qcQuantity as "qcQuantity"',
        'th.note as "note"',
        'th.type as "type"',
        'th.deletedAt as "deletedAt"',
        'th.numberOfTimeQc as "numberOfTimeQc"',
        'th.qualityPointId as "qualityPointId"',
        `CASE
          WHEN COUNT(er) = 0
            THEN 'null'
          ELSE JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'id', er.id,
              'code', er.code
            )
          )
        END AS "errorReport"`,
      ])
      .where('th.createdByUserId = :createdBy', { createdBy: createdBy })
      .andWhere(
        `th.type IN('${TransactionHistoryTypeEnum.ProductionExport}',
                            '${TransactionHistoryTypeEnum.SaleExport}')`,
      )
      .having(`COUNT(er) = 0`)
      .andWhere('th.qcRejectQuantity > 0')
      .leftJoin('th.errorReport', 'er')
      .groupBy('th.id');
    return await query.getRawMany();
  }

  public async getNotReportedInputQcTransactionHistory(
    createdBy: number,
  ): Promise<any> {
    const query = this.transactionHistoryRepository
      .createQueryBuilder('th')
      .select([
        'th.id as "id"',
        'th.createdAt as "createdAt"',
        'th.code as "code"',
        'th.orderId as "orderId"',
        'th.warehouseId as "warehouseId"',
        'th.itemId as "itemId"',
        'th.createdByUserId as "createdByUserId"',
        'th.qcPassQuantity as "qcPassQuantity"',
        'th.qcRejectQuantity as "qcRejectQuantity"',
        'th.qcQuantity as "qcQuantity"',
        'th.note as "note"',
        'th.type as "type"',
        'th.deletedAt as "deletedAt"',
        'th.numberOfTimeQc as "numberOfTimeQc"',
        'th.qualityPointId as "qualityPointId"',
        `CASE
          WHEN COUNT(er) = 0
            THEN 'null'
          ELSE JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'id', er.id,
              'code', er.code
            )
          )
        END AS "errorReport"`,
      ])
      .where('th.createdByUserId = :createdBy', { createdBy: createdBy })
      .andWhere(
        `th.type IN('${TransactionHistoryTypeEnum.Purchased}',
                            '${TransactionHistoryTypeEnum.ProductionImport}')`,
      )
      .having(`COUNT(er) = 0`)
      .andWhere('th.qcRejectQuantity > 0')
      .leftJoin('th.errorReport', 'er')
      .groupBy('th.id');
    return await query.getRawMany();
  }

  async getIoQcProgressItems(
    request: GetDashboardIoQcProgressRequestDto,
    type: TransactionHistoryIOqcTypeEnum,
  ): Promise<any> {
    const { qcStageId, itemId, orderId } = request;
    let qcTypeFilter;
    switch (type) {
      case TransactionHistoryIOqcTypeEnum.input:
        qcTypeFilter =
          !qcStageId && qcStageId !== 0
            ? TransactionHistoryInputQcTypes
            : [qcStageId];
        break;
      case TransactionHistoryIOqcTypeEnum.output:
        qcTypeFilter =
          !qcStageId && qcStageId !== 0
            ? TransactionHistoryOutputQcTypes
            : [qcStageId];
        break;
      default:
        break;
    }

    const query = this.transactionHistoryRepository
      .createQueryBuilder('ta')
      .select([
        `SUM(ta.qc_reject_quantity) as "qcRejectQuantity"`,
        `SUM(ta.qc_pass_quantity) as "qcPassQuantity"`,
        `TO_CHAR(ta.execution_date_by_plan, '${DashBoardDateTimeFormat}') as "date"`,
      ])
      .innerJoin(
        (qb) => {
          qb.select([
            'tasth.id as "id"',
            `SUM(tasth.qc_pass_quantity) as qcPassQuantity`,
            `SUM(tasth.qc_reject_quantity) as qcRejectQuantity`,
            'tasth.type as "type"',
            `TO_CHAR(tasth.execution_date_by_plan, '${DashBoardDateTimeFormat}') as executionDate`,
          ])
            .from('transaction_histories', 'tasth')
            .leftJoin('tasth.errorReport', 'taser')
            .leftJoin(
              'quality_points',
              'tqp',
              'tasth.quality_point_id = tqp.id',
            )
            .where(
              new Brackets((qb) => {
                qb.where('taser.status IN (:...status)', {
                  status: [ErrorReportStatus.Confirmed],
                }).orWhere(
                  new Brackets((qb1) => {
                    qb1.where('tasth.qc_reject_quantity = 0').andWhere(
                      new Brackets((qb2) => {
                        qb2
                          .where(
                            new Brackets((qb3) => {
                              qb3
                                .where(
                                  'tasth.number_of_time_qc = :numberOfTimeQc1',
                                  { numberOfTimeQc1: 1 },
                                )
                                .andWhere(
                                  'tqp.number_of_time = :numberOfTime1',
                                  { numberOfTime1: 0 },
                                );
                            }),
                          )
                          .orWhere(
                            new Brackets((qb4) => {
                              qb4
                                .where(
                                  'tasth.number_of_time_qc = :numberOfTimeQc2',
                                  { numberOfTimeQc2: 2 },
                                )
                                .andWhere(
                                  'tqp.number_of_time = :numberOfTime2',
                                  { numberOfTime2: 1 },
                                );
                            }),
                          );
                      }),
                    );
                  }),
                );
              }),
            )
            .andWhere('tasth.type IN (:...types)', {
              types: qcTypeFilter,
            })
            .groupBy('executionDate')
            .groupBy('tasth.id')
            .addGroupBy('tasth.type')
            .distinct();

          if (itemId) {
            qb.andWhere('tasth.item_id = :itemId', { itemId: itemId });
          }

          if (orderId) {
            qb.andWhere('tasth.order_id = :orderId', { orderId: orderId });
          }

          return qb;
        },
        'tas',
        'ta.id = tas.id',
      )
      .orderBy('date', 'ASC')
      .groupBy('date');
    return await query.getRawMany();
  }

  async getListTransactionHistoryOverall(
    request: GetListTransactionHistoryOverallRequestDto,
    poIds: number[],
    soIds: number[],
    proImportIds: number[],
    proExportIds: number[],
    itemIds: number[],
  ): Promise<any> {
    const { filter, keyword, skip, take } = request;
    let query = this.transactionHistoryRepository
      .createQueryBuilder('t')
      .select([
        't.id as "id"',
        't.code as "code"',
        't.createdAt as "createdAt"',
        't.itemId as "itemId"',
        't.orderId as "orderId"',
        't.type as "type"',
        't.numberOfTimeQc as "numberOfTimeQc"',
        'tqp.formality as "formality"',
        'tqp.numberOfTime as "numberOfTime"',
      ])
      .leftJoin('quality_points', 'tqp', 't.quality_point_id = tqp.id')
      .orderBy('t.createdAt', 'DESC');

    // keyword
    if (keyword) {
      query = query.orWhere(
        `LOWER("t"."code") LIKE LOWER(:pkeyWord) escape '\\'`,
        {
          pkeyWord: `%${escapeCharForSearch(keyword)}%`,
        },
      );
    }

    // search by order ids:
    if (!isEmpty(poIds)) {
      query = query.orWhere(
        new Brackets((qb) => {
          qb.where('t.orderId IN (:...poIds)', { poIds: poIds }).andWhere(
            't.type = :type',
            { type: TransactionHistoryTypeEnum.Purchased },
          );
        }),
      );
    }

    if (!isEmpty(soIds)) {
      query = query.orWhere(
        new Brackets((qb) => {
          qb.where('t.orderId IN (:...soIds)', { soIds: soIds }).andWhere(
            't.type = :type',
            { type: TransactionHistoryTypeEnum.SaleExport },
          );
        }),
      );
    }

    if (!isEmpty(proImportIds)) {
      query = query.orWhere(
        new Brackets((qb) => {
          qb.where('t.orderId IN (:...proImportIds)', {
            proImportIds: proImportIds,
          }).andWhere('t.type = :type', {
            type: TransactionHistoryTypeEnum.ProductionImport,
          });
        }),
      );
    }

    if (!isEmpty(proExportIds)) {
      query = query.orWhere(
        new Brackets((qb) => {
          qb.where('t.orderId IN (:...proExportIds)', {
            proExportIds: proExportIds,
          }).andWhere('t.type = :type', {
            type: TransactionHistoryTypeEnum.ProductionExport,
          });
        }),
      );
    }

    if (!isEmpty(itemIds)) {
      query = query.orWhere('t.itemId IN (:...itemIds)', {
        itemIds: itemIds,
      });
    }

    // filter by created date
    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'createdAt':
            const createdFrom = item.text.split('|')[0];
            const createdTo = item.text.split('|')[1];
            query = query.andWhere(
              `"t"."created_at" between :createdFrom AND :createdTo`,
              {
                createdFrom: createdFrom,
                createdTo: createdTo,
              },
            );
            break;
          default:
            break;
        }
      });
    }

    const result = await query.offset(skip).limit(take).getRawMany();
    const count = await query.getCount();
    return { result: result, count: count };
  }

  // QC công đoạn đầu ra
  public async totalQuantityForWC(
    orderId: number,
    type: number,
    numberOfTimeQc: number,
    workCenterIds: number[],
  ): Promise<any> {
    const query = this.transactionHistoryRepository
      .createQueryBuilder('th')
      .select([
        'th.work_center_id AS "workCenterId"',
        'sum(th.qc_pass_quantity) AS "qcPassQuantity"',
        'sum(th.qc_reject_quantity) AS "qcRejectQuantity"',
        'sum(th.qc_quantity) AS "qcQuantity"',
      ])
      .where('th.orderId = :orderId', { orderId: orderId })
      .andWhere('th.workCenterId IN (:...workCenterIds)', {
        workCenterIds: workCenterIds,
      })
      .andWhere('th.type = :type', { type: type })
      .andWhere('th.numberOfTimeQc = :numberOfTimeQc', {
        numberOfTimeQc: numberOfTimeQc,
      })
      .groupBy('th.work_center_id')
      .distinct();

    return await query.getRawMany();
  }
  // End

  // QC công đoạn đầu vào
  public async totalQuantityForWCInputProduction(
    orderId: number,
    type: number,
    numberOfTimeQc: number,
    workCenterIds: number[],
  ): Promise<any> {
    const query = this.transactionHistoryRepository
      .createQueryBuilder('th')
      .select([
        'th.work_center_id AS "workCenterId"',
        'th.item_id AS "itemId"',
        'sum(th.qc_pass_quantity) AS "qcPassQuantity"',
        'sum(th.qc_reject_quantity) AS "qcRejectQuantity"',
        'sum(th.qc_quantity) AS "qcQuantity"',
      ])
      .where('th.orderId = :orderId', { orderId: orderId })
      .andWhere('th.workCenterId IN (:...workCenterIds)', {
        workCenterIds: workCenterIds,
      })
      .andWhere('th.type = :type', { type: type })
      .andWhere('th.numberOfTimeQc = :numberOfTimeQc', {
        numberOfTimeQc: numberOfTimeQc,
      })
      .groupBy('th.work_center_id')
      .addGroupBy('th.item_id')
      .distinct();

    return await query.getRawMany();
  }
  // End

  public async totalQuantityForItem(
    orderId: number,
    warehouseId: number,
    itemId: number,
    type: number,
    numberOfTimeQc: number,
  ): Promise<any> {
    const query = this.transactionHistoryRepository
      .createQueryBuilder('th')
      .select([
        'th.orderId AS "orderId"',
        'th.warehouseId AS "warehouseId"',
        'th.itemId AS "itemId"',
        'sum(th.qc_pass_quantity) AS "qcPassQuantity"',
        'sum(th.qc_reject_quantity) AS "qcRejectQuantity"',
        'sum(th.qc_quantity) AS "qcQuantity"',
      ])
      .where('th.orderId = :orderId', { orderId: orderId })
      .andWhere('th.warehouseId = :warehouseId', { warehouseId: warehouseId })
      .andWhere('th.itemId = :itemId', { itemId: itemId })
      .andWhere('th.type = :type', { type: type })
      .andWhere('th.numberOfTimeQc = :numberOfTimeQc', {
        numberOfTimeQc: numberOfTimeQc,
      })
      .groupBy('th.orderId')
      .addGroupBy('th.warehouseId')
      .addGroupBy('th.itemId')
      .distinct();

    return await query.getRawOne();
  }

  public async getProducingStepsQcProgressItems(
    request: GetDashboardFinishedItemProgressRequestDto,
  ): Promise<any> {
    const { moId, producingStepId, itemId } = request;
    const query = this.transactionHistoryRepository
      .createQueryBuilder('ta')
      .select([
        `SUM(ta.qc_reject_quantity) as "qcRejectQuantity"`,
        `SUM(ta.qc_pass_quantity) as "qcPassQuantity"`,
        `SUM(tas.qcRepairQuantity) as "qcRepairQuantity"`,
        `TO_CHAR(ta.execution_date_by_plan, '${DashBoardDateTimeFormat}') as "date"`,
      ])
      .innerJoin(
        (qb) => {
          qb.select([
            'tasth.id as "id"',
            `SUM(tasth.qc_pass_quantity) as qcPassQuantity`,
            `SUM(tasth.qc_reject_quantity) as qcRejectQuantity`,
            `SUM(tased.repair_item_quantity) as qcRepairQuantity`,
            'tasth.type as "type"',
            `TO_CHAR(tasth.execution_date_by_plan, '${DashBoardDateTimeFormat}') as executionDate`,
          ])
            .from('transaction_histories', 'tasth')
            .leftJoin('tasth.errorReport', 'taser')
            .leftJoin(
              'quality_points',
              'tqp',
              'tasth.quality_point_id = tqp.id',
            )
            .leftJoin('taser.errorReportStageDetail', 'tasd')
            .leftJoin('tasd.errorReportErrorList', 'tasel')
            .leftJoin('tasel.errorReportErrorDetails', 'tased')
            .where(
              new Brackets((qb) => {
                qb.where('taser.status IN (:...status)', {
                  status: [ErrorReportStatus.Confirmed],
                }).orWhere(
                  new Brackets((qb1) => {
                    qb1.where('tasth.qc_reject_quantity = 0').andWhere(
                      new Brackets((qb2) => {
                        qb2
                          .where(
                            new Brackets((qb3) => {
                              qb3
                                .where(
                                  'tasth.number_of_time_qc = :numberOfTimeQc1',
                                  { numberOfTimeQc1: 1 },
                                )
                                .andWhere(
                                  'tqp.number_of_time = :numberOfTime1',
                                  { numberOfTime1: 0 },
                                );
                            }),
                          )
                          .orWhere(
                            new Brackets((qb4) => {
                              qb4
                                .where(
                                  'tasth.number_of_time_qc = :numberOfTimeQc2',
                                  { numberOfTimeQc2: 2 },
                                )
                                .andWhere(
                                  'tqp.number_of_time = :numberOfTime2',
                                  { numberOfTime2: 1 },
                                );
                            }),
                          );
                      }),
                    );
                  }),
                );
              }),
            )
            .andWhere('tasth.type IN (:...types)', {
              types: [TransactionHistoryTypeEnum.OutputProducingStep],
            })
            .groupBy('executionDate')
            .groupBy('tasth.id')
            .addGroupBy('tasth.type')
            .distinct();

          // filter itemId, producingStepId, moId
          if (itemId) {
            qb.andWhere('tasth.item_id = :itemId', { itemId: itemId });
          }

          if (producingStepId) {
            qb.andWhere('tasth.producing_step_id = :producingStepId', {
              producingStepId: producingStepId,
            });
          }
          if (moId) {
            qb.andWhere('tasth.mo_id = :moId', { moId: moId });
          }

          return qb;
        },
        'tas',
        'ta.id = tas.id',
      )
      .orderBy('date', 'ASC')
      .groupBy('date');
    return await query.getRawMany();
  }
}
