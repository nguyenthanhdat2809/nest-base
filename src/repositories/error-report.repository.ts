import { HttpException, Injectable } from '@nestjs/common';
import { Brackets, Connection, QueryRunner, Repository } from 'typeorm';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import {
  ErrorReport,
  ErrorReportStatus,
  QCType,
} from '@entities/error-report/error-report.entity';
import { ErrorReportRepositoryInterface } from '@components/error-report/interface/error-report.repository.interface';
import { ErrorReportRequestDto } from '@components/error-report/dto/request/error-report.request.dto';
import { ErrorReportListRequestDto } from '@components/error-report/dto/request/error-report-list.request.dto';
import { escapeCharForSearch } from '@utils/common';
import {
  ERROR_REPORT_CONST,
} from '@constant/entity.constant';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ErrorReportStageDetail } from '@entities/error-report/error-report-stage-detail.entity';
import { ErrorReportIoqcDetail } from '@entities/error-report/error-report-ioqc-detail.entity';
import { ErrorReportErrorList } from '@entities/error-report/error-report-error-list.entity';
import { ErrorReportErrorDetail } from '@entities/error-report/error-report-error-detail.entity';
import { UpdateErrorReportRequestDto } from '@components/error-report/dto/request/update-error-report.request.dto';
import { I18nService } from 'nestjs-i18n';
import { ErrorReportStageDetailRequestDto } from '@components/error-report/dto/request/error-report-stage-detail.request.dto';
import { ErrorReportErrorListRequestDto } from '@components/error-report/dto/request/error-report-error-list.request.dto';
import { ErrorReportIoqcDetailRequestDto } from '@components/error-report/dto/request/error-report-ioqc-detail.request.dto';
import { ApiError } from '@utils/api.error';
import { CreateErrorReportRequestDto } from '@components/error-report/dto/request/create-error-report.request.dto';
import { ErrorReportListIOForAppRequestDto } from '@components/error-report/dto/request/error-report-list-io-for-app.request.dto';
import { STAGES_OPTION } from '@constant/qc-stage.constant';
import { OrderTypeProductionOrderEnum } from '@components/sale/sale.constant';
import { isEmpty } from 'lodash';
import { CreateErrorReportIOqcRequestDto } from '@components/error-report/dto/request/create-error-report-ioqc.request.dto';
import { TransactionHistoryTypeEnum } from '@components/transaction-history/transaction-history.constant';
import { TIME_ZONE_VN } from '@constant/common';
import { extendMoment } from 'moment-range';
import * as MomentTimezone from 'moment-timezone';
import { ERROR_GROUP_CONST } from '@components/error-group/error-group.constant';

const moment = extendMoment(MomentTimezone);

