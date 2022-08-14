import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { escapeCharForSearch } from '@utils/common';
import { ActionCategory } from '@entities/action-category/action-category.entity';
import { ActionCategoryRepositoryInterface } from '@components/action-category/interface/action-category.repository.interface';
import { ActionCategoryRequestDto } from '@components/action-category/dto/request/action-category.request.dto';
import { ACTION_CATEGORY_CONST } from '@components/action-category/action-category.constant';
import { GetListActionCategoryRequestDto } from '@components/action-category/dto/request/get-list-action-category.request.dto';
import { ErrorGroup } from '@entities/error-group/error-group.entity';
import { ERROR_GROUP_CONST } from '@components/error-group/error-group.constant';

@Injectable()
export class ActionCategoryRepository
  extends BaseAbstractRepository<ActionCategory>
  implements ActionCategoryRepositoryInterface
{
  constructor(
    @InjectRepository(ActionCategory)
    private readonly actionCategoryRepository: Repository<ActionCategory>,
  ) {
    super(actionCategoryRepository);

    this.fieldMap.set(
      ACTION_CATEGORY_CONST.ID.COL_NAME.toLowerCase(),
      ACTION_CATEGORY_CONST.ID.DB_COL_NAME,
    );
    this.fieldMap.set(
      ACTION_CATEGORY_CONST.CODE.COL_NAME.toLowerCase(),
      ACTION_CATEGORY_CONST.CODE.DB_COL_NAME,
    );
    this.fieldMap.set(
      ACTION_CATEGORY_CONST.DESCRIPTION.COL_NAME.toLowerCase(),
      ACTION_CATEGORY_CONST.DESCRIPTION.DB_COL_NAME,
    );
  }

  public async getList(request: GetListActionCategoryRequestDto) {
    const { isExport, skip, take } = request;
    let query = this.actionCategoryRepository.createQueryBuilder('c');
    const alias = query.alias;
    const keyword = request.keyword?.trim();

    if (request.keyword) {
      query = query
        .orWhere(
          `(LOWER("${alias}"."${ACTION_CATEGORY_CONST.CODE.DB_COL_NAME}") LIKE LOWER(:pkeyWord) escape '\\'`,
          {
            pkeyWord: `%${escapeCharForSearch(keyword)}%`,
          },
        )
        .orWhere(
          `LOWER("${alias}"."${ACTION_CATEGORY_CONST.NAME.DB_COL_NAME}") LIKE LOWER(:pkeyWord) escape '\\')`,
          {
            pkeyWord: `%${escapeCharForSearch(keyword)}%`,
          },
        );
    }

    query = await request.buildSearchFilterQuery(query, this.fieldMap);

    const [result, total] = isExport
      ? await query.getManyAndCount()
      : await query.offset(skip).limit(take).getManyAndCount();

    return {
      result: result,
      count: total,
    };
  }

  public createEntity(
    actionCategoryDto: ActionCategoryRequestDto,
  ): ActionCategory {
    const actionCategoryEntity = new ActionCategory();

    actionCategoryEntity.code = actionCategoryDto.code.trim();
    actionCategoryEntity.name = actionCategoryDto.name.trim();
    actionCategoryEntity.description = actionCategoryDto.description.trim();
    actionCategoryEntity.createdBy = actionCategoryDto.userId;
    return actionCategoryEntity;
  }

  public async getExistedRecord(
    id: number,
    actionCategoryDto: ActionCategoryRequestDto,
  ): Promise<[ActionCategory, ActionCategory]> {
    let entityByCodeQuery = this.actionCategoryRepository
      .createQueryBuilder('c')
      .withDeleted();
    let entityByNameQuery = this.actionCategoryRepository
      .createQueryBuilder('c')
      .withDeleted();
    const alias = entityByCodeQuery.alias;

    entityByCodeQuery = entityByCodeQuery.where(
      `"${alias}"."${ACTION_CATEGORY_CONST.CODE.DB_COL_NAME}" LIKE :pCode escape '\\'`,
      {
        pCode: actionCategoryDto.code,
      },
    );

    entityByNameQuery = entityByNameQuery.where(
      `"${alias}"."${ACTION_CATEGORY_CONST.NAME.DB_COL_NAME}" LIKE :pName escape '\\'`,
      {
        pName: actionCategoryDto.name,
      },
    );

    if (id) {
      entityByCodeQuery = entityByCodeQuery.andWhere(
        `"${alias}"."${ACTION_CATEGORY_CONST.ID.DB_COL_NAME}" != :pId`,
        {
          pId: id,
        },
      );

      entityByNameQuery = entityByNameQuery.andWhere(
        `"${alias}"."${ACTION_CATEGORY_CONST.ID.DB_COL_NAME}" != :pId`,
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

  public async getListAll() {
    const query = this.actionCategoryRepository
      .createQueryBuilder('c')
      .orderBy('id', 'DESC');
    return await query.getMany();
  }

  async getActionCategoryByIds(ids: number[]): Promise<any> {
    return await this.actionCategoryRepository
      .createQueryBuilder('c')
      .andWhere(`c.id IN (${ids})`)
      .getMany();
  }

  public async findOneByCode(code: string): Promise<ActionCategory> {
    const query = this.actionCategoryRepository
      .createQueryBuilder('e')
      .withDeleted();

    return await query
      .where(
        `"${query.alias}"."${ACTION_CATEGORY_CONST.CODE.DB_COL_NAME}" LIKE :pCode escape '\\'`,
        {
          pCode: code.trim(),
        },
      )
      .getOne();
  }
}
