import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Brackets } from 'typeorm';
import { escapeCharForSearch, handleDataRequest } from './../utils/common';
import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import * as bcrypt from 'bcrypt';
import { CheckList } from '@entities/check-list/check-list.entity';
import { CheckListRepositoryInterface } from '@components/check-list/interface/check-list.repository.interface';
import { CheckListRequestDto } from '@components/check-list/dto/request/check-list.request.dto';
import { CheckListAllRequestDto } from '@components/check-list/dto/request/check-list-all.request.dto';

@Injectable()
export class CheckListRepository
  extends BaseAbstractRepository<CheckList>
  implements CheckListRepositoryInterface
{
  constructor(
    @InjectRepository(CheckList)
    private readonly checkListsRepository: Repository<CheckList>,
  ) {
    super(checkListsRepository);
  }

  public createEntity(checkListDto: CheckListRequestDto): CheckList {
    const checkListEntity = new CheckList();
    checkListEntity.name = checkListDto.name;
    checkListEntity.code = checkListDto.code;
    checkListEntity.description = checkListDto.description;
    checkListEntity.createdBy = checkListDto.userId;
    return checkListEntity;
  }

  public async getDetail(id: number): Promise<any> {
    return await this.checkListsRepository.createQueryBuilder('cl')
      .select([
        'cl.id as "id"',
        'cl.code as "code"',
        'cl.name as "name"',
        'cl.description as "description"',
        'cl.status as "status"',
        `CASE
          WHEN COUNT(cld) = 0 THEN '{}' ELSE JSON_AGG(DISTINCT cld.data_cld)
          END AS "checkListDetails"`,
      ])
      .leftJoin(
        (db) =>
          db
            .select([
              'cld.id as id',
              'cld.check_list_id as check_list_id',
              'cld.error_group_id as error_group_id',
              `CASE WHEN COUNT(cld) = 0 THEN '{}' ELSE
                JSONB_BUILD_OBJECT(
                  'id', cld.id,
                  'title', cld.title,
                  'descriptionContent', cld.descriptionContent,
                  'checkType', cld.checkType,
                  'norm', cld.norm,
                  'itemUnitId', cld.itemUnitId,
                  'valueBottom', cld.valueBottom,
                  'valueTop', cld.valueTop,
                  'errorGroup', eg.data_eg
                )
              END AS "data_cld"`,
            ])
            .from('check_list_details', 'cld')
            .leftJoin(
              (db) =>
                db
                  .select([
                    'eg.id as id',
                    `CASE WHEN COUNT(eg) = 0 THEN '{}' ELSE
                      JSONB_BUILD_OBJECT(
                        'id', eg.id,
                        'name', eg.name,
                        'code', eg.code
                      )
                    END AS "data_eg"`,
                  ])
                  .from('error_groups', 'eg')
                  .groupBy('eg.id'),
              'eg',
              'eg.id = cld.error_group_id',
            )
            .groupBy('cld.id')
            .addGroupBy('eg.data_eg'),
        'cld',
        'cld.check_list_id = cl.id',
      )
      .where('cl.id = :id', { id: id })
      .groupBy('cl.id')
      .getRawOne();
  }

  public async getList(request: CheckListAllRequestDto) {
    const { isExport } = request;
    let { keyword, sort, filter, take, skip } = handleDataRequest(request);

    let query = this.checkListsRepository.createQueryBuilder('c');

    if (!isEmpty(keyword)) {
      query = query
        .andWhere(new Brackets(qb => {
          qb.where(`LOWER("c"."name") LIKE LOWER(:pkeyWord) escape '\\'`, {
            pkeyWord: `%${escapeCharForSearch(keyword)}%`,
          })
          .orWhere(`LOWER("c"."code") LIKE LOWER(:pkeyWord) escape '\\'`, {
            pkeyWord: `%${escapeCharForSearch(keyword)}%`,
          });
        }))
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'name':
            query.andWhere(
              `LOWER("c"."name") LIKE LOWER(:name) ESCAPE '\\'`,
              {
                name: `%${escapeCharForSearch(item.text)}%`,
              },
            );
            break;
          case 'code':
            query.andWhere(
              `LOWER("c"."code") LIKE LOWER(:code) ESCAPE '\\'`,
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
          case 'description':
            query.andWhere(
              `LOWER("c"."description") LIKE LOWER(:description) ESCAPE '\\'`,
              {
                description: `%${escapeCharForSearch(item.text)}%`,
              },
            );
            break;
          default:
            break;
        }
      });
    }

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        query = query.addOrderBy(item.column, item.order);
      });
    } else {
      query = query.orderBy('c.id', 'DESC');
    }

    const [result, total] = isExport
      ? await query.getManyAndCount()
      : await query.offset(skip).limit(take).getManyAndCount();

    return {
      result: result,
      count: total,
    };
  }
}
