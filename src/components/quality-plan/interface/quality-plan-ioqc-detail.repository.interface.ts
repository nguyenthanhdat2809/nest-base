import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { QualityPlanIOqcDetail } from '@entities/quality-plan/quality-plan-ioqc-detail.entity';
import { UpdateQualityPlanOrderRequestDto } from '@components/quality-plan/dto/request/update-quality-plan-ioqc.request.dto';

export interface QualityPlanIOqcDetailRepositoryInterface extends BaseInterfaceRepository<QualityPlanIOqcDetail> {
  updateQualityPlanIDqcDetailAfterConfirm(request: UpdateQualityPlanOrderRequestDto)
}
