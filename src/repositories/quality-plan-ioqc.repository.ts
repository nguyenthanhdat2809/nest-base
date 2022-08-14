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
import { QualityPlanIOqcRepositoryInterface } from '@components/quality-plan/interface/quality-plan-ioqc.repository.interface';
import { escapeCharForSearch, handleDataRequest } from './../utils/common';
import { QualityPlanIOqc } from '@entities/quality-plan/quality-plan-ioqc.entity';
import { UpdateQualityPlanIOqcByConfirmErrorReportRequestDto } from '@components/quality-plan/dto/request/update-quality-plan-ioqc.request.dto';

@Injectable()
export class QualityPlanIOqcRepository
  extends BaseAbstractRepository<QualityPlanIOqc>
  implements QualityPlanIOqcRepositoryInterface
{
  constructor(
    @InjectRepository(QualityPlanIOqc)
    private readonly qualityPlanIOqcRepository: Repository<QualityPlanIOqc>,

    @InjectConnection()
    private readonly connection: Connection,

    private readonly i18n: I18nService,
  ) {
    super(qualityPlanIOqcRepository);
  }

  public async updateQualityPlanIOqc(
    request: UpdateQualityPlanIOqcByConfirmErrorReportRequestDto
  ){
    const {
      type,
      orderId,
      warehouseId,
      itemId,
      qcPassQuantity,
      qcRejectQuantity,
    } = request;

    const qualityPlanIOqc = await this.qualityPlanIOqcRepository
      .createQueryBuilder('qpio')
      .leftJoinAndSelect('qpio.qualityPlan', 'qp')
      .where('qp.qcStageId = :qcStageId', { qcStageId: type })
      .andWhere('qpio.orderId = :orderId', { orderId: orderId })
      .andWhere('qpio.warehouseId = :warehouseId', { warehouseId: warehouseId })
      .andWhere('qpio.itemId = :itemId', { itemId: itemId })
      .getOne();

    if (!qualityPlanIOqc){
      throw new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.QUALITY_PLAN_NOT_FOUND'),
      );
    }

    const { qualityPlan } = qualityPlanIOqc;
    if (!qualityPlan) {
      throw new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.QUALITY_PLAN_NOT_FOUND'),
      );
    }

    if (qcPassQuantity < 0 || qcRejectQuantity < 0) {
      throw new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.QUANTITY_INVALID'),
      );
    }

    if (
      plus(qcPassQuantity, qcRejectQuantity) >
      qualityPlanIOqc.planQuantity
    ) {
      throw new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.QUANTITY_INVALID'),
      );
    }

    qualityPlanIOqc.qcPassQuantity = plus(
      +qualityPlanIOqc.qcPassQuantity,
      qcPassQuantity,
    );
    qualityPlanIOqc.qcRejectQuantity = plus(
      +qualityPlanIOqc.qcRejectQuantity,
      qcRejectQuantity,
    );
    qualityPlanIOqc.errorQuantity = plus(
      +qualityPlanIOqc.errorQuantity,
      qcRejectQuantity,
    );

    return qualityPlanIOqc;
  }

  public async findQualityPlanIOqcByQc(
    qcStageId: number,
    orderId: number,
    warehouseId: number,
    itemId: number,
  ):Promise<any>{
    const qualityPlanIOqc = await this.qualityPlanIOqcRepository
      .createQueryBuilder('qpio')
      .leftJoinAndSelect('qpio.qualityPlan', 'qp')
      .leftJoinAndSelect('qpio.qualityPlanIOqcDetails', 'qpds')
      .leftJoinAndSelect('qpds.qualityPlanIOqcQualityPointUsers', 'user')
      .where('qp.qcStageId = :qcStageId', { qcStageId: qcStageId })
      .andWhere('qpio.orderId = :orderId', { orderId: orderId })
      .andWhere('qpio.warehouseId = :warehouseId', { warehouseId: warehouseId })
      .andWhere('qpio.itemId = :itemId', { itemId: itemId })
      .getOne();

    if (!qualityPlanIOqc){
      return
    }

    return qualityPlanIOqc;
  }
}
