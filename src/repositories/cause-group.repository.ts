import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { CauseGroup } from '@entities/cause-group/cause-group.entity';
import { CauseGroupRepositoryInterface } from '@components/cause-group/interface/cause-group.repository.interface';
import { CauseGroupRequestDto } from '@components/cause-group/dto/request/cause-group.request.dto';
import { GetListCauseGroupRequestDto } from '@components/cause-group/dto/request/get-list-cause-group.request.dto';
import { escapeCharForSearch } from '@utils/common';
import { CAUSE_GROUP_CONST } from '@components/cause-group/cause-group.constant';

@Injectable()
export class CauseGroupRepository
  extends BaseAbstractRepository<CauseGroup>
  implements CauseGroupRepositoryInterface
{
  constructor(
    @InjectRepository(CauseGroup)
    private readonly causeGroupRepository: Repository<CauseGroup>,
  ) {
    super(causeGroupRepository);
  }

  public createEntity(causeGroupDto: CauseGroupRequestDto): CauseGroup {
    const causeGroupEntity = new CauseGroup();

    causeGroupEntity.code = causeGroupDto.code.trim();
    causeGroupEntity.name = causeGroupDto.name.trim();
    causeGroupEntity.description = causeGroupDto.description.trim();
    causeGroupEntity.createdBy = causeGroupDto.userId;
    return causeGroupEntity;
  }

  public async getList(request: GetListCauseGroupRequestDto) {
    const { isExport, skip, take } = request;
    let query = this.causeGroupRepository.createQueryBuilder('c');
    const alias = query.alias;
    const keyword = request.keyword?.trim();

    if (keyword) {
      query = query
        .orWhere(
          `(LOWER("${alias}"."${CAUSE_GROUP_CONST.CODE.DB_COL_NAME}") LIKE LOWER(:pkeyWord) escape '\\'`,
          {
            pkeyWord: `%${escapeCharForSearch(keyword)}%`,
          },
        )
        .orWhere(
          `LOWER("${alias}"."${CAUSE_GROUP_CONST.NAME.DB_COL_NAME}") LIKE LOWER(:pkeyWord) escape '\\')`,
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

  public async getExistedRecord(
    id: number,
    causeGroupDto: CauseGroupRequestDto,
  ): Promise<[CauseGroup, CauseGroup]> {
    let entityByCodeQuery = this.causeGroupRepository
      .createQueryBuilder('c')
      .withDeleted();
    let entityByNameQuery = this.causeGroupRepository
      .createQueryBuilder('c')
      .withDeleted();
    const alias = entityByCodeQuery.alias;

    entityByCodeQuery = entityByCodeQuery.where(
      `"${alias}"."${CAUSE_GROUP_CONST.CODE.DB_COL_NAME}" LIKE :pCode escape '\\'`,
      {
        pCode: causeGroupDto.code,
      },
    );

    entityByNameQuery = entityByNameQuery.where(
      `"${alias}"."${CAUSE_GROUP_CONST.NAME.DB_COL_NAME}" LIKE :pName escape '\\'`,
      {
        pName: causeGroupDto.name,
      },
    );

    if (id) {
      entityByCodeQuery = entityByCodeQuery.andWhere(
        `"${alias}"."${CAUSE_GROUP_CONST.ID.DB_COL_NAME}" != :pId`,
        {
          pId: id,
        },
      );

      entityByNameQuery = entityByNameQuery.andWhere(
        `"${alias}"."${CAUSE_GROUP_CONST.ID.DB_COL_NAME}" != :pId`,
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

  public async getListForErrorReport(): Promise<any> {
    const query = this.causeGroupRepository
      .createQueryBuilder('c')
      .select(['c.id as "id"', 'c.name as "name"'])
      .orderBy('c.createdAt', 'DESC');
    return await query.getRawMany();
  }

  async getCauseGroupByIds(ids: number[]): Promise<any> {
    return await this.causeGroupRepository
      .createQueryBuilder('cg')
      .andWhere(`cg.id IN (${ids})`)
      .getMany();
  }
}
