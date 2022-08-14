import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { QualityPlanIOqc } from '@entities/quality-plan/quality-plan-ioqc.entity';
import { UpdateQualityPlanIOqcByConfirmErrorReportRequestDto } from '@components/quality-plan/dto/request/update-quality-plan-ioqc.request.dto';

export interface QualityPlanIOqcRepositoryInterface
  extends BaseInterfaceRepository<QualityPlanIOqc> {
  updateQualityPlanIOqc(request: UpdateQualityPlanIOqcByConfirmErrorReportRequestDto);
  findQualityPlanIOqcByQc(
    type: number,
    orderId: number,
    warehouseId: number,
    itemId: number,
  ):Promise<any>
}
