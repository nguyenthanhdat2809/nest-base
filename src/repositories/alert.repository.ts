import { Injectable } from '@nestjs/common';
import { Repository, Brackets } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { escapeCharForSearch, handleDataRequest } from './../utils/common';
import { isEmpty } from 'lodash';
import { Alert } from '@entities/alert/alert.entity';
import { AlertRepositoryInterface } from '@components/alert/interface/alert.repository.interface';
import { ALERT_DB, ALERT_NAME_RECORD } from '@components/alert/alert.constant';
import { AlertRequestDto } from '@components/alert/dto/request/alert.request.dto';
import { AlertResponseDto } from '@components/alert/dto/response/alert.response.dto';
import { AlertRelatedUser } from '@entities/alert/alert-related-user.entity';
import { CreateAlertRequestDto } from '@components/alert/dto/request/create-alert.request.dto';
import { GetListAlertRequestDto } from '@components/alert/dto/request/get-list-alert.request.dto';
import { STAGES_OPTION } from '@constant/qc-stage.constant';

@Injectable()
export class AlertRepository
  extends BaseAbstractRepository<Alert>
  implements AlertRepositoryInterface
{
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
  ) {
    super(alertRepository);

    this.fieldMap.set(
      ALERT_DB.ID.COL_NAME.toLowerCase(),
      ALERT_DB.ID.DB_COL_NAME,
    );
    this.fieldMap.set(
      ALERT_DB.CODE.COL_NAME.toLowerCase(),
      ALERT_DB.CODE.DB_COL_NAME,
    );
  }

  public async getList(
    request: GetListAlertRequestDto,
    filterStageSearch: any,
    filterUserSearch: any
  ) {
    let { keyword, sort, filter, take, skip } = handleDataRequest(request);

    let query = this.alertRepository
      .createQueryBuilder('a')
      .select([
        'a.id AS id',
        'a.code AS code',
        'a.name AS name',
        'a.stage AS stage',
        'a.user_id AS "userId"',
        'a.status AS status',
        'a.type_alert AS "typeAlert"'
      ]);

    if (filterStageSearch.checked){
      if(!isEmpty(filterStageSearch.stageValues)){
        query = query.andWhere(`a.stage IN (${filterStageSearch.stageValues})`)
      }else{
        return {
          result: [],
          count: 0,
        };
      }
    }

    if (filterUserSearch.checked){
      if(!isEmpty(filterUserSearch.userIds)){
        query = query.andWhere(`a.user_id IN (${filterUserSearch.userIds})`)
      }else{
        return {
          result: [],
          count: 0,
        };
      }
    }

    if (!isEmpty(keyword)) {
      query = query
        .andWhere(new Brackets(qb => {
          qb.where(`LOWER("a"."name") LIKE LOWER(:pkeyWord) escape '\\'`, {
            pkeyWord: `%${escapeCharForSearch(keyword)}%`,
          })
          .orWhere(`LOWER("a"."code") LIKE LOWER(:pkeyWord) escape '\\'`, {
            pkeyWord: `%${escapeCharForSearch(keyword)}%`,
          });
        }))
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'name':
            query.andWhere(
              `LOWER("a"."name") LIKE LOWER(:name) ESCAPE '\\'`,
              {
                name: `%${escapeCharForSearch(item.text)}%`,
              },
            );
            break;
          case 'code':
            query.andWhere(
              `LOWER("a"."code") LIKE LOWER(:code) ESCAPE '\\'`,
              {
                code: `%${escapeCharForSearch(item.text)}%`,
              },
            );
            break;
          case 'status':
            query.andWhere(`"${item.column}" IN (:...${item.column})`, {
              [item.column]: item.text.split(','),
            });
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
            query = query.orderBy('"code"', item.order);
            break;
          case 'name':
            query = query.orderBy('"name"', item.order);
            break;
          case 'stage':
            query = query.orderBy('"stage"', item.order);
            break;
          case 'status':
            query = query.orderBy('"status"', item.order);
            break;
          default:
            break;
        }
      });
    } else {
      query = query.orderBy('a.id', 'DESC');
    }

    const result =  await query.getRawMany();
    const count = await query.getCount();

    return {
      result: result,
      count: count,
    };
  }

  public async getDetail(
    id: number,
    typeAlert: number
  ): Promise<any> {
    return await this.alertRepository.findOne({
      relations: [
        'alertRelatedUsers',
      ],
      where: { id: id, typeAlert: typeAlert },
    });
  }

  public createEntity(alertDto: CreateAlertRequestDto): Alert {
    const alertEntity = new Alert();
    const typeAlert = alertDto.typeAlert
    const stage = alertDto.stage

    alertEntity.code = alertDto.code.trim();
    alertEntity.name = alertDto.name.trim();
    alertEntity.description = alertDto.description?.trim();
    alertEntity.stage = stage;
    alertEntity.itemId = alertDto.itemId;
    alertEntity.typeAlert = alertDto.typeAlert;
    alertEntity.userId = alertDto.userId;

    if(typeAlert === ALERT_NAME_RECORD.OP){
      alertEntity.manufacturingOrderId = alertDto.manufacturingOrderId;
      alertEntity.routingId = alertDto.routingId;
      alertEntity.producingStepId = alertDto.producingStepId;
      alertEntity.purchasedOrderId = null;
      alertEntity.warehouseId = null;
      alertEntity.errorReportId = null;

      if(stage == STAGES_OPTION.INPUT_PRODUCTION){
        alertEntity.productType = alertDto.productType;
      }
    }

    if(typeAlert === ALERT_NAME_RECORD.INPUT || typeAlert === ALERT_NAME_RECORD.OUTPUT){
      alertEntity.manufacturingOrderId = null;
      alertEntity.routingId = null;
      alertEntity.producingStepId = null;
      alertEntity.purchasedOrderId = alertDto.purchasedOrderId;
      alertEntity.warehouseId = alertDto.warehouseId;
      alertEntity.errorReportId = alertDto.errorReportId;
    }

    return alertEntity;
  }

  public createAlertRelatedUserEntity(
    alertId: number,
    userId: number,
  ): AlertRelatedUser {
    const apertRelatedUser = new AlertRelatedUser();

    apertRelatedUser.alertId = alertId;
    apertRelatedUser.userId = userId;

    return apertRelatedUser;
  }

  public async getExistedRecord(
    id: number,
    alertDto: AlertRequestDto,
  ): Promise<Alert> {
    let entityByCodeQuery = this.alertRepository
      .createQueryBuilder('c')
    const alias = entityByCodeQuery.alias;

    entityByCodeQuery = entityByCodeQuery.where(
      `"${alias}"."${ALERT_DB.CODE.DB_COL_NAME}" LIKE :pCode escape '\\'`,
      {
        pCode: alertDto.code,
      },
    );

    if (id) {
      entityByCodeQuery = entityByCodeQuery.andWhere(
        `"${alias}"."${ALERT_DB.ID.DB_COL_NAME}" != :pId`,
        {
          pId: id,
        },
      );
    }

    return await entityByCodeQuery.getOne();
  }
}
