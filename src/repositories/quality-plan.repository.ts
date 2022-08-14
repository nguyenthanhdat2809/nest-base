import { Injectable } from '@nestjs/common';
import { Brackets, Connection, Repository } from 'typeorm';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { QualityPlanRepositoryInterface } from '@components/quality-plan/interface/quality-plan.repository.interface';
import { QualityPlanListRequestDto } from '@components/quality-plan/dto/request/quality-plan-list.request.dto';
import { escapeCharForSearch, handleDataRequest } from '@utils/common';
import {
  QCPlanStatus,
  QualityPlan,
} from '@entities/quality-plan/quality-plan.entity';
import { QUALITY_PLAN_CONST } from '@constant/entity.constant';
import { QualityPlanRequestDto } from '@components/quality-plan/dto/request/quality-plan.request.dto';
import { QualityPlanDetail } from '@entities/quality-plan/quality-plan-detail.entity';
import { QualityPlanBom } from '@entities/quality-plan/quality-plan-bom.entity';
import { QualityPlanBomQualityPointUser } from '@entities/quality-plan/quality-plan-bom-quality-point-user.entity';
import { ApiError } from '@utils/api.error';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { UpdateQualityPlanRequestDto } from '@components/quality-plan/dto/request/update-quality-plan.request.dto';
import { I18nService } from 'nestjs-i18n';
import { UpdateQualityPlanBomRequestDto } from '@components/quality-plan/dto/request/update-quality-plan-bom.request.dto';
import { STAGES_OPTION } from '@constant/qc-stage.constant';
import {
  InProgressQualityPlanStatus,
  QUALITY_PLAN_DB,
} from '@components/quality-plan/quality-plan.constant';
import { isEmpty } from 'lodash';
import { QualityPlanIOqc } from '@entities/quality-plan/quality-plan-ioqc.entity';
import { QualityPlanIOqcDetail } from '@entities/quality-plan/quality-plan-ioqc-detail.entity';
import { QualityPlanOrderRequestDto } from '@components/quality-plan/dto/request/quality-plan-ioqc.request.dto';
import { QualityPlanIOqcQualityPointUser } from '@entities/quality-plan/quality-plan-ioqc-quality-point-user.entity';
import { UpdateQualityPlanOrderRequestDto } from '@components/quality-plan/dto/request/update-quality-plan-ioqc.request.dto';
import { ReportQcRequestDto } from '@components/report/dto/request/report-qc.request.dto';
import { TypeReport } from '@components/report/report.constant';
import {
  TransactionHistoryInputQcTypes,
  TransactionHistoryIOqcTypeEnum,
  TransactionHistoryOutputQcTypes,
  TransactionHistoryProduceStepTypeEnum,
  TransactionHistoryProducingStepsQcTypes, TransactionHistoryTypeEnum
} from "@components/transaction-history/transaction-history.constant";
import { GetDashboardIoQcProgressRequestDto } from '@components/dashboard/dto/request/get-dashboard-io-qc-progress-request.dto';
import { userStageNumberOfTimeQc } from '@entities/quality-plan/quality-plan-bom-quality-point-user.entity';
import { userIOqcNumberOfTimeQc } from '@entities/quality-plan/quality-plan-ioqc-quality-point-user.entity';
import { GetDashboardFinishedItemProgressRequestDto } from '@components/dashboard/dto/request/get-dashboard-finished-item-progress.request.dto';

