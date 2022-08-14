import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { QualityPlanBom } from '@entities/quality-plan/quality-plan-bom.entity';
import { ListQualityPlanBomRequestDto } from '@components/quality-plan/dto/request/list-quality-plan-bom.request.dto';

export interface QualityPlanBomRepositoryInterface
  extends BaseInterfaceRepository<QualityPlanBom> {
  getListQualityPlanBom(
    request: ListQualityPlanBomRequestDto,
  ):Promise<any>;
  findQualityPlanBomByUserAndWo(
    userId: number,
    workOrderId: number,
  ): Promise<any>;
}
