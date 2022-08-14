import * as bcrypt from 'bcrypt';
import { isEmpty } from 'lodash';
import { ApiError } from '@utils/api.error';
import { Repository, Connection } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { InjectRepository, InjectConnection } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { plus } from '@utils/common';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { QualityPlanBomRepositoryInterface } from '@components/quality-plan/interface/quality-plan-bom.repository.interface';
import { escapeCharForSearch, handleDataRequest } from './../utils/common';
import { QualityPlanBom } from '@entities/quality-plan/quality-plan-bom.entity';
import { ListQualityPlanBomRequestDto } from '@components/quality-plan/dto/request/list-quality-plan-bom.request.dto';

@Injectable()
export class QualityPlanBomRepository
  extends BaseAbstractRepository<QualityPlanBom>
  implements QualityPlanBomRepositoryInterface
{
  constructor(
    @InjectRepository(QualityPlanBom)
    private readonly qualityPlanBomRepository: Repository<QualityPlanBom>,

    @InjectConnection()
    private readonly connection: Connection,

    private readonly i18n: I18nService,
  ) {
    super(qualityPlanBomRepository);
  }

  public async getListQualityPlanBom(
    request: ListQualityPlanBomRequestDto,
  ):Promise<any> {
    let { keyword, sort, filter, take, skip, isGetAll } = handleDataRequest(request);
    let query = this.qualityPlanBomRepository
      .createQueryBuilder('e')
      .select([
        'e.plan_error_rate AS "planErrorRate"',
        'e.work_order_id AS "workOrderId"',
        `CASE WHEN COUNT(u) = 0 THEN '[]' ELSE JSON_AGG(
         DISTINCT JSONB_BUILD_OBJECT('userId', u.userId))
         END AS "qualityPlanBomQualityPointUsers"`,
      ])
      .leftJoin('e.qualityPlanBomQualityPointUsers', 'u');

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'workOrderId':
            const arrayId = item.text.split(',').filter(Number);
            !isEmpty(arrayId)
              ? query.andWhere(`e.work_order_id IN (:...${item.column})`, {
                  [item.column]: arrayId,
                })
              : null;
            break;
          default:
            break;
        }
      });
    }

    query = query.orderBy('e.id', 'DESC');

    query.groupBy('e.id');

    const result = parseInt(isGetAll)
      ? await query.getRawMany()
      : await query.offset(skip).limit(take).getRawMany();

    const total = await query.getCount();

    return {
      result: result,
      count: total,
    };
  }

  public async findQualityPlanBomByUserAndWo(
    userId: number,
    workOrderId: number,
  ): Promise<any> {
    return await this.qualityPlanBomRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.qualityPlanBomQualityPointUsers', 'u')
      .where('u.userId = :userId', { userId: userId })
      .andWhere('p.workOrderId = :workOrderId', { workOrderId: workOrderId })
      .distinct()
      .getOne();
  }
}