@Injectable()
export class QualityPlanRepository
  extends BaseAbstractRepository<QualityPlan>
  implements QualityPlanRepositoryInterface
{
  constructor(
    @InjectRepository(QualityPlan)
    private readonly qualityPlanRepository: Repository<QualityPlan>,

    @InjectConnection()
    private readonly connection: Connection,

    private readonly i18n: I18nService,
  ) {
    super(qualityPlanRepository);

    this.fieldMap.set(
      QUALITY_PLAN_CONST.QUALITY_PLAN.QC_STAGE_ID.COL_NAME.toLowerCase(),
      QUALITY_PLAN_CONST.QUALITY_PLAN.QC_STAGE_ID.DB_COL_NAME,
    );
    this.fieldMap.set(
      QUALITY_PLAN_CONST.QUALITY_PLAN.CREATED_BY.COL_NAME.toLowerCase(),
      QUALITY_PLAN_CONST.QUALITY_PLAN.CREATED_BY.DB_COL_NAME,
    );
    this.fieldMap.set(
      QUALITY_PLAN_CONST.QUALITY_PLAN.STATUS.COL_NAME.toLowerCase(),
      QUALITY_PLAN_CONST.QUALITY_PLAN.STATUS.DB_COL_NAME,
    );
  }

  public async getList(
    request: QualityPlanListRequestDto,
    filterStageSearch: any,
    poFilterIds: number[],
    proFilterIds: number[],
    soFilterIds: number[],
    moFilterIds: number[],
  ) {
    const { keyword, sort, filter, take, skip } = handleDataRequest(request);
    let query = this.qualityPlanRepository
      .createQueryBuilder('e')
      .select([
        'e.id AS "id"',
        'e.code AS "code"',
        'e.name AS "name"',
        'e.description AS "description"',
        'e.qc_stage_id AS "qcStageId"',
        'e.type AS "type"',
        'e.status AS "status"',
        'e.created_at AS "createdAt"',
        'e.updated_at AS "updatedAt"',
        'qpd.mo_id AS "moId"',
        'qpd.mo_plan_id AS "moPlanId"',
        'qpio.order_id AS "orderId"',
      ])
      .leftJoin('quality_plan_details', 'qpd', 'e.id = qpd.quality_plan_id')
      .leftJoin('quality_plan_ioqcs', 'qpio', 'e.id = qpio.quality_plan_id');

    const alias = query.alias;

    if (filterStageSearch.checked) {
      if (!isEmpty(filterStageSearch.stageValues)) {
        query = query.andWhere(
          `e.qc_stage_id IN (${filterStageSearch.stageValues})`,
        );
      } else {
        return {
          result: [],
          count: 0,
        };
      }
    }

    if (keyword) {
      query = query
        .andWhere(
          `(LOWER("${alias}"."${QUALITY_PLAN_CONST.QUALITY_PLAN.CODE.DB_COL_NAME}") LIKE LOWER(:pkeyWord) escape '\\'`,
          {
            pkeyWord: `%${escapeCharForSearch(keyword)}%`,
          },
        )
        .orWhere(
          `LOWER("${alias}"."${QUALITY_PLAN_CONST.QUALITY_PLAN.NAME.DB_COL_NAME}") LIKE LOWER(:pkeyWord) escape '\\')`,
          {
            pkeyWord: `%${escapeCharForSearch(keyword)}%`,
          },
        );
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'name':
            query.andWhere(`LOWER("e"."name") LIKE LOWER(:name) ESCAPE '\\'`, {
              name: `%${escapeCharForSearch(item.text)}%`,
            });
            break;
          case 'code':
            query.andWhere(`LOWER("e"."code") LIKE LOWER(:code) ESCAPE '\\'`, {
              code: `%${escapeCharForSearch(item.text)}%`,
            });
            break;
          case 'status':
            query.andWhere(`"${item.column}" IN (:...${item.column})`, {
              [item.column]: item.text.split(','),
            });
            break;
          case 'orderName':
            const subQuery = this.qualityPlanRepository
              .createQueryBuilder('p')
              .select('p.id')
              .leftJoin(
                'quality_plan_details',
                'qpd',
                'p.id = qpd.quality_plan_id',
              )
              .leftJoin(
                'quality_plan_ioqcs',
                'qpio',
                'p.id = qpio.quality_plan_id',
              )
              .where(
                new Brackets((qb) => {
                  qb.where(
                    new Brackets((qb0) => {
                      qb0
                        .where('p.qcStageId = :qcStageId0', {
                          qcStageId0: STAGES_OPTION.PO_IMPORT,
                        })
                        .andWhere('qpio.orderId IN (:...orderId0)', {
                          orderId0: [null, ...poFilterIds],
                        });
                    }),
                  )
                    .orWhere(
                      new Brackets((qb2) => {
                        qb2
                          .where('p.qcStageId = :qcStageId2', {
                            qcStageId2: STAGES_OPTION.PRO_IMPORT,
                          })
                          .andWhere('qpio.orderId IN (:...orderId2)', {
                            orderId2: [null, ...proFilterIds],
                          });
                      }),
                    )
                    .orWhere(
                      new Brackets((qb3) => {
                        qb3
                          .where('p.qcStageId = :qcStageId3', {
                            qcStageId3: STAGES_OPTION.PRO_EXPORT,
                          })
                          .andWhere('qpio.orderId IN (:...orderId3)', {
                            orderId3: [null, ...proFilterIds],
                          });
                      }),
                    )
                    .orWhere(
                      new Brackets((qb5) => {
                        qb5
                          .where('p.qcStageId = :qcStageId5', {
                            qcStageId5: STAGES_OPTION.SO_EXPORT,
                          })
                          .andWhere('qpio.orderId IN (:...orderId5)', {
                            orderId5: [null, ...soFilterIds],
                          });
                      }),
                    )
                    .orWhere(
                      new Brackets((qb8) => {
                        qb8
                          .where('p.qcStageId = :qcStageId8', {
                            qcStageId8: STAGES_OPTION.OUTPUT_PRODUCTION,
                          })
                          .andWhere('qpd.moId IN (:...moId8)', {
                            moId8: [null, ...moFilterIds],
                          });
                      }),
                    )
                    .orWhere(
                      new Brackets((qb9) => {
                        qb9
                          .where('p.qcStageId = :qcStageId9', {
                            qcStageId9: STAGES_OPTION.INPUT_PRODUCTION,
                          })
                          .andWhere('qpd.moId IN (:...moId9)', {
                            moId9: [null, ...moFilterIds],
                          });
                      }),
                    );
                }),
              )
              .distinct();

            query = query
              .andWhere('e.id IN (' + subQuery.getQuery() + ')')
              .setParameters(subQuery.getParameters());

            break;
          default:
            break;
        }
      });
    }

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        switch (item.column) {
          case 'name':
            query = query.orderBy('"name"', item.order);
            break;
          case 'code':
            query = query.orderBy('"code"', item.order);
            break;
          default:
            break;
        }
      });
    } else {
      query = query.orderBy('e.id', 'DESC');
    }

    query.distinct();

    const result = await query.getRawMany();
    const total = await query.getCount();

    return {
      result: result,
      count: total,
    };
  }

  public async getDetail(qualityPlan: QualityPlan): Promise<any> {
    return await this.qualityPlanRepository
      .createQueryBuilder('qp')
      .where('qp.id = :pId', { pId: qualityPlan.id })
      .leftJoinAndSelect('qp.qualityPlanDetail', 'qpd')
      .leftJoinAndSelect('qpd.qualityPlanBoms', 'qpb')
      .leftJoinAndSelect('qpb.qualityPlanBomQualityPointUsers', 'qpbqpu')
      .getOne();
  }

  public async getDetailQualityPlanOrder(
    qualityPlan: QualityPlan,
  ): Promise<any> {
    return await this.qualityPlanRepository
      .createQueryBuilder('qp')
      .where('qp.id = :pId', { pId: qualityPlan.id })
      .leftJoinAndSelect('qp.qualityPlanIOqcs', 'qpioqc')
      .leftJoinAndSelect('qpioqc.qualityPlanIOqcDetails', 'qpioqcd')
      .leftJoinAndSelect('qpioqcd.qualityPlanIOqcQualityPointUsers', 'qpioqcu')
      .getOne();
  }

  public createQualityPlanEntity(
    createQualityPlanRequestDto: QualityPlanRequestDto,
  ): QualityPlan {
    const qualityPlan = new QualityPlan();

    qualityPlan.code = createQualityPlanRequestDto.code.trim();
    qualityPlan.name = createQualityPlanRequestDto.name.trim();
    qualityPlan.description = createQualityPlanRequestDto.description?.trim();
    qualityPlan.status = QCPlanStatus.Awaiting;
    qualityPlan.type = createQualityPlanRequestDto.type;
    qualityPlan.qcStageId = createQualityPlanRequestDto.qcStageId;
    qualityPlan.createdBy = createQualityPlanRequestDto?.user?.id;

    return qualityPlan;
  }

  public createQualityPlanDetailEntity(
    qualityPlan: QualityPlan,
    request: QualityPlanRequestDto,
  ): QualityPlanDetail {
    const qualityPlanDetail = new QualityPlanDetail();

    qualityPlanDetail.qualityPlanId = qualityPlan.id;
    qualityPlanDetail.moPlanId = request.moPlanId;
    qualityPlanDetail.moId = request.moId;

    return qualityPlanDetail;
  }

  public createQualityPlanBomEntities(
    qualityPlanDetail: QualityPlanDetail,
    request: QualityPlanRequestDto,
  ): QualityPlanBom[] {
    const bomsRequests = request.moPlanBoms;
    const entities: QualityPlanBom[] = [];

    for (let i = 0; i < bomsRequests.length; i++) {
      const request = bomsRequests[i];
      const qualityPlanBom = new QualityPlanBom();

      qualityPlanBom.qualityPlanDetailId = qualityPlanDetail.id;
      qualityPlanBom.planErrorRate = request.planErrorRate;
      qualityPlanBom.planQcQuantity = request.planQcQuantity;
      qualityPlanBom.producingStepId = request.producingStepId;
      qualityPlanBom.planFrom = request.planFrom;
      qualityPlanBom.planTo = request.planTo;
      qualityPlanBom.bomId = request.bomId;
      qualityPlanBom.keyBomTree = request.keyBomTree;
      qualityPlanBom.workOrderId = request.workOrderId;

      entities.push(qualityPlanBom);
    }

    return entities;
  }

  public createQualityPlanBomQualityPointUserEntities(
    qualityPlanBom: QualityPlanBom[],
    request: QualityPlanRequestDto,
  ): QualityPlanBomQualityPointUser[] {
    const bomsRequests = request.moPlanBoms;
    const entities: QualityPlanBomQualityPointUser[] = [];

    for (let i = 0; i < qualityPlanBom.length; i++) {
      for (let j = 0; j < bomsRequests.length; j++) {
        const bomRequest = bomsRequests[j];
        if (
          qualityPlanBom[i].bomId == bomRequest.bomId &&
          qualityPlanBom[i].producingStepId == bomRequest.producingStepId &&
          qualityPlanBom[i].keyBomTree == bomRequest.keyBomTree
        ) {
          const user1sRequests = bomRequest?.qualityPlanBomQualityPointUser1s;
          for (let k = 0; k < user1sRequests.length; k++) {
            const qualityPlanBomQualityPointUser =
              new QualityPlanBomQualityPointUser();

            // ID QualityPlanBom
            qualityPlanBomQualityPointUser.qualityPlanBomId =
              qualityPlanBom[i].id;
            // ID User
            qualityPlanBomQualityPointUser.userId = user1sRequests[k].userId;
            // Người QC Lần 1
            qualityPlanBomQualityPointUser.numberOfTimeQc =
              userStageNumberOfTimeQc.theFirstTime;

            entities.push(qualityPlanBomQualityPointUser);
          }

          const user2sRequests = bomRequest?.qualityPlanBomQualityPointUser2s;
          for (let k = 0; k < user2sRequests?.length; k++) {
            const qualityPlanBomQualityPointUser =
              new QualityPlanBomQualityPointUser();

            // ID QualityPlanBom
            qualityPlanBomQualityPointUser.qualityPlanBomId =
              qualityPlanBom[i].id;
            // ID User
            qualityPlanBomQualityPointUser.userId = user2sRequests[k].userId;
            // Người QC Lần 1
            qualityPlanBomQualityPointUser.numberOfTimeQc =
              userStageNumberOfTimeQc.theSecondTime;

            entities.push(qualityPlanBomQualityPointUser);
          }
        }
      }
    }

    return entities;
  }

  public async createQualityPlan(request: QualityPlanRequestDto) {
    const queryRunner = await this.connection.createQueryRunner();
    const manager = queryRunner.manager;

    try {
      await queryRunner.startTransaction();

      const qualityPlan = await manager.save(
        this.createQualityPlanEntity(request),
      );

      const qualityPlanDetail = await manager.save(
        this.createQualityPlanDetailEntity(qualityPlan, request),
      );

      const qualityPlanBoms = await manager.save(
        this.createQualityPlanBomEntities(qualityPlanDetail, request),
      );

      await manager.save(
        this.createQualityPlanBomQualityPointUserEntities(
          qualityPlanBoms,
          request,
        ),
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ApiError(
        ResponseCodeEnum.INTERNAL_SERVER_ERROR,
        error?.message || error,
      );
    } finally {
      if (manager) await manager.release();
      if (queryRunner) await queryRunner.release();
    }
  }

  // CRUD PLAN IOQC
  public createQualityPlanOrderEntity(
    createQualityPlanOrderRequestDto: QualityPlanOrderRequestDto,
  ): QualityPlan {
    const qualityPlan = new QualityPlan();

    qualityPlan.code = createQualityPlanOrderRequestDto.code.trim();
    qualityPlan.name = createQualityPlanOrderRequestDto.name.trim();
    qualityPlan.description =
      createQualityPlanOrderRequestDto.description?.trim();
    qualityPlan.status = QCPlanStatus.Awaiting;
    qualityPlan.type = createQualityPlanOrderRequestDto.type;
    qualityPlan.qcStageId = createQualityPlanOrderRequestDto.qcStageId;
    qualityPlan.createdBy = createQualityPlanOrderRequestDto?.user?.id;

    return qualityPlan;
  }

  public createQualityPlanIOqcEntities(
    qualityPlan: QualityPlan,
    request: QualityPlanOrderRequestDto,
  ): QualityPlanIOqc[] {
    const qualityPlanIOqcRequests = request.qualityPlanIOqcs;
    const entities: QualityPlanIOqc[] = [];

    for (let i = 0; i < qualityPlanIOqcRequests.length; i++) {
      const request = qualityPlanIOqcRequests[i];
      const qualityPlanIOqc = new QualityPlanIOqc();

      qualityPlanIOqc.qualityPlanId = qualityPlan.id;
      qualityPlanIOqc.orderId = request.orderId;
      qualityPlanIOqc.warehouseId = request.warehouseId;
      qualityPlanIOqc.itemId = request.itemId;
      qualityPlanIOqc.qualityPointId = request.qualityPointId;
      qualityPlanIOqc.planQuantity = request.quantity; //TODO update planQuantity
      qualityPlanIOqc.actualQuantity = request.actualQuantity;
      qualityPlanIOqc.qcRejectQuantity = 0;
      qualityPlanIOqc.qcPassQuantity = 0;
      qualityPlanIOqc.errorQuantity = 0;
      qualityPlanIOqc.qcCheck = request.qcCheck;

      entities.push(qualityPlanIOqc);
    }

    return entities;
  }

  public createQualityPlanIOqcDetailEntities(
    qualityPlanIOqcs: QualityPlanIOqc[],
    request: QualityPlanOrderRequestDto,
  ): QualityPlanIOqcDetail[] {
    const qualityPlanIOqcRequests = request.qualityPlanIOqcs;
    const entities: QualityPlanIOqcDetail[] = [];

    for (let i = 0; i < qualityPlanIOqcRequests.length; i++) {
      const qualityPlanIOqcRequest = qualityPlanIOqcRequests[i];
      for (let j = 0; j < qualityPlanIOqcs.length; j++) {
        const qualityPlanIOqc = qualityPlanIOqcs[j];
        if (
          qualityPlanIOqcRequest.orderId == qualityPlanIOqc.orderId &&
          qualityPlanIOqcRequest.warehouseId == qualityPlanIOqc.warehouseId &&
          qualityPlanIOqcRequest.itemId == qualityPlanIOqc.itemId
        ) {
          const qualityPlanIOqcDetailRequests =
            qualityPlanIOqcRequest.qualityPlanIOqcDetails;
          for (let k = 0; k < qualityPlanIOqcDetailRequests.length; k++) {
            const qualityPlanIOqcDetail = new QualityPlanIOqcDetail();
            const qualityPlanIOqcDetailRequest =
              qualityPlanIOqcDetailRequests[k];

            qualityPlanIOqcDetail.qualityPlanIOqcId = qualityPlanIOqc.id;
            qualityPlanIOqcDetail.ordinalNumber =
              qualityPlanIOqcDetailRequest.ordinalNumber;
            qualityPlanIOqcDetail.planFrom =
              qualityPlanIOqcDetailRequest.planFrom;
            qualityPlanIOqcDetail.planTo = qualityPlanIOqcDetailRequest.planTo;
            qualityPlanIOqcDetail.planErrorRate =
              qualityPlanIOqcDetailRequest.planErrorRate;
            qualityPlanIOqcDetail.planQcQuantity =
              qualityPlanIOqcDetailRequest.planQcQuantity;
            qualityPlanIOqcDetail.qcPassQuantity = 0;
            qualityPlanIOqcDetail.qcRejectQuantity = 0;
            qualityPlanIOqcDetail.qcDoneQuantity = 0;

            entities.push(qualityPlanIOqcDetail);
          }
        }
      }
    }
    return entities;
  }

  public createQualityPlanIOqcQualityPointUserEntities(
    qualityPlanIOqcs: QualityPlanIOqc[],
    qualityPlanIOqcDetails: QualityPlanIOqcDetail[],
    request: QualityPlanOrderRequestDto,
  ): QualityPlanIOqcQualityPointUser[] {
    const qualityPlanIOqcRequests = request.qualityPlanIOqcs;
    const entities: QualityPlanIOqcQualityPointUser[] = [];

    for (let i = 0; i < qualityPlanIOqcRequests.length; i++) {
      const qualityPlanIOqcRequest = qualityPlanIOqcRequests[i];
      for (let j = 0; j < qualityPlanIOqcs.length; j++) {
        const qualityPlanIOqc = qualityPlanIOqcs[j];
        if (
          qualityPlanIOqcRequest.orderId == qualityPlanIOqc.orderId &&
          qualityPlanIOqcRequest.warehouseId == qualityPlanIOqc.warehouseId &&
          qualityPlanIOqcRequest.itemId == qualityPlanIOqc.itemId
        ) {
          const qualityPlanIOqcDetailRequests =
            qualityPlanIOqcRequest?.qualityPlanIOqcDetails;
          for (let k = 0; k < qualityPlanIOqcDetailRequests.length; k++) {
            const qualityPlanIOqcDetailRequest =
              qualityPlanIOqcDetailRequests[k];
            for (let l = 0; l < qualityPlanIOqcDetails.length; l++) {
              const qualityPlanIOqcDetail = qualityPlanIOqcDetails[l];
              if (
                qualityPlanIOqcDetailRequest.ordinalNumber ==
                  qualityPlanIOqcDetail.ordinalNumber &&
                qualityPlanIOqcDetail.qualityPlanIOqcId == qualityPlanIOqc.id
              ) {
                const user1s =
                  qualityPlanIOqcDetailRequest?.qualityPlanIOqcQualityPointUser1s;
                for (let m = 0; m < user1s.length; m++) {
                  const user = user1s[m];
                  const qualityPlanIOqcQualityPointUser =
                    new QualityPlanIOqcQualityPointUser();

                  // ID QualityPlanIOqcDetail
                  qualityPlanIOqcQualityPointUser.qualityPlanIOqcDetailId =
                    qualityPlanIOqcDetail?.id;
                  // ID User
                  qualityPlanIOqcQualityPointUser.userId = user?.userId;
                  // Người QC Lần 1
                  qualityPlanIOqcQualityPointUser.numberOfTimeQc =
                    userIOqcNumberOfTimeQc.theFirstTime;

                  entities.push(qualityPlanIOqcQualityPointUser);
                }

                const user2s =
                  qualityPlanIOqcDetailRequest?.qualityPlanIOqcQualityPointUser2s;
                for (let n = 0; n < user2s?.length; n++) {
                  const user = user2s[n];
                  const qualityPlanIOqcQualityPointUser =
                    new QualityPlanIOqcQualityPointUser();

                  // ID QualityPlanIOqcDetail
                  qualityPlanIOqcQualityPointUser.qualityPlanIOqcDetailId =
                    qualityPlanIOqcDetail?.id;
                  // ID User
                  qualityPlanIOqcQualityPointUser.userId = user?.userId;
                  // Người QC Lần 2
                  qualityPlanIOqcQualityPointUser.numberOfTimeQc =
                    userIOqcNumberOfTimeQc.theSecondTime;

                  entities.push(qualityPlanIOqcQualityPointUser);
                }
              }
            }
          }
        }
      }
    }
    return entities;
  }

  public async createQualityPlanOrder(request: QualityPlanOrderRequestDto) {
    const queryRunner = await this.connection.createQueryRunner();
    const manager = queryRunner.manager;

    try {
      await queryRunner.startTransaction();

      const qualityPlan = await manager.save(
        this.createQualityPlanOrderEntity(request),
      );

      const qualityPlanIOqc = await manager.save(
        this.createQualityPlanIOqcEntities(qualityPlan, request),
      );

      const qualityPlanIOqcDetail = await manager.save(
        this.createQualityPlanIOqcDetailEntities(qualityPlanIOqc, request),
      );

      await manager.save(
        this.createQualityPlanIOqcQualityPointUserEntities(
          qualityPlanIOqc,
          qualityPlanIOqcDetail,
          request,
        ),
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ApiError(
        ResponseCodeEnum.INTERNAL_SERVER_ERROR,
        error?.message || error,
      );
    } finally {
      if (manager) await manager.release();
      if (queryRunner) await queryRunner.release();
    }
  }

  public async updateQualityPlanOrder(
    request: UpdateQualityPlanOrderRequestDto,
  ) {
    const queryRunner = await this.connection.createQueryRunner();
    const manager = queryRunner.manager;

    const qualityPlan = await this.qualityPlanRepository
      .createQueryBuilder('qp')
      .where('qp.id = :pId', { pId: request.id })
      .leftJoinAndSelect('qp.qualityPlanIOqcs', 'qpioqc')
      .leftJoinAndSelect('qpioqc.qualityPlanIOqcDetails', 'qpioqcd')
      .leftJoinAndSelect('qpioqcd.qualityPlanIOqcQualityPointUsers', 'qpioqcu')
      .getOne();

    if (!qualityPlan) {
      throw new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.QUALITY_PLAN_NOT_FOUND'),
      );
    }

    try {
      await queryRunner.startTransaction();

      const updatedQualityPlan = this.createQualityPlanOrderEntity(request);
      updatedQualityPlan.id = qualityPlan.id;
      await manager.save(updatedQualityPlan);

      const qualityPlanIOqcs = qualityPlan.qualityPlanIOqcs;
      if (isEmpty(qualityPlanIOqcs)) {
        throw new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.QUALITY_PLAN_NOT_FOUND'),
        );
      }

      for (let i = 0; i < qualityPlanIOqcs.length; i++) {
        const qualityPlanIOqc = qualityPlanIOqcs[i];
        const qualityPlanIOqcDetails = qualityPlanIOqc.qualityPlanIOqcDetails;

        if (isEmpty(qualityPlanIOqcDetails)) {
          throw new ApiError(
            ResponseCodeEnum.BAD_REQUEST,
            await this.i18n.translate('error.QUALITY_PLAN_NOT_FOUND'),
          );
        }

        for (let j = 0; j < qualityPlanIOqcDetails.length; j++) {
          const qualityPlanIOqcDetail = qualityPlanIOqcDetails[j];
          const users = qualityPlanIOqcDetail.qualityPlanIOqcQualityPointUsers;

          if (isEmpty(users)) {
            throw new ApiError(
              ResponseCodeEnum.BAD_REQUEST,
              await this.i18n.translate('error.QUALITY_PLAN_NOT_FOUND'),
            );
          }
          for (let k = 0; k < users.length; k++) {
            const user = users[k];
            await queryRunner.manager.remove(user);
          }
          await queryRunner.manager.remove(qualityPlanIOqcDetail);
        }
        await queryRunner.manager.remove(qualityPlanIOqc);
      }

      const updateQualityPlanIOqc = await manager.save(
        this.createQualityPlanIOqcEntities(updatedQualityPlan, request),
      );

      const updateQualityPlanIOqcDetail = await manager.save(
        this.createQualityPlanIOqcDetailEntities(
          updateQualityPlanIOqc,
          request,
        ),
      );

      await manager.save(
        this.createQualityPlanIOqcQualityPointUserEntities(
          updateQualityPlanIOqc,
          updateQualityPlanIOqcDetail,
          request,
        ),
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ApiError(
        ResponseCodeEnum.INTERNAL_SERVER_ERROR,
        error?.message || error,
      );
    } finally {
      if (manager) await manager.release();
      if (queryRunner) await queryRunner.release();
    }
  }

  public async deleteQualityPlanOrder(id: number) {
    const queryRunner = await this.connection.createQueryRunner();
    const manager = queryRunner.manager;
    const qualityPlan = await this.qualityPlanRepository
      .createQueryBuilder('qp')
      .where('qp.id = :pId', { pId: id })
      .leftJoinAndSelect('qp.qualityPlanIOqcs', 'qpioqc')
      .leftJoinAndSelect('qpioqc.qualityPlanIOqcDetails', 'qpioqcd')
      .leftJoinAndSelect('qpioqcd.qualityPlanIOqcQualityPointUsers', 'qpioqcu')
      .getOne();

    try {
      await queryRunner.startTransaction();

      const qualityPlanIOqcs = qualityPlan ? qualityPlan.qualityPlanIOqcs : [];

      for (let i = 0; i < qualityPlanIOqcs.length; i++) {
        const qualityPlanIOqcDetails =
          qualityPlanIOqcs[i].qualityPlanIOqcDetails;
        for (let j = 0; j < qualityPlanIOqcDetails.length; j++) {
          const users =
            qualityPlanIOqcDetails[j].qualityPlanIOqcQualityPointUsers;
          for (let k = 0; k < users.length; k++) {
            await queryRunner.manager.remove(users[k]);
          }
          await queryRunner.manager.remove(qualityPlanIOqcDetails[j]);
        }
        await queryRunner.manager.remove(qualityPlanIOqcs[i]);
      }

      await queryRunner.manager.remove(qualityPlan);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ApiError(
        ResponseCodeEnum.INTERNAL_SERVER_ERROR,
        error?.message || error,
      );
    } finally {
      if (manager) await manager.release();
      if (queryRunner) await queryRunner.release();
    }
  }
  // END

  public async updateQualityPlan(request: UpdateQualityPlanRequestDto) {
    const queryRunner = await this.connection.createQueryRunner();
    const manager = queryRunner.manager;

    const qualityPlan = await this.qualityPlanRepository
      .createQueryBuilder('qp')
      .where('qp.id = :pId', { pId: request.id })
      .leftJoinAndSelect('qp.qualityPlanDetail', 'qpd')
      .leftJoinAndSelect('qpd.qualityPlanBoms', 'qpb')
      .leftJoinAndSelect('qpb.qualityPlanBomQualityPointUsers', 'qpbqpu')
      .getOne();

    if (!qualityPlan)
      throw new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.QUALITY_PLAN_NOT_FOUND'),
      );

    try {
      await queryRunner.startTransaction();

      const updatedQualityPlan = this.createQualityPlanEntity(request);
      updatedQualityPlan.id = qualityPlan.id;

      const updatedQualityPlanDetail = this.createQualityPlanDetailEntity(
        updatedQualityPlan,
        request,
      );
      updatedQualityPlanDetail.id = qualityPlan.qualityPlanDetail.id;

      await Promise.all([
        manager.save(updatedQualityPlan),
        manager.save(updatedQualityPlanDetail),
      ]);

      const requestBoms =
        request.moPlanBoms as UpdateQualityPlanBomRequestDto[];

      const bomUpdates = [];

      for (let i = 0; i < requestBoms.length; i++) {
        const requestBom = requestBoms[i];
        const bom = await manager.findOneOrFail(QualityPlanBom, requestBom.id);

        bom.planFrom = requestBom.planFrom;
        bom.planTo = requestBom.planTo;
        bom.planErrorRate = requestBom.planErrorRate;
        bom.planQcQuantity = requestBom.planQcQuantity;

        await manager.save(bom);

        bomUpdates.push(bom);

        await queryRunner.manager.delete(QualityPlanBomQualityPointUser, {
          qualityPlanBomId: requestBom.id,
        });
      }

      await manager.save(
        this.createQualityPlanBomQualityPointUserEntities(bomUpdates, request),
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ApiError(
        ResponseCodeEnum.INTERNAL_SERVER_ERROR,
        error?.message || error,
      );
    } finally {
      if (manager) await manager.release();
      if (queryRunner) await queryRunner.release();
    }
  }

  public async deleteQualityPlan(id: number) {
    const queryRunner = await this.connection.createQueryRunner();
    const manager = queryRunner.manager;
    const qualityPlan = await this.qualityPlanRepository
      .createQueryBuilder('qp')
      .where('qp.id = :pId', { pId: id })
      .leftJoinAndSelect('qp.qualityPlanDetail', 'qpd')
      .leftJoinAndSelect('qpd.qualityPlanBoms', 'qpb')
      .leftJoinAndSelect('qpb.qualityPlanBomQualityPointUsers', 'qpbqpu')
      .getOne();

    try {
      await queryRunner.startTransaction();

      const qualityPlanBoms = qualityPlan?.qualityPlanDetail
        ? qualityPlan.qualityPlanDetail.qualityPlanBoms
        : [];

      for (let i = 0; i < qualityPlanBoms.length; i++) {
        const qualityPlanBomQualityPointUsers =
          qualityPlanBoms[i].qualityPlanBomQualityPointUsers;

        for (let j = 0; j < qualityPlanBomQualityPointUsers.length; j++) {
          await queryRunner.manager.remove(qualityPlanBomQualityPointUsers[j]);
        }

        await queryRunner.manager.remove(qualityPlanBoms[i]);
      }

      await queryRunner.manager.remove(qualityPlan.qualityPlanDetail);
      await queryRunner.manager.remove(qualityPlan);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ApiError(
        ResponseCodeEnum.INTERNAL_SERVER_ERROR,
        error?.message || error,
      );
    } finally {
      if (manager) await manager.release();
      if (queryRunner) await queryRunner.release();
    }
  }

  public async getExistedRecord(
    id: number,
    qualityPlanDto: any,
  ): Promise<QualityPlan> {
    let entityByCodeQuery = this.qualityPlanRepository.createQueryBuilder('qp');
    const alias = entityByCodeQuery.alias;

    entityByCodeQuery = entityByCodeQuery.where(
      `"${alias}"."${QUALITY_PLAN_DB.CODE.DB_COL_NAME}" LIKE :pCode escape '\\'`,
      {
        pCode: qualityPlanDto.code,
      },
    );

    if (id) {
      entityByCodeQuery = entityByCodeQuery.andWhere(
        `"${alias}"."${QUALITY_PLAN_DB.ID.DB_COL_NAME}" != :pId`,
        {
          pId: id,
        },
      );
    }

    return await entityByCodeQuery.getOne();
  }

  public async getListOfReportIOqc(
    request: ReportQcRequestDto,
    type: number,
    poFilterIds: number[],
    proFilterIds: number[],
    soFilterIds: number[],
    filterItemIds: number[],
    filterStageIds: number[],
    isExport?: boolean,
  ): Promise<any> {
    const { keyword, sort, filter, take, skip } = handleDataRequest(request);
    let query = this.qualityPlanRepository
      .createQueryBuilder('qp')
      .select([
        'qpio.item_id AS "itemId"',
        'qpio.order_id AS "orderId"',
        'qp.qc_stage_id AS "qcStageId"',
        'sum(qpio.plan_quantity) AS "planQuantity"',
        'sum(qpio.actual_quantity) AS "actualQuantity"',
        'sum(qpio.plan_quantity - qpio.qc_pass_quantity - qpio.qc_reject_quantity) AS "needQCQuantity"',
        'sum(qpio.qc_pass_quantity + qpio.qc_reject_quantity) AS "doneQCQuantity"',
        'sum(qpio.error_quantity) AS "errorQuantity"',
      ])
      .leftJoin('quality_plan_ioqcs', 'qpio', 'qp.id = qpio.quality_plan_id');

    query =
      type == TypeReport.INPUT
        ? query.andWhere(
            `qp.qc_stage_id IN (${STAGES_OPTION.PO_IMPORT}, ${STAGES_OPTION.PRO_IMPORT})`,
          )
        : query.andWhere(
            `qp.qc_stage_id IN (${STAGES_OPTION.PRO_EXPORT}, ${STAGES_OPTION.SO_EXPORT})`,
          );

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'qcStageId':
            query.andWhere(`"qp"."qc_stage_id" = :id`, {
              id: item.text,
            });
            break;
          case 'orderCode':
            if (type == TypeReport.INPUT) {
              const subQueryInput = this.qualityPlanRepository
                .createQueryBuilder('qp')
                .select('qp.id')
                .leftJoin(
                  'quality_plan_ioqcs',
                  'qpio',
                  'qp.id = qpio.quality_plan_id',
                )
                .where(
                  new Brackets((qb) => {
                    qb.where(
                      new Brackets((qb0) => {
                        qb0
                          .where('qp.qcStageId = :qcStageId0', {
                            qcStageId0: STAGES_OPTION.PO_IMPORT,
                          })
                          .andWhere('qpio.orderId IN (:...orderId0)', {
                            orderId0: [null, ...poFilterIds],
                          });
                      }),
                    ).orWhere(
                      new Brackets((qb2) => {
                        qb2
                          .where('qp.qcStageId = :qcStageId2', {
                            qcStageId2: STAGES_OPTION.PRO_IMPORT,
                          })
                          .andWhere('qpio.orderId IN (:...orderId2)', {
                            orderId2: [null, ...proFilterIds],
                          });
                      }),
                    );
                  }),
                )
                .distinct();

              query = query
                .andWhere('qp.id IN (' + subQueryInput.getQuery() + ')')
                .setParameters(subQueryInput.getParameters());
            } else if (type == TypeReport.OUTPUT) {
              const subQueryOutput = this.qualityPlanRepository
                .createQueryBuilder('qp')
                .select('qp.id')
                .leftJoin(
                  'quality_plan_ioqcs',
                  'qpio',
                  'qp.id = qpio.quality_plan_id',
                )
                .where(
                  new Brackets((qb) => {
                    qb.where(
                      new Brackets((qb3) => {
                        qb3
                          .where('qp.qcStageId = :qcStageId3', {
                            qcStageId3: STAGES_OPTION.PRO_EXPORT,
                          })
                          .andWhere('qpio.orderId IN (:...orderId3)', {
                            orderId3: [null, ...proFilterIds],
                          });
                      }),
                    ).orWhere(
                      new Brackets((qb5) => {
                        qb5
                          .where('qp.qcStageId = :qcStageId5', {
                            qcStageId5: STAGES_OPTION.SO_EXPORT,
                          })
                          .andWhere('qpio.orderId IN (:...orderId5)', {
                            orderId5: [null, ...soFilterIds],
                          });
                      }),
                    );
                  }),
                )
                .distinct();

              query = query
                .andWhere('qp.id IN (' + subQueryOutput.getQuery() + ')')
                .setParameters(subQueryOutput.getParameters());
            }
            break;
          case 'orderName':
            if (type == TypeReport.INPUT) {
              const subQueryInput = this.qualityPlanRepository
                .createQueryBuilder('qp')
                .select('qp.id')
                .leftJoin(
                  'quality_plan_ioqcs',
                  'qpio',
                  'qp.id = qpio.quality_plan_id',
                )
                .where(
                  new Brackets((qb) => {
                    qb.where(
                      new Brackets((qb0) => {
                        qb0
                          .where('qp.qcStageId = :qcStageId0', {
                            qcStageId0: STAGES_OPTION.PO_IMPORT,
                          })
                          .andWhere('qpio.orderId IN (:...orderId0)', {
                            orderId0: [null, ...poFilterIds],
                          });
                      }),
                    ).orWhere(
                      new Brackets((qb2) => {
                        qb2
                          .where('qp.qcStageId = :qcStageId2', {
                            qcStageId2: STAGES_OPTION.PRO_IMPORT,
                          })
                          .andWhere('qpio.orderId IN (:...orderId2)', {
                            orderId2: [null, ...proFilterIds],
                          });
                      }),
                    );
                  }),
                )
                .distinct();

              query = query
                .andWhere('qp.id IN (' + subQueryInput.getQuery() + ')')
                .setParameters(subQueryInput.getParameters());
            } else if (type == TypeReport.OUTPUT) {
              const subQueryOutput = this.qualityPlanRepository
                .createQueryBuilder('qp')
                .select('qp.id')
                .leftJoin(
                  'quality_plan_ioqcs',
                  'qpio',
                  'qp.id = qpio.quality_plan_id',
                )
                .where(
                  new Brackets((qb) => {
                    qb.where(
                      new Brackets((qb3) => {
                        qb3
                          .where('qp.qcStageId = :qcStageId3', {
                            qcStageId3: STAGES_OPTION.PRO_EXPORT,
                          })
                          .andWhere('qpio.orderId IN (:...orderId3)', {
                            orderId3: [null, ...proFilterIds],
                          });
                      }),
                    ).orWhere(
                      new Brackets((qb5) => {
                        qb5
                          .where('qp.qcStageId = :qcStageId5', {
                            qcStageId5: STAGES_OPTION.SO_EXPORT,
                          })
                          .andWhere('qpio.orderId IN (:...orderId5)', {
                            orderId5: [null, ...soFilterIds],
                          });
                      }),
                    );
                  }),
                )
                .distinct();

              query = query
                .andWhere('qp.id IN (' + subQueryOutput.getQuery() + ')')
                .setParameters(subQueryOutput.getParameters());
            }
            break;
          case 'itemName':
            if (!isEmpty(filterItemIds)) {
              query.andWhere(`"qpio"."item_id" IN (:...itemIds)`, {
                itemIds: filterItemIds,
              });
            }
            break;
          case 'itemCode':
            if (!isEmpty(filterItemIds)) {
              query.andWhere(`"qpio"."item_id" IN (:...itemIds)`, {
                itemIds: filterItemIds,
              });
            }
            break;
          case 'stageName':
            if (!isEmpty(filterStageIds)) {
              query.andWhere(`"qp"."qc_stage_id" IN (:...stageIds)`, {
                stageIds: filterStageIds,
              });
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
          case 'planQuantity':
            query = query.orderBy('"planQuantity"', item.order);
            break;
          case 'actualQuantity':
            query = query.orderBy('"actualQuantity"', item.order);
            break;
          case 'needQCQuantity':
            query = query.orderBy('"needQCQuantity"', item.order);
            break;
          case 'doneQCQuantity':
            query = query.orderBy('"doneQCQuantity"', item.order);
            break;
          case 'errorQuantity':
            query = query.orderBy('"errorQuantity"', item.order);
            break;
          default:
            break;
        }
      });
    }

    query
      .groupBy('qpio.item_id')
      .addGroupBy('qpio.order_id')
      .addGroupBy('qp.qc_stage_id')
      .distinct();

    const result = await query.getRawMany();
    const total = result.length;

    return {
      result: result,
      count: total,
    };
  }

  public async getListInProgressInputPlans(
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
    let query = this.qualityPlanRepository
      .createQueryBuilder('qp')
      .select([
        'qpiod.id as "id"',
        'qp.qc_stage_id AS "qcStageId"',
        'qpio.item_id AS "itemId"',
        'qpio.order_id AS "orderId"',
        'qpio.warehouseId AS "warehouseId"',
        `TO_CHAR(qpiod.plan_from, 'YYYY-MM-DD') as "planFrom"`,
        `TO_CHAR(qpiod.plan_to, 'YYYY-MM-DD') as "planTo"`,
        'qpiod.plan_qc_quantity as "qcPlanQuantity"',
      ])
      .leftJoin('qp.qualityPlanIOqcs', 'qpio')
      .leftJoin('qpio.qualityPlanIOqcDetails', 'qpiod')
      .where('qp.qc_stage_id IN (:...types)', { types: qcTypeFilter })
      .andWhere('qp.status IN (:...inProgressStatus)', {
        inProgressStatus: InProgressQualityPlanStatus,
      })
      .orderBy('qpiod.plan_from', 'ASC');

    if (itemId) {
      query = query.andWhere('qpio.item_id = :itemId', { itemId: itemId });
    }

    if (orderId) {
      query = query.andWhere('qpio.order_id = :orderId', { orderId: orderId });
    }

    // query = query.orderBy('qpiod.plan_from', 'ASC');
    return await query.getRawMany();
  }

  public async findQualityPlanByExecutionDate(
    qcStageId: number,
    orderId: number,
    warehouseId: number,
    itemId: number,
    executionDateByPlan?: any,
  ): Promise<any> {
    const qualityPlan = await this.qualityPlanRepository
      .createQueryBuilder('qp')
      .leftJoinAndSelect('qp.qualityPlanIOqcs', 'qpio')
      .leftJoinAndSelect('qpio.qualityPlanIOqcDetails', 'qpds')
      .where('qp.qcStageId = :qcStageId', { qcStageId: qcStageId })
      .andWhere('qpio.orderId = :orderId', { orderId: orderId })
      .andWhere('qpio.warehouseId = :warehouseId', { warehouseId: warehouseId })
      .andWhere('qpio.itemId = :itemId', { itemId: itemId });

    if (executionDateByPlan) {
      qualityPlan.andWhere('qpds.planFrom <= :executionDateByPlan', {
        executionDateByPlan: executionDateByPlan,
      });
      qualityPlan.andWhere('qpds.planTo >= :executionDateByPlan', {
        executionDateByPlan: executionDateByPlan,
      });
    }

    return qualityPlan.getOne();
  }

  async findProduceStepsQualityPlansByUser(userId: number): Promise<any> {
    const query = await this.qualityPlanRepository
      .createQueryBuilder('qp')
      .select([
        'qp.id as "id"',
        'qp.code as "code"',
        'qp.name as "name"',
        'qpd.moId as "moId"',
        `CASE WHEN COUNT(qpb) = 0 THEN '[]' ELSE JSON_AGG(
          DISTINCT JSONB_BUILD_OBJECT('workOrderId', qpb.work_order_id, 'producingStepId', qpb.producing_step_id) 
        )  END AS "workOrders"`,
      ])
      .leftJoin('qp.qualityPlanDetail', 'qpd')
      .leftJoin('qpd.qualityPlanBoms', 'qpb')
      .leftJoin('qpb.qualityPlanBomQualityPointUsers', 'qpbu')
      .groupBy('qp.id')
      .addGroupBy('qpd.id')
      .where('qpbu.userId = :userId', { userId: userId });
    return await query.getRawMany();
  }

  async findIoQcPlanByUser(userId: number, type: number): Promise<any> {
    const query = await this.qualityPlanRepository
      .createQueryBuilder('qp')
      .select([
        'qp.id as "id"',
        'qp.code as "code"',
        'qp.name as "name"',
        `CASE WHEN COUNT(qpio) = 0 THEN '[]' ELSE JSON_AGG(
          DISTINCT JSONB_BUILD_OBJECT('orderId', qpio.order_id, 'itemId', qpio.item_id, 'warehouseId', qpio.warehouse_id, 'userId', qpiou.userId) 
        )  END AS "orderDetails"`,
      ])
      .leftJoin('qp.qualityPlanIOqcs', 'qpio')
      .leftJoin('qpio.qualityPlanIOqcDetails', 'qpiod')
      .leftJoin('qpiod.qualityPlanIOqcQualityPointUsers', 'qpiou')
      .groupBy('qp.id')
      .where('qpiou.userId = :userId', { userId: userId })
      .andWhere('qp.qcStageId = :type', { type: type });
    return await query.getRawMany();
  }

  public async getListInProgressProducingStepQcPlans(
    request: GetDashboardFinishedItemProgressRequestDto,
  ): Promise<any> {
    const { moId, producingStepId, itemId } = request;
    const query = this.qualityPlanRepository
      .createQueryBuilder('qp')
      .select([
        'qp.id as "id"',
        'qp.qc_stage_id AS "qcStageId"',
        'qpd.mo_id AS "moId"',
        'qpb.work_order_id AS "orderId"',
        `TO_CHAR(qpb.plan_from, 'YYYY-MM-DD') as "planFrom"`,
        `TO_CHAR(qpb.plan_to, 'YYYY-MM-DD') as "planTo"`,
        'qpb.plan_qc_quantity as "qcPlanQuantity"',
      ])
      .leftJoin('qp.qualityPlanDetail', 'qpd')
      .leftJoin('qpd.qualityPlanBoms', 'qpb')
      .where('qp.qc_stage_id IN (:...types)', {
        types: [TransactionHistoryTypeEnum.OutputProducingStep],
      })
      .andWhere('qp.status IN (:...inProgressStatus)', {
        inProgressStatus: InProgressQualityPlanStatus,
      });

    if (moId) {
      query.andWhere('qpd.moId = :moId', { moId: moId });
    }

    if (producingStepId) {
      query.andWhere('qpb.producingStepId = :producingStepId', {
        producingStepId: producingStepId,
      });
    }

    if (itemId) {
      // TODO: filter by item ID
    }

    return await query.getRawMany();
  }
}
