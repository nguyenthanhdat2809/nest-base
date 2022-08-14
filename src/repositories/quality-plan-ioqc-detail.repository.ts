import * as bcrypt from 'bcrypt';
import { isEmpty } from 'lodash';
import { ApiError } from '@utils/api.error';
import { Repository, Connection } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { InjectRepository, InjectConnection } from '@nestjs/typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { plus } from '@utils/common';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { escapeCharForSearch, handleDataRequest } from './../utils/common';
import { QualityPlanIOqcDetail } from '@entities/quality-plan/quality-plan-ioqc-detail.entity';
import { QualityPlanIOqcDetailRepositoryInterface } from '@components/quality-plan/interface/quality-plan-ioqc-detail.repository.interface';
import { UpdateQualityPlanOrderRequestDto } from '@components/quality-plan/dto/request/update-quality-plan-ioqc.request.dto';
import { UpdateQualityPlanIOqcDetailRequestDto } from '@components/quality-plan/dto/request/quality-plan-ioqc.request.dto';
import { QualityPlanRepositoryInterface } from '@components/quality-plan/interface/quality-plan.repository.interface';
import { QCPlanStatus } from '@entities/quality-plan/quality-plan.entity';

@Injectable()
export class QualityPlanIOqcDetailRepository
  extends BaseAbstractRepository<QualityPlanIOqcDetail>
  implements QualityPlanIOqcDetailRepositoryInterface
{
  constructor(
    @InjectRepository(QualityPlanIOqcDetail)
    private readonly qualityPlanIOqcDetailRepository: Repository<QualityPlanIOqcDetail>,

    @Inject('QualityPlanRepositoryInterface')
    private readonly qualityPlanRepository: QualityPlanRepositoryInterface,

    @InjectConnection()
    private readonly connection: Connection,

    private readonly i18n: I18nService,
  ) {
    super(qualityPlanIOqcDetailRepository);
  }

  public async updateQualityPlanIDqcDetailAfterConfirm(
    request: UpdateQualityPlanOrderRequestDto,
  ) {
    const qualityPlan = await this.qualityPlanRepository.findOneById(request?.id);
    const queryRunner = await this.connection.createQueryRunner();
    const manager = queryRunner.manager;

    try {
      await queryRunner.startTransaction();

      if(qualityPlan?.status == QCPlanStatus?.Confirmed){
        qualityPlan.status = QCPlanStatus?.InProgress;
        await manager.save(qualityPlan);
      }

      const qualityPlanIOqcs = request?.qualityPlanIOqcs;
      for(let i = 0; i< qualityPlanIOqcs.length; i++){
        const qualityPlanIOqc = qualityPlanIOqcs[i];
        const qualityPlanIOqcDetails =
          qualityPlanIOqc?.qualityPlanIOqcDetails as UpdateQualityPlanIOqcDetailRequestDto[];

        for(let i = 0; i < qualityPlanIOqcDetails?.length; i++){
          const qualityPlanIOqcDetail = qualityPlanIOqcDetails[i];
          const id = qualityPlanIOqcDetail?.id;

          if(!id){
            throw new ApiError(
              ResponseCodeEnum.BAD_REQUEST,
              await this.i18n.translate('error.QUALITY_PLAN_NOT_FOUND'),
            );
          }

          const qcDoneQuantity = qualityPlanIOqcDetail?.qcDoneQuantity
            ? Number(qualityPlanIOqcDetail.qcDoneQuantity)
            : 0;
          const qcPassQuantity = qualityPlanIOqcDetail?.qcPassQuantity
            ? Number(qualityPlanIOqcDetail.qcPassQuantity)
            : 0;
          const qcRejectQuantity = (qcDoneQuantity - qcPassQuantity) < 0
            ? 0
            : (qcDoneQuantity - qcPassQuantity);

          const qualityPlanIOqcDetailUpdate = await this.qualityPlanIOqcDetailRepository.findOne(id);

          qualityPlanIOqcDetailUpdate.qcDoneQuantity = qcDoneQuantity;
          qualityPlanIOqcDetailUpdate.qcPassQuantity = qcPassQuantity;
          qualityPlanIOqcDetailUpdate.qcRejectQuantity = qcRejectQuantity;

          await manager.save(qualityPlanIOqcDetailUpdate);
        }
      }

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
}