@Injectable()
export class ErrorReportRepository
  extends BaseAbstractRepository<ErrorReport>
  implements ErrorReportRepositoryInterface
{
  constructor(
    @InjectRepository(ErrorReport)
    private readonly errorReportRepository: Repository<ErrorReport>,

    @InjectConnection()
    private readonly connection: Connection,

    private readonly i18n: I18nService,
  ) {
    super(errorReportRepository);

    this.fieldMap.set(
      ERROR_REPORT_CONST.ERROR_REPORT.QC_STAGE_ID.COL_NAME.toLowerCase(),
      ERROR_REPORT_CONST.ERROR_REPORT.QC_STAGE_ID.DB_COL_NAME,
    );
    this.fieldMap.set(
      ERROR_REPORT_CONST.ERROR_REPORT.CREATED_BY.COL_NAME.toLowerCase(),
      ERROR_REPORT_CONST.ERROR_REPORT.CREATED_BY.DB_COL_NAME,
    );
    this.fieldMap.set(
      ERROR_REPORT_CONST.ERROR_REPORT.STATUS.COL_NAME.toLowerCase(),
      ERROR_REPORT_CONST.ERROR_REPORT.STATUS.DB_COL_NAME,
    );
    this.fieldMap.set(
      ERROR_REPORT_CONST.ERROR_REPORT.CREATED_BY.COL_NAME.toLowerCase(),
      ERROR_REPORT_CONST.ERROR_REPORT.CREATED_BY.DB_COL_NAME,
    );
  }

  public createEntity(request: any): ErrorReport {
    const errorReportEntity = new ErrorReport();
    errorReportEntity.name = request.name.trim();
    errorReportEntity.qcStageId = request.qcStageId;
    errorReportEntity.createdBy = request.createdBy;
    errorReportEntity.status = request.status;
    errorReportEntity.reportType = request.reportType;
    errorReportEntity.transactionHistoryId = request.transactionHistoryId;
    return errorReportEntity;
  }

  public async getList(
    request: ErrorReportListRequestDto,
    filterStageSearch: any,
    filterUserIds: number[],
    poFilterIds: number[],
    proFilterIds: number[],
    soFilterIds: number[],
    woFilterIds: number[],
  ) {
    const { filter, sort } = request;
    let query = this.errorReportRepository
      .createQueryBuilder('e')
      .select([
        'e.id as "id"',
        'e.code as "code"',
        'e.name as "name"',
        'e.qcStageId as "qcStageId"',
        'e.createdBy as "createdBy"',
        'e.status as "status"',
        'e.createdAt as "createdAt"',
        'e.updatedAt as "updatedAt"',
        'th.code as "transactionHistoryCode"',
        'th.createdAt as "transactionHistoryCreatedAt"',
        'th.createdByUserId as "transactionHistoryCreatedByUserId"',
        'th.consignmentName as "transactionHistoryConsignmentName"',
        `CASE e.qcStageId
          WHEN 0 THEN ereli.priority
          WHEN 2 THEN ereli.priority
          WHEN 3 THEN ereli.priority
          WHEN 5 THEN ereli.priority
          WHEN 8 THEN erels.priority
          WHEN 9 THEN erels.priority
          END AS "priority"`,
        `CASE e.qcStageId
          WHEN 0 THEN ereli.errorDescription
          WHEN 2 THEN ereli.errorDescription
          WHEN 3 THEN ereli.errorDescription
          WHEN 5 THEN ereli.errorDescription
          WHEN 8 THEN erels.errorDescription
          WHEN 9 THEN erels.errorDescription
          END AS "errorDescription"`,
        `CASE e.qcStageId
          WHEN 0 THEN ereli.assignedTo
          WHEN 2 THEN ereli.assignedTo
          WHEN 3 THEN ereli.assignedTo
          WHEN 5 THEN ereli.assignedTo
          WHEN 8 THEN erels.assignedTo
          WHEN 9 THEN erels.assignedTo
          END AS "assignedTo"`,
        `CASE e.qcStageId
          WHEN 0 THEN ereli.repairDeadline
          WHEN 2 THEN ereli.repairDeadline
          WHEN 3 THEN ereli.repairDeadline
          WHEN 5 THEN ereli.repairDeadline
          WHEN 8 THEN erels.repairDeadline
          WHEN 9 THEN erels.repairDeadline
          END AS "repairDeadline"`,
        `CASE
          WHEN e.qcStageId = 0 AND COUNT(erelid) > 0 THEN JSON_AGG(DISTINCT erelid.data_erelid)
          WHEN e.qcStageId = 2 AND COUNT(erelid) > 0 THEN JSON_AGG(DISTINCT erelid.data_erelid)
          WHEN e.qcStageId = 3 AND COUNT(erelid) > 0 THEN JSON_AGG(DISTINCT erelid.data_erelid)
          WHEN e.qcStageId = 5 AND COUNT(erelid) > 0 THEN JSON_AGG(DISTINCT erelid.data_erelid)
          WHEN e.qcStageId = 8 AND COUNT(erelsd) > 0 THEN JSON_AGG(DISTINCT erelsd.data_erelsd)
          WHEN e.qcStageId = 9 AND COUNT(erelsd) > 0 THEN JSON_AGG(DISTINCT erelsd.data_erelsd)
          END AS "errorReportErrorDetails"`,
        'erid.orderId as "orderId"',
        'ersd.workOrderId as "workOrderId"',
      ])
      .leftJoin('e.transactionHistory', 'th')
      .leftJoin('e.errorReportStageDetail', 'ersd')
      .leftJoin('e.errorReportIoqcDetail', 'erid')

      .leftJoin('ersd.errorReportErrorList', 'erels')
      .leftJoin('erid.errorReportErrorList', 'ereli')

      .leftJoin(
        (db) =>
          db
            .select([
              'erelsd.id as id',
              'erelsd.error_report_error_list_id as error_report_error_list_id',
              `CASE WHEN COUNT(erelsd) = 0 THEN '{}' ELSE
                JSONB_BUILD_OBJECT(
                  'id', erelsd.id,
                  'errorGroupName', egs.name,
                  'causeGroupName', cgs.name,
                  'errorItemQuantity', erelsd.errorItemQuantity,
                  'repairItemQuantity', erelsd.repairItemQuantity
                )
              END AS "data_erelsd"`,
            ])
            .from('error_report_error_details', 'erelsd')
            .leftJoin('erelsd.errorGroup', 'egs')
            .leftJoin('erelsd.causeGroup', 'cgs')
            .groupBy('erelsd.id')
            .addGroupBy('egs.id')
            .addGroupBy('cgs.id'),
        'erelsd',
        'erelsd.error_report_error_list_id = erels.id',
      )

      .leftJoin(
        (db) =>
          db
            .select([
              'erelid.id as id',
              'erelid.error_report_error_list_id as error_report_error_list_id',
              `CASE WHEN COUNT(erelid) = 0 THEN '{}' ELSE
                JSONB_BUILD_OBJECT(
                  'id', erelid.id,
                  'errorGroupName', egi.name,
                  'causeGroupName', cgi.name,
                  'errorItemQuantity', erelid.errorItemQuantity,
                  'repairItemQuantity', erelid.repairItemQuantity
                )
              END AS "data_erelid"`,
            ])
            .from('error_report_error_details', 'erelid')
            .leftJoin('erelid.errorGroup', 'egi')
            .leftJoin('erelid.causeGroup', 'cgi')
            .groupBy('erelid.id')
            .addGroupBy('egi.id')
            .addGroupBy('cgi.id'),
        'erelid',
        'erelid.error_report_error_list_id = ereli.id',
      )

    const alias = query.alias;
    const keyword = request.keyword?.trim();

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
          `(LOWER("${alias}"."${ERROR_GROUP_CONST.CODE.DB_COL_NAME}") LIKE LOWER(:pkeyWord) escape '\\'`,
          {
            pkeyWord: `%${escapeCharForSearch(keyword)}%`,
          },
        )
        .orWhere(
          `LOWER("${alias}"."${ERROR_GROUP_CONST.NAME.DB_COL_NAME}") LIKE LOWER(:pkeyWord) escape '\\')`,
          {
            pkeyWord: `%${escapeCharForSearch(keyword)}%`,
          },
        );
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'createdBy':
            if (!isEmpty(filterUserIds)) {
              query.andWhere(`"e"."created_by" IN (:...filterUserIds)`, {
                filterUserIds: filterUserIds,
              });
            }
            break;
          case 'transactionHistoryCode':
            query.andWhere(`LOWER(th.code) LIKE LOWER(:code) ESCAPE '\\'`, {
              code: `%${escapeCharForSearch(item.text)}%`,
            });
            break;
          case 'orderName':
            const subQuery = this.errorReportRepository
              .createQueryBuilder('eSub')
              .select("eSub.id")
              .leftJoin('eSub.errorReportStageDetail', 'ersdSub')
              .leftJoin('eSub.errorReportIoqcDetail', 'eridSub')
              .where(new Brackets(qb => {
                qb.where(new Brackets(qb0 => {
                    qb0.where("eSub.qcStageId = :qcStageId0", { qcStageId0: STAGES_OPTION.PO_IMPORT })
                       .andWhere("eridSub.orderId IN (:...orderId0)", { orderId0: [null, ...poFilterIds] })
                  }))
                  .orWhere(new Brackets(qb2 => {
                    qb2.where("eSub.qcStageId = :qcStageId2", { qcStageId2: STAGES_OPTION.PRO_IMPORT })
                       .andWhere("eridSub.orderId IN (:...orderId2)", { orderId2: [null, ...proFilterIds] })
                  }))
                  .orWhere(new Brackets(qb3 => {
                    qb3.where("eSub.qcStageId = :qcStageId3", { qcStageId3: STAGES_OPTION.PRO_EXPORT })
                       .andWhere("eridSub.orderId IN (:...orderId3)", { orderId3: [null, ...proFilterIds] })
                  }))
                  .orWhere(new Brackets(qb5 => {
                    qb5.where("eSub.qcStageId = :qcStageId5", { qcStageId5: STAGES_OPTION.SO_EXPORT })
                       .andWhere("eridSub.orderId IN (:...orderId5)", { orderId5: [null, ...soFilterIds] })
                  }))
                  .orWhere(new Brackets(qb8 => {
                    qb8.where("eSub.qcStageId = :qcStageId8", { qcStageId8: STAGES_OPTION.OUTPUT_PRODUCTION })
                       .andWhere("ersdSub.workOrderId IN (:...workOrderId8)", { workOrderId8: [null, ...woFilterIds] })
                  }))
                  .orWhere(new Brackets(qb9 => {
                    qb9.where("eSub.qcStageId = :qcStageId9", { qcStageId9: STAGES_OPTION.INPUT_PRODUCTION })
                       .andWhere("ersdSub.workOrderId IN (:...workOrderId9)", { workOrderId9: [null, ...woFilterIds] })
                  }))
              }))
              .distinct();

            query = query.andWhere("e.id IN (" + subQuery.getQuery() + ")")
              .setParameters(subQuery.getParameters());

            break;
          default:
            break;
        }
      });
    }

    query = await request.buildSearchFilterQuery(query, this.fieldMap);

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        switch (item.column) {
          case 'transactionHistoryCode':
            query = query.orderBy('th.id', item.order);
            break;
          case 'code':
            query = query.orderBy('e.id', item.order);
            break;
          default:
            break;
        }
      });
    }

    query = query.groupBy('e.id')
                 .addGroupBy('th.id')
                 .addGroupBy('ersd.id')
                 .addGroupBy('erid.id')
                 .addGroupBy('erels.id')
                 .addGroupBy('ereli.id');

    const result =  await query.getRawMany();
    const count = await query.getCount();

    return {
      result: result,
      count: count,
    };
  }

  public async getExistedRecord(
    id: number,
    errorReportDto: ErrorReportRequestDto,
  ): Promise<[ErrorReport, ErrorReport]> {
    let entityByCodeQuery = this.errorReportRepository
      .createQueryBuilder('c')
      .withDeleted();
    let entityByNameQuery = this.errorReportRepository
      .createQueryBuilder('c')
      .withDeleted();
    const alias = entityByCodeQuery.alias;

    entityByCodeQuery = entityByCodeQuery.where(
      `"${alias}"."${ERROR_GROUP_CONST.CODE.DB_COL_NAME}" LIKE :pCode escape '\\'`,
      {
        pCode: errorReportDto.code.trim(),
      },
    );

    entityByNameQuery = entityByNameQuery.where(
      `"${alias}"."${ERROR_GROUP_CONST.NAME.DB_COL_NAME}" LIKE :pName escape '\\'`,
      {
        pName: errorReportDto.name.trim(),
      },
    );

    if (id) {
      entityByCodeQuery = entityByCodeQuery.andWhere(
        `"${alias}"."${ERROR_GROUP_CONST.ID.DB_COL_NAME}" != :pId`,
        {
          pId: id,
        },
      );

      entityByNameQuery = entityByNameQuery.andWhere(
        `"${alias}"."${ERROR_GROUP_CONST.ID.DB_COL_NAME}" != :pId`,
        {
          pId: id,
        },
      );
    }

    return await Promise.all([
      entityByCodeQuery.getOne(),
      entityByNameQuery.getOne(),
    ]);
  }

  public async findOneByCode(code: string): Promise<ErrorReport> {
    const query = this.errorReportRepository
      .createQueryBuilder('e')
      .withDeleted();
    const alias = query.alias;

    return await query
      .where(
        `"${alias}"."${ERROR_GROUP_CONST.CODE.DB_COL_NAME}" LIKE :pCode escape '\\'`,
        {
          pCode: code.trim(),
        },
      )
      .getOne();
  }

  public async getDetail(errorReport: ErrorReport): Promise<ErrorReport> {
    const id = errorReport?.id;
    const reportType = errorReport.reportType;
    let query = this.errorReportRepository
      .createQueryBuilder('er')
      .where(`er.id = :pId`, { pId: id });

    let joinAlias: string;

    if (reportType == QCType.StageQC) {
      joinAlias = 'ersd';
      query = query.leftJoinAndSelect('er.errorReportStageDetail', joinAlias);
    } else {
      joinAlias = 'erid';
      query = query.leftJoinAndSelect('er.errorReportIoqcDetail', joinAlias);
    }

    query = query
      .leftJoinAndSelect(`${joinAlias}.errorReportErrorList`, 'erel')
      .leftJoinAndSelect('erel.errorReportErrorDetails', 'ered')
      .leftJoinAndSelect('ered.errorGroup', 'eg')
      .leftJoinAndSelect('ered.causeGroup', 'cg');

    return await query.getOne();
  }

  async updateErrorReport(
    request: UpdateErrorReportRequestDto,
    errorReport: ErrorReport,
  ): Promise<ErrorReport> {
    const queryRunner = this.connection.createQueryRunner();
    const manager = queryRunner.manager;

    try {
      await queryRunner.startTransaction();

      let errorReportDetail: ErrorReportStageDetail | ErrorReportIoqcDetail;
      let errorReportErrorListQuery = manager.createQueryBuilder(
        ErrorReportErrorList,
        'erel',
      );

      if (errorReport.reportType == QCType.StageQC) {
        errorReportDetail = await manager
          .createQueryBuilder(ErrorReportStageDetail, 'ersd')
          .where('ersd.error_report_id = :pErId', { pErId: errorReport.id })
          .getOneOrFail();

        errorReportErrorListQuery = errorReportErrorListQuery.where(
          'erel.error_report_stage_detail_id = :pErsdId',
          {
            pErsdId: errorReportDetail.id,
          },
        );
      } else {
        errorReportDetail = await manager
          .createQueryBuilder(ErrorReportIoqcDetail, 'erid')
          .where('erid.error_report_id = :pErId', { pErId: errorReport.id })
          .getOneOrFail();

        errorReportErrorListQuery = errorReportErrorListQuery.where(
          'erel.error_report_ioqc_detail_id = :pEridId',
          {
            pEridId: errorReportDetail.id,
          },
        );
      }

      const errorReportErrorList =
        await errorReportErrorListQuery.getOneOrFail();

      errorReportErrorList.priority = request.priority;
      errorReportErrorList.assignedTo = request.assignTo;
      errorReportErrorList.repairDeadline = request.repairDeadline;

      const requestDescription = request.errorDescription;

      if (requestDescription)
        errorReportErrorList.errorDescription = requestDescription.trim();

      await manager.save(errorReportErrorList);

      const errorReportErrorDetails = await manager
        .createQueryBuilder(ErrorReportErrorDetail, 'ered')
        .where('ered.error_report_error_list_id = :pErelId', {
          pErelId: errorReportErrorList.id,
        })
        .getMany();

      const errorCauseRequest = new Map(
        request.errorCauseMap.map((ec) => [ec.errorGroupId, ec.causeGroupId]),
      );

      for (const e of errorReportErrorDetails) {
        const requestCauseGroupId = errorCauseRequest.get(e.errorGroupId);

        if (!requestCauseGroupId)
          throw new HttpException(
            await this.i18n.translate('error.CAUSE_GROUP_NOT_FOUND'),
            ResponseCodeEnum.BAD_REQUEST,
          );

        e.causeGroupId = requestCauseGroupId;
      }

      await manager.save(errorReportErrorDetails);
      await queryRunner.commitTransaction();

      return errorReport;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error?.message || error;
    } finally {
      await queryRunner.release();
    }
  }

  async confirm(
    errorReport: ErrorReport,
    confirmBy: number,
  ): Promise<ErrorReport> {
    errorReport.confirmedBy = confirmBy;
    errorReport.confirmedAt = new Date();
    errorReport.status = ErrorReportStatus.Confirmed;
    return await this.errorReportRepository.save(errorReport);
  }

  createErrorReportStageDetailsEntity(
    errorReportStageDetailsDto: ErrorReportStageDetailRequestDto,
  ): ErrorReportStageDetail {
    const errorReportStageDetail = new ErrorReportStageDetail();
    errorReportStageDetail.errorReportId =
      errorReportStageDetailsDto.errorReportId;
    errorReportStageDetail.itemId = errorReportStageDetailsDto.itemId;
    errorReportStageDetail.routingId = errorReportStageDetailsDto.routingId;
    errorReportStageDetail.producingStepId =
      errorReportStageDetailsDto.producingStepId;
    errorReportStageDetail.moId = errorReportStageDetailsDto.moId;
    errorReportStageDetail.workOrderId = errorReportStageDetailsDto.workOrderId;
    return errorReportStageDetail;
  }

  createErrorReportIoqcDetailEntity(
    errorReportIoqcDetailDto: ErrorReportIoqcDetailRequestDto,
  ): ErrorReportIoqcDetail {
    const { errorReportId, itemId, warehouseId, customerId, orderId } =
      errorReportIoqcDetailDto;
    const errorReportIoqcDetail = new ErrorReportIoqcDetail();

    errorReportIoqcDetail.errorReportId = errorReportId;
    errorReportIoqcDetail.itemId = itemId;
    errorReportIoqcDetail.warehouseId = warehouseId;
    errorReportIoqcDetail.customerId = customerId;
    errorReportIoqcDetail.orderId = orderId;

    return errorReportIoqcDetail;
  }

  createErrorReportErrorListEntity(
    errorReportErrorListDto: ErrorReportErrorListRequestDto,
  ): ErrorReportErrorList {
    const errorReportErrorList = new ErrorReportErrorList();
    errorReportErrorList.assignedTo = errorReportErrorListDto.assignedTo;
    errorReportErrorList.errorDescription =
      errorReportErrorListDto.errorDescription;
    errorReportErrorList.priority = errorReportErrorListDto.priority;
    errorReportErrorList.repairDeadline =
      errorReportErrorListDto.repairDeadline;
    errorReportErrorList.errorReportIoqcDetailId =
      errorReportErrorListDto.errorReportIoqcDetailId;
    errorReportErrorList.errorReportStageDetailId =
      errorReportErrorListDto.errorReportStageDetailId;
    return errorReportErrorList;
  }
  createErrorReportErrorDetailsEntity(payload: any): ErrorReportErrorDetail {
    const errorReportErrorDetail = new ErrorReportErrorDetail();
    errorReportErrorDetail.errorGroupId = payload.errorGroupId;
    errorReportErrorDetail.causeGroupId = payload.causeGroupId;
    errorReportErrorDetail.errorReportErrorListId =
      payload.errorReportErrorListId;
    errorReportErrorDetail.errorItemQuantity = payload.errorItemQuantity;
    return errorReportErrorDetail;
  }

  public async getListErrorReportStageDetailByStageId(
    stageId: number,
  ): Promise<any> {
    const query = this.errorReportRepository
      .createQueryBuilder('er')
      .select([
        'ersd.error_report_id AS "errorReportId"',
        'ersd.work_order_id AS "workOrderId"',
      ])
      .leftJoin('er.errorReportStageDetail', 'ersd');

    return await query.getRawMany();
  }

  public async getDetailByWO(workOrderId: number): Promise<any> {
    const query = this.errorReportRepository
      .createQueryBuilder('er')
      .select([
        'er.id as "id"',
        'er.name as "name"',
        'er.code as "code"',
        'er.status as "status"',
        `CASE WHEN COUNT(ereg) = 0 THEN '[]' ELSE JSON_AGG(
         DISTINCT JSONB_BUILD_OBJECT('id', ereg.id,'name', ereg.name, 'errorItemQuantityRemained',
         ered.error_item_quantity - ered.repair_item_quantity,'errorReportDetailsId',ered.id))
         END AS "errorGroups"`,
      ])
      .innerJoin('er.errorReportStageDetail', 'ersd')
      .innerJoin('ersd.errorReportErrorList', 'erel')
      .innerJoin('erel.errorReportErrorDetails', 'ered')
      .innerJoin('ered.errorGroup', 'ereg')
      .groupBy('er.id')
      .where('ersd.workOrderId = :wId', { wId: workOrderId })
      .andWhere('er.status = :status', { status: ErrorReportStatus.Confirmed });
    return await query.getRawMany();
  }

  public async getStageListForApp(
    request: ErrorReportListRequestDto,
    woFilterMoIds?: number[],
    woFilterKwIds?: number[],
    itemFilterKwIds?: number[],
  ): Promise<any> {
    const { keyword, filter, take, skip } = request;
    let query = this.errorReportRepository
      .createQueryBuilder('er')
      .select([
        'er.id as "id"',
        'er.code as "code"',
        'er.status as "status"',
        'er.createdAt as "createdAt"',
        'ersd.workOrderId as "workOrderId"',
        'er.qcStageId as "qcStageId"',
        'ersd.itemId as "itemId"',
        'erth.itemType as "itemType"',
      ])
      .innerJoin('er.transactionHistory', 'erth')
      .innerJoin('er.errorReportStageDetail', 'ersd');
    // filter
    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'createdAt':
            const createdFrom = item.text.split('|')[0];
            const createdTo = item.text.split('|')[1];
            query = query.andWhere(
              `"er"."created_at" between :createdFrom AND :createdTo`,
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

    if (keyword) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where(`LOWER("er"."code") LIKE LOWER(:pkeyWord) escape '\\'`, {
            pkeyWord: `%${escapeCharForSearch(keyword)}%`,
          });
          if (!isEmpty(woFilterKwIds)) {
            qb.orWhere(`"ersd"."work_order_id" IN (:...woFilterKwIds)`, {
              woFilterKwIds: woFilterKwIds,
            });
          }
          if (!isEmpty(itemFilterKwIds)) {
            qb.orWhere(`"erth"."item_id" IN (:...itemFilterKwIds)`, {
              itemFilterKwIds: itemFilterKwIds,
            });
          }
        }),
      );
    }

    if (!isEmpty(woFilterMoIds)) {
      query = query.andWhere(`"ersd"."work_order_id" IN (:...woFilterMoIds)`, {
        woFilterMoIds: woFilterMoIds,
      });
    }

    query = query.orderBy('er.createdAt', 'DESC');
    const result = await query.offset(skip).limit(take).getRawMany();
    const count = await query.getCount();
    return {
      result: result,
      total: count,
    };
  }

  public async getStageDetailForApp(id: number): Promise<any> {
    const query = this.errorReportRepository
      .createQueryBuilder('er')
      .withDeleted()
      .select([
        'er.id as "id"',
        'er.name as "name"',
        'er.code as "code"',
        'er.status as "status"',
        'er.createdAt as "createdAt"',
        'er.createdBy as "createdBy"',
        'er.transactionHistoryId as "transactionHistoryId"',
        'er.status as "status"',
        'er.qcStageId as "qcStageId"',
        'eth.itemId as "itemId"',
        'eth.itemType as "itemType"',
        'eth.workCenterId as "workCenterId"',
        'eth.consignmentName as "lotNumber"',
        'eth.qcQuantityRule as "qcQuantityRule"',
        'eth.qualityPointId as "qualityPointId"',
        'eth.numberOfTimeQc as "numberOfTimeQc"',
        'ersd.workOrderId as "workOrderId"',
        'erel.priority as "priority"',
        'erel.repairDeadline as "repairDeadline"',
        'erel.errorDescription as "errorDescription"',
        'erel.assignedTo as "assignedTo"',
        `CASE WHEN COUNT(ereg) = 0 THEN '[]' ELSE JSON_AGG(
         DISTINCT JSONB_BUILD_OBJECT('id', ereg.id,'name', ereg.name, 'errorItemQuantity',
         ered.error_item_quantity,'repairItemQuantity', ered.repair_item_quantity, 'causeGroup', cg.cause_group))
         END AS "errorGroups"`,
      ])
      .innerJoin('er.transactionHistory', 'eth')
      .innerJoin('er.errorReportStageDetail', 'ersd')
      .innerJoin('ersd.errorReportErrorList', 'erel')
      .innerJoin('erel.errorReportErrorDetails', 'ered')
      .innerJoin('ered.errorGroup', 'ereg')
      .innerJoin(
        (qb) =>
          qb
            .select([
              'cg.id as id',
              `CASE WHEN COUNT(cg) = 0 THEN '{}' ELSE JSONB_BUILD_OBJECT('id', cg.id, 'name', cg.name, 'code', cg.code) END AS "cause_group"`,
            ])
            .from('cause_groups', 'cg')
            .groupBy('cg.id'),
        'cg',
        'cg.id = ered.cause_group_id',
      )
      .groupBy('er.id')
      .addGroupBy('ersd.id')
      .addGroupBy('erel.id')
      .addGroupBy('eth.id')
      .where('er.id = :Id', { Id: id });
    return await query.getRawOne();
  }

  private async saveErrorReport(
    queryRunner: QueryRunner,
    name: string,
    qcStageId: number,
    createdByUserId: number,
    status: number,
    reportType: number,
    transactionHistoryId: number,
  ): Promise<ErrorReport> {
    // Create Error Report entity
    const errorReportEntity = this.createEntity({
      name: name,
      qcStageId: qcStageId,
      createdBy: createdByUserId,
      status: status,
      reportType: reportType,
      transactionHistoryId: transactionHistoryId,
    });
    const errorReport = await queryRunner.manager.save(errorReportEntity);
    // Update errorReport auto-generated code with ID
    const errorReportCode =
      ERROR_REPORT_CONST.ERROR_REPORT.CODE.PREFIX + errorReport.id;
    const errorReportWithSameCode = await this.findOneByCode(errorReportCode);

    if (errorReportWithSameCode) {
      throw new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.ERROR_REPORT_WITH_CODE_EXISTED'),
      );
    }

    errorReport.code = errorReportCode;

    return await queryRunner.manager.save(errorReportEntity);
  }

  private async saveErrorReportDetails(queryRunner: QueryRunner, request: any) {
    const {
      receivedUserId,
      errorDescription,
      errorReportIoqcDetailId,
      errorReportStageDetailId,
      priority,
      repairDeadline,
      errorGroups,
    } = request;

    const errorReportErrorListEntity = this.createErrorReportErrorListEntity({
      assignedTo: receivedUserId,
      errorDescription: errorDescription,
      errorReportIoqcDetailId: errorReportIoqcDetailId,
      errorReportStageDetailId: errorReportStageDetailId,
      priority: priority,
      repairDeadline: repairDeadline,
    });

    const errorReportErrorList = await queryRunner.manager.save(
      errorReportErrorListEntity,
    );

    // create error report error details entities
    const errorReportErrorListId = errorReportErrorList.id;
    const errorReportErrorDetailsEntities = request.errorGroups.map(
      (errorGroup) =>
        this.createErrorReportErrorDetailsEntity({
          errorReportErrorListId: errorReportErrorListId,
          errorGroupId: errorGroup.id,
          causeGroupId: errorGroup.causeGroupId,
          errorItemQuantity: errorGroup.qcRejectQuantity,
        }),
    );
    await queryRunner.manager.save(errorReportErrorDetailsEntities);
  }

  public async createProduceStepsErrorReport(
    request: CreateErrorReportRequestDto,
    workOrder: any,
    qcStageId: number,
    itemId: number,
    reportType: number,
  ): Promise<ErrorReport> {
    const {
      repairDeadline,
      priority,
      createdByUserId,
      name,
      receivedUserId,
      errorDescription,
      orderId,
      errorGroups,
      transactionHistoryId,
    } = request;
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      const errorReportEntity = await this.saveErrorReport(
        queryRunner,
        name,
        qcStageId,
        createdByUserId,
        ErrorReportStatus.Awaiting,
        reportType,
        transactionHistoryId,
      );

      // create error report stage details entity
      const errorReportStageDetailsDto: ErrorReportStageDetailRequestDto = {
        moId: workOrder.mo?.id,
        moDetailId: workOrder.moDetail?.id, //mock data before mesx update data
        itemId: itemId, //mock data before mesx update data
        producingStepId: workOrder.producingStep?.id,
        routingId: workOrder.routing?.id,
        errorReportId: errorReportEntity.id,
        workOrderId: orderId,
      };
      const errorReportStageDetailsEntity =
        this.createErrorReportStageDetailsEntity(errorReportStageDetailsDto);
      const errorReportStageDetail = await queryRunner.manager.save(
        errorReportStageDetailsEntity,
      );

      await this.saveErrorReportDetails(queryRunner, {
        receivedUserId: receivedUserId,
        errorDescription: errorDescription,
        errorReportIoqcDetailId: null,
        errorReportStageDetailId: errorReportStageDetail.id,
        priority: priority,
        repairDeadline: repairDeadline,
        errorGroups: errorGroups,
      });

      await queryRunner.commitTransaction();

      return errorReportEntity;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ApiError(
        ResponseCodeEnum.INTERNAL_SERVER_ERROR,
        error?.message || error,
      );
    } finally {
      if (queryRunner && !queryRunner.isReleased) await queryRunner.release();
    }
  }

  public async createIoqcErrorReport(
    request: CreateErrorReportIOqcRequestDto,
    qcStageId: number,
    reportType: number,
  ): Promise<ErrorReport> {
    const {
      repairDeadline,
      priority,
      createdByUserId,
      name,
      receivedUserId,
      errorDescription,
      errorGroups,
      transactionHistoryId,
      orderId,
      warehouseId,
      itemId,
      customerId,
      vendorId,
    } = request;
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      const errorReportEntity = await this.saveErrorReport(
        queryRunner,
        name,
        qcStageId,
        createdByUserId,
        ErrorReportStatus.Awaiting,
        reportType,
        transactionHistoryId,
      );
      // create error report stage details entity
      const errorReportIoqcDetailDto: ErrorReportIoqcDetailRequestDto = {
        errorReportId: errorReportEntity.id,
        itemId: itemId,
        customerId: customerId || vendorId || null,
        orderId: orderId,
        warehouseId: warehouseId,
      };

      const errorReportIoqcDetailEntity =
        this.createErrorReportIoqcDetailEntity(errorReportIoqcDetailDto);
      const errorReportIoqcDetail = await queryRunner.manager.save(
        errorReportIoqcDetailEntity,
      );

      await this.saveErrorReportDetails(queryRunner, {
        receivedUserId: receivedUserId,
        errorDescription: errorDescription,
        errorReportIoqcDetailId: errorReportIoqcDetail.id,
        errorReportStageDetailId: null,
        priority: priority,
        repairDeadline: repairDeadline ? moment(repairDeadline).tz(TIME_ZONE_VN).endOf('day').format() : null,
        errorGroups: errorGroups,
      });

      await queryRunner.commitTransaction();

      return errorReportEntity;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ApiError(
        ResponseCodeEnum.INTERNAL_SERVER_ERROR,
        error?.message || error,
      );
    } finally {
      if (queryRunner && !queryRunner.isReleased) await queryRunner.release();
    }
  }

  // Danh sách phiếu báo cáo lỗi app
  public async getListErrorReportInputForApp(
    request: ErrorReportListIOForAppRequestDto,
    keywordOrderIds: number[],
    keywordItemIds: number[],
    filterOrderIds: number[],
    filteredArrayOrderIds: number[],
  ) {
    const { type, filter } = request;
    const keyword = request.keyword?.trim();

    let qcStageInputIds;
    if (type === OrderTypeProductionOrderEnum.Input) {
      qcStageInputIds = `${STAGES_OPTION.PO_IMPORT}, ${STAGES_OPTION.PRO_IMPORT}`;
    } else if (type === OrderTypeProductionOrderEnum.Output) {
      qcStageInputIds = `${STAGES_OPTION.PRO_EXPORT}, ${STAGES_OPTION.SO_EXPORT}`;
    }

    let query = this.errorReportRepository
      .createQueryBuilder('er')
      .select([
        'er.id as id',
        'er.code as code',
        'er.name as name',
        'er.status as status',
        'er.created_at as "createdAt"',
        'er.qc_stage_id as "qcStageId"',
        `CASE
          WHEN COUNT(eriod) = 0
            THEN '[]'
          ELSE JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'id', eriod.id,
              'orderId', eriod.orderId,
              'itemId', eriod.itemId
            )
          )
        END AS "errorReportIoqcDetail"`,
      ])
      .leftJoin('er.errorReportIoqcDetail', 'eriod')
      .where(`er.qc_stage_id IN (${qcStageInputIds})`);

    if (!isEmpty(keyword)) {
      if (!isEmpty(keywordOrderIds) && !isEmpty(keywordItemIds)) {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where('eriod.orderId IN (:...orderIds)', {
              orderIds: keywordOrderIds,
            })
              .orWhere('eriod.itemId IN (:...itemIds)', {
                itemIds: keywordItemIds,
              })
              .orWhere(`LOWER(er.code) LIKE LOWER(:pkeyWord) escape '\\'`, {
                pkeyWord: `%${escapeCharForSearch(keyword)}%`,
              });
          }),
        );
      } else if (!isEmpty(keywordOrderIds) && isEmpty(keywordItemIds)) {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where('eriod.orderId IN (:...orderIds)', {
              orderIds: keywordOrderIds,
            }).orWhere(`LOWER(er.code) LIKE LOWER(:pkeyWord) escape '\\'`, {
              pkeyWord: `%${escapeCharForSearch(keyword)}%`,
            });
          }),
        );
      } else if (isEmpty(keywordOrderIds) && !isEmpty(keywordItemIds)) {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where('eriod.itemId IN (:...itemIds)', {
              itemIds: keywordItemIds,
            }).orWhere(`LOWER(er.code) LIKE LOWER(:pkeyWord) escape '\\'`, {
              pkeyWord: `%${escapeCharForSearch(keyword)}%`,
            });
          }),
        );
      } else if (isEmpty(keywordOrderIds) && isEmpty(keywordItemIds)) {
        query = query.andWhere(
          `LOWER(er.code) LIKE LOWER(:pkeyWord) escape '\\'`,
          { pkeyWord: `%${escapeCharForSearch(keyword)}%` },
        );
      }
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'code':
            if (!isEmpty(filterOrderIds)) {
              query.andWhere('eriod.orderId IN (:...orderIds)', {
                orderIds: filterOrderIds,
              });
            }
            break;
          case 'createdAt':
            const createdFrom = item.text.split('|')[0];
            const createdTo = item.text.split('|')[1];
            query = query.andWhere(
              'er.createdAt between :createdFrom AND :createdTo',
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
    if(!isEmpty(filteredArrayOrderIds)){
      query.andWhere('eriod.orderId IN (:...orderIds)', {
        orderIds: filteredArrayOrderIds,
      });
    }

    query.groupBy('er.id');
    query.orderBy('er.id', 'DESC');

    const result = await query
      .offset(request.skip)
      .limit(request.take)
      .getRawMany();

    const count = await query.getCount();

    return {
      result: result,
      total: count,
    };
  }

  async getDetailErrorReportForApp(id: number) {
    const errorReportDetail = this.errorReportRepository
      .createQueryBuilder('er')
      .select([
        'er.id as id',
        'er.code as code',
        'er.name as name',
        'er.status as status',
        'er.created_at as "createdAt"',
        'er.qc_stage_id as "qcStageId"',
      ])
      .leftJoin('er.errorReportIoqcDetail', 'eriod')
      .leftJoin('eriod.errorReportErrorList', 'errl')
      .where(`er.id = ${id}`);

    return await errorReportDetail.getOne();
  }

  public async getStageListByWOForApp(workOrderId: number): Promise<any> {
    const query = this.errorReportRepository
      .createQueryBuilder('er')
      .withDeleted()
      .select([
        'er.id as "id"',
        'er.name as "name"',
        'er.code as "code"',
        'er.status as "status"',
        'ersd.workOrderId as "workOrderId"',
        'erel.priority as "priority"',
        'erel.repairDeadline as "repairDeadline"',
        'erel.errorDescription as "errorDescription"',
        'erel.assignedTo as "assignedTo"',
        `CASE WHEN COUNT(ereg) = 0 THEN '[]' ELSE JSON_AGG(
         DISTINCT JSONB_BUILD_OBJECT('id', ereg.id,'name', ereg.name, 'errorItemQuantity',
         ered.error_item_quantity,'repairItemQuantity', ered.repair_item_quantity, 'causeGroup', cg.cause_group))
         END AS "errorGroups"`,
      ])
      .innerJoin('er.errorReportStageDetail', 'ersd')
      .innerJoin('ersd.errorReportErrorList', 'erel')
      .innerJoin('erel.errorReportErrorDetails', 'ered')
      .innerJoin('ered.errorGroup', 'ereg')
      .innerJoin(
        (qb) =>
          qb
            .select([
              'cg.id as id',
              `CASE WHEN COUNT(cg) = 0 THEN '{}' ELSE JSONB_BUILD_OBJECT('id', cg.id, 'name', cg.name, 'code', cg.code) END AS "cause_group"`,
            ])
            .from('cause_groups', 'cg')
            .groupBy('cg.id'),
        'cg',
        'cg.id = ered.cause_group_id',
      )
      .groupBy('er.id')
      .addGroupBy('ersd.id')
      .addGroupBy('erel.id')
      .where('ersd.workOrderId = :workOrderId', { workOrderId: workOrderId });
    return await query.getRawMany();
  }

  public async getListErrorReportByStageIdAndOrderId(
    qcStageId: number,
    orderId: number,
  ): Promise<any> {
    return await this.errorReportRepository
      .createQueryBuilder('er')
      .leftJoinAndSelect('er.errorReportIoqcDetail', 'eriod')
      .where('er.qcStageId = :qcStageId', { qcStageId: qcStageId })
      .andWhere('eriod.orderId = :orderId', { orderId: orderId })
      .getMany();
  }

  public async getListErrorReportByStageIdAndOrderIdAndItemId(
    qcStageId: number,
    orderId: number,
    itemId: number,
  ): Promise<any> {
    return await this.errorReportRepository
      .createQueryBuilder('er')
      .leftJoinAndSelect('er.errorReportIoqcDetail', 'eriod')
      .where('er.qcStageId = :qcStageId', { qcStageId: qcStageId })
      .andWhere('eriod.orderId = :orderId', { orderId: orderId })
      .andWhere('eriod.itemId = :itemId', { itemId: itemId })
      .getMany();
  }

  public async getListErrorReportNotConfirmAndReject(
    qcStageId: number,
    orderId: number,
    warehouseId: number,
    itemId: number,
  ): Promise<any> {
    return await this.errorReportRepository
      .createQueryBuilder('er')
      .leftJoinAndSelect('er.errorReportIoqcDetail', 'eriod')
      .leftJoinAndSelect('er.transactionHistory', 'th')
      .where('er.qcStageId = :qcStageId', { qcStageId: qcStageId })
      .andWhere('eriod.orderId = :orderId', { orderId: orderId })
      .andWhere('eriod.warehouseId = :warehouseId', {
        warehouseId: warehouseId,
      })
      .andWhere('eriod.itemId = :itemId', { itemId: itemId })
      .andWhere('er.status = :status', { status: ErrorReportStatus.Awaiting })
      .getMany();
  }

  async getProduceStepsSumQcQuantityByNotConfirmedStatus(
    orderId: number,
    workCenterId: number,
    type: TransactionHistoryTypeEnum,
    itemId?: number,
  ): Promise<any> {
    const query = this.errorReportRepository
      .createQueryBuilder('e')
      .select([
        'eth.orderId as "orderId"',
        'eth.workCenterId as "workCenterId"',
        `SUM(eth.qc_quantity) AS "sumQcQuantity"`,
      ])
      .leftJoin('e.transactionHistory', 'eth')
      .where('e.status = :status', { status: ErrorReportStatus.Awaiting })
      .andWhere('eth.orderId = :orderId', { orderId: orderId })
      .andWhere('eth.workCenterId = :workCenterId', { workCenterId: workCenterId })
      .andWhere('eth.type = :type', { type: type })
      .groupBy('eth.orderId')
      .addGroupBy('eth.workCenterId');

    if (itemId) {
      query.andWhere('eth.itemId = :itemId', { itemId: itemId });
    }

    return await query.getRawOne();
  }

  public async getListErrorReportIoqcStage(
    qcStageId: number,
    orderId: number,
    itemId: number,
  ): Promise<any> {
    const query = await this.errorReportRepository
      .createQueryBuilder('er')
      .leftJoinAndSelect('er.errorReportIoqcDetail', 'eriod')
      .leftJoinAndSelect(`eriod.errorReportErrorList`, 'erel')
      .leftJoinAndSelect('erel.errorReportErrorDetails', 'ered')
      .leftJoinAndSelect('ered.errorGroup', 'eg')
      .leftJoinAndSelect('ered.causeGroup', 'cg')
      .leftJoinAndSelect('ered.actionCategory', 'ac')
      .where(`er.qc_stage_id = :qcStageId`, { qcStageId: qcStageId });

    if (orderId) {
      query.andWhere(`eriod.orderId = :orderId`, { orderId: orderId });
    }
    if (itemId) {
      query.andWhere(`eriod.itemId = :itemId`, { itemId: itemId });
    }
    return query.getMany();
  }

  public async getListErrorReportByProduceStep(
    qcStageId: number,
    moId: number,
    itemId: number,
    producingStepId: number,
  ): Promise<any> {
    const query = await this.errorReportRepository
      .createQueryBuilder('er')
      .leftJoinAndSelect('er.errorReportStageDetail', 'ersd')
      .leftJoinAndSelect(`ersd.errorReportErrorList`, 'erel')
      .leftJoinAndSelect('erel.errorReportErrorDetails', 'ered')
      .leftJoinAndSelect('ered.errorGroup', 'eg')
      .leftJoinAndSelect('ered.causeGroup', 'cg')
      .leftJoinAndSelect('ered.actionCategory', 'ac')
      .where(`er.qc_stage_id = :qcStageId`, { qcStageId: qcStageId });

    if (moId) {
      query.andWhere(`ersd.moId = :moId`, { moId: moId });
    }
    if (itemId) {
      query.andWhere(`ersd.itemId = :itemId`, { itemId: itemId });
    }
    if (producingStepId) {
      query.andWhere(`ersd.producingStepId = :producingStepId`, {
        producingStepId: producingStepId,
      });
    }
    return query.getMany();
  }

  public async getListAllErrorReport(): Promise<any> {
    return await this.errorReportRepository
      .createQueryBuilder('er')
      .leftJoinAndSelect('er.errorReportStageDetail', 'ersd')
      .leftJoinAndSelect(`ersd.errorReportErrorList`, 'erel')
      .leftJoinAndSelect('erel.errorReportErrorDetails', 'ered')
      .leftJoinAndSelect('ered.errorGroup', 'eg')
      .leftJoinAndSelect('ered.causeGroup', 'cg')
      .getMany();
  }
}
