import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { ErrorGroup } from '@entities/error-group/error-group.entity';
import { ErrorGroupRepositoryInterface } from '@components/error-group/interface/error-group.repository.interface';
import { ErrorGroupRequestDto } from '@components/error-group/dto/request/error-group.request.dto';
import { GetListErrorGroupRequestDto } from '@components/error-group/dto/request/get-list-error-group.request.dto';
import { escapeCharForSearch } from '@utils/common';
import { ERROR_GROUP_CONST } from '@components/error-group/error-group.constant';

@Injectable()
export class ErrorGroupRepository
  extends BaseAbstractRepository<ErrorGroup>
  implements ErrorGroupRepositoryInterface
{
  constructor(
    @InjectRepository(ErrorGroup)
    private readonly errorGroupRepository: Repository<ErrorGroup>,
  ) {
    super(errorGroupRepository);

    this.fieldMap.set(
      ERROR_GROUP_CONST.ID.COL_NAME.toLowerCase(),
      ERROR_GROUP_CONST.ID.DB_COL_NAME,
    );
    this.fieldMap.set(
      ERROR_GROUP_CONST.CODE.COL_NAME.toLowerCase(),
      ERROR_GROUP_CONST.CODE.DB_COL_NAME,
    );
    this.fieldMap.set(
      ERROR_GROUP_CONST.DESCRIPTION.COL_NAME.toLowerCase(),
      ERROR_GROUP_CONST.DESCRIPTION.DB_COL_NAME,
    );
  }

  public createEntity(errorGroupDto: ErrorGroupRequestDto): ErrorGroup {
    const errorGroupEntity = new ErrorGroup();

    errorGroupEntity.code = errorGroupDto.code.trim();
    errorGroupEntity.name = errorGroupDto.name.trim();
    errorGroupEntity.description = errorGroupDto.description?.trim();
    errorGroupEntity.createdBy = errorGroupDto.userId;
    return errorGroupEntity;
  }

  public async getList(request: GetListErrorGroupRequestDto) {
    const { isExport, skip, take } = request;
    let query = this.errorGroupRepository.createQueryBuilder('e');
    const alias = query.alias;
    const keyword = request.keyword?.trim();

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
    errorGroupDto: ErrorGroupRequestDto,
  ): Promise<[ErrorGroup, ErrorGroup]> {
    let entityByCodeQuery = this.errorGroupRepository
      .createQueryBuilder('c')
      .withDeleted();
    let entityByNameQuery = this.errorGroupRepository
      .createQueryBuilder('c')
      .withDeleted();
    const alias = entityByCodeQuery.alias;

    entityByCodeQuery = entityByCodeQuery.where(
      `"${alias}"."${ERROR_GROUP_CONST.CODE.DB_COL_NAME}" LIKE :pCode escape '\\'`,
      {
        pCode: errorGroupDto.code.trim(),
      },
    );

    entityByNameQuery = entityByNameQuery.where(
      `"${alias}"."${ERROR_GROUP_CONST.NAME.DB_COL_NAME}" LIKE :pName escape '\\'`,
      {
        pName: errorGroupDto.name.trim(),
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

  public async findOneByCode(code: string): Promise<ErrorGroup> {
    const query = this.errorGroupRepository
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
  public async getListByTransactionHistoryId(
    transactionHistoryId: number,
  ): Promise<any> {
    const query = this.errorGroupRepository
      .createQueryBuilder('eg')
      .select([
        'eg.id as "id"',
        'eg.code as "code"',
        'eg.name as "name"',
        'egtd.qcRejectQuantity as "qcRejectQuantity"',
      ])
      .innerJoin('eg.checkListDetails', 'egd')
      .innerJoin('egd.transactionHistoryCheckListDetails', 'egtd')
      .where('egtd.transactionHistoryId = :tId', {
        tId: transactionHistoryId,
      })
      .andWhere('egtd.qcRejectQuantity > 0')
      .groupBy('eg.id')
      .addGroupBy('egtd.qc_reject_quantity');
    return await query.getRawMany();
  }
  async getErrorGroupByIds(ids: number[]): Promise<any> {
    return await this.errorGroupRepository
      .createQueryBuilder('eg')
      .andWhere(`eg.id IN (${ids})`)
      .getMany();
  }
}
