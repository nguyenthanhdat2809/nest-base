import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { QualityPointRepositoryInterface } from '@components/quality-point/interface/quality-point.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Brackets } from 'typeorm';
import { escapeCharForSearch, handleDataRequest } from './../utils/common';
import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import * as bcrypt from 'bcrypt';
import { QualityPoint } from '@entities/quality-point/quality-point.entity';
import { GetListQualityPointRequestDto } from '@components/quality-point/dto/request/get-list-quality-point.request.dto';
import { QualityPointRequestDto } from '@components/quality-point/dto/request/quality-point.request.dto';
import { QualityPointUser1 } from '@entities/quality-point-user/quality-point-user1.entity';
import { QualityPointUser2 } from '@entities/quality-point-user/quality-point-user2.entity';
import { CheckListDetail } from '@entities/check-list/check-list-detail.entity';

@Injectable()
export class QualityPointRepository
  extends BaseAbstractRepository<QualityPoint>
  implements QualityPointRepositoryInterface
{
  constructor(
    @InjectRepository(QualityPoint)
    private readonly qualityPointsRepository: Repository<QualityPoint>,
  ) {
    super(qualityPointsRepository);
  }

  /**
   * Get quality point List
   * @param request
   * @returns
   */

  public async getListQualityPoint(
    request: GetListQualityPointRequestDto,
    filterStageSearch: any,
    filterUserSearch: any,
  ) {
    const { keyword, sort, filter, take, skip, isGetAll } =
      handleDataRequest(request);

    let query = this.qualityPointsRepository
      .createQueryBuilder('c')
      .select([
        'c.id AS id',
        'c.name AS name',
        'c.code AS code',
        'c.status AS status',
        'c.stage AS stage',
        'c.item_id AS "itemId"',
        'c.formality AS "formality"',
        'c.number_of_time AS "numberOfTime"',
        'c.quantity AS "quantity"',
        'c.error_acceptance_rate AS "errorAcceptanceRate"',
        `CASE WHEN COUNT(u_sub) = 0 THEN '{}' ELSE JSON_AGG(DISTINCT u_sub.quality_point_user1)
         END AS "qualityPointUser1s"`,
      ])
      .innerJoin('c.qualityPointUser1s', 'u')
      .innerJoin(
        (qb) =>
          qb
            .select([
              'u_sub.id as id',
              'u_sub.quality_point_id as quality_point_id',
              `CASE WHEN COUNT(u_sub) = 0 THEN '{}' ELSE
                JSONB_BUILD_OBJECT('id', u_sub.id, 'userId', u_sub.userId, 'qualityPointId', u_sub.qualityPointId)
              END AS "quality_point_user1"`,
            ])
            .from('quality_point_user1s', 'u_sub')
            .groupBy('u_sub.id'),
        'u_sub',
        'u_sub.quality_point_id = c.id',
      );

    if (filterStageSearch.checked) {
      if (!isEmpty(filterStageSearch.stageValues)) {
        query = query.andWhere(`c.stage IN (${filterStageSearch.stageValues})`);
      } else {
        return {
          result: [],
          count: 0,
        };
      }
    }

    if (filterUserSearch.checked) {
      if (!isEmpty(filterUserSearch.userIds)) {
        query = query.andWhere(`u.user_id IN (${filterUserSearch.userIds})`);
      } else {
        return {
          result: [],
          count: 0,
        };
      }
    }

    if (!isEmpty(keyword)) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where(`LOWER("c"."name") LIKE LOWER(:pkeyWord) escape '\\'`, {
            pkeyWord: `%${escapeCharForSearch(keyword)}%`,
          }).orWhere(`LOWER("c"."code") LIKE LOWER(:pkeyWord) escape '\\'`, {
            pkeyWord: `%${escapeCharForSearch(keyword)}%`,
          });
        }),
      );
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'name':
            query.andWhere(`LOWER("c"."name") LIKE LOWER(:name) ESCAPE '\\'`, {
              name: `%${escapeCharForSearch(item.text)}%`,
            });
            break;
          case 'code':
            query.andWhere(`LOWER("c"."code") LIKE LOWER(:code) ESCAPE '\\'`, {
              code: `%${escapeCharForSearch(item.text)}%`,
            });
            break;
          case 'status':
            query.andWhere(`"${item.column}" IN (:...${item.column})`, {
              [item.column]: item.text.split(','),
            });
            break;
          case 'itemId':
            query.andWhere(`c.item_id IN (:...${item.column})`, {
              [item.column]: item.text.split(','),
            });
            break;
          case 'stageId':
            query.andWhere(`c.stage IN (:...${item.column})`, {
              [item.column]: item.text.split(','),
            });
            break;
          case 'id':
            const ids = item.text.slice(1, -1);
            if (ids.length < 1) break;
            query.andWhere(`c.id IN (${ids})`);
            break;
          case 'codes':
            const codeFilters = item.text.split(',');
            if (codeFilters.length < 1) break;
            query.andWhere(`c.code IN (:...codes)`, {
              codes: codeFilters
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
          case 'status':
            query = query.orderBy('"status"', item.order);
            break;
          default:
            break;
        }
      });
    } else {
      query = query.orderBy('c.id', 'DESC');
    }

    query.groupBy('c.id');

    const result = await query.getRawMany();
    const count = await query.getCount();

    return {
      result: result,
      count: count,
    };
  }

  public createEntity(qualityDto: QualityPointRequestDto): QualityPoint {
    const qualityEntity = new QualityPoint();

    qualityEntity.code = qualityDto.code;
    qualityEntity.name = qualityDto.name;
    qualityEntity.stage = qualityDto.stage;
    qualityEntity.formality = qualityDto.formality;
    qualityEntity.checkListId = qualityDto.checkListId;
    qualityEntity.numberOfTime = qualityDto.numberOfTime;
    qualityEntity.description = qualityDto.description;
    qualityEntity.createdBy = qualityDto.userId;

    return qualityEntity;
  }

  public createQualityPointUser1Entity(
    qualityPointId: number,
    userId: number,
  ): QualityPointUser1 {
    const qualityPointUser1 = new QualityPointUser1();

    qualityPointUser1.userId = userId;
    qualityPointUser1.qualityPointId = qualityPointId;

    return qualityPointUser1;
  }

  public createQualityPointUser2Entity(
    qualityPointId: number,
    userId: number,
  ): QualityPointUser2 {
    const qualityPointUser2 = new QualityPointUser2();

    qualityPointUser2.userId = userId;
    qualityPointUser2.qualityPointId = qualityPointId;

    return qualityPointUser2;
  }

  public async getDetail(id: number): Promise<any> {
    return await this.qualityPointsRepository.findOne({
      relations: ['qualityPointUser1s', 'qualityPointUser2s'],
      where: { id: id },
    });
  }

  public async getCheckListDetailsByQualityPoint(
    qualityPointId: number,
  ): Promise<any> {
    const query = this.qualityPointsRepository
      .createQueryBuilder('qp')
      .select([
        'qcd.id as "id"',
        'qcd.title as "title"',
        `CASE WHEN COUNT(qeg) = 0 THEN '{}' ELSE JSONB_BUILD_OBJECT( 'id', qeg.id,'name', qeg.name) END AS "errorGroup"`,
      ])
      .innerJoin('qp.checkList', 'qcl')
      .innerJoin('qcl.checkListDetails', 'qcd')
      .innerJoin('qcd.errorGroup', 'qeg')
      .groupBy('qcd.id')
      .addGroupBy('qp.id')
      .addGroupBy('qeg.id')
      .where(`qp.id = :pId`, { pId: qualityPointId });
    return await query.getRawMany();
  }

  public async getCheckListDetailsByQualityPointList(
    materialCriteriaIdList: number[],
  ): Promise<any> {
    const query = this.qualityPointsRepository
      .createQueryBuilder('qp')
      .select([
        'qp.id as "criteriaId"',
        'qcd.id as "id"',
        'qcd.title as "title"',
        `CASE WHEN COUNT(qeg) = 0 THEN '{}' ELSE JSONB_BUILD_OBJECT( 'id', qeg.id,'name', qeg.name) END AS "errorGroup"`,
      ])
      .innerJoin('qp.checkList', 'qcl')
      .innerJoin('qcl.checkListDetails', 'qcd')
      .innerJoin('qcd.errorGroup', 'qeg')
      .groupBy('qcd.id')
      .addGroupBy('qp.id')
      .addGroupBy('qeg.id')
      .where(`qp.id IN (:...criteriaIds)`, {
        criteriaIds: materialCriteriaIdList,
      });
    return await query.getRawMany();
  }

  public async getListByIds(qualityPointIds: number[]): Promise<any> {
    const qualityPoints = await this.qualityPointsRepository.findByIds(
      qualityPointIds,
    );
    if (!isEmpty(qualityPoints)) {
      return qualityPoints.map((item) => {
        return {
          id: item.id,
          formality: item.formality,
          quantity: item.quantity,
        };
      });
    }
    return [];
  }
}
