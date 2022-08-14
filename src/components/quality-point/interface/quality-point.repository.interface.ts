import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { QualityPoint } from '@entities/quality-point/quality-point.entity';
import { QualityPointRequestDto } from '@components/quality-point/dto/request/quality-point.request.dto';
import { GetListQualityPointRequestDto } from '@components/quality-point/dto/request/get-list-quality-point.request.dto';
import { QualityPointUser1 } from '@entities/quality-point-user/quality-point-user1.entity';
import { QualityPointUser2 } from '@entities/quality-point-user/quality-point-user2.entity';
import { CheckListDetail } from '@entities/check-list/check-list-detail.entity';

export interface QualityPointRepositoryInterface
  extends BaseInterfaceRepository<QualityPoint> {
  getDetail(id: number): Promise<any>;
  getListQualityPoint(
    request: GetListQualityPointRequestDto,
    filterStageSearch: any,
    filterUserSearch: any,
  );
  createEntity(qualityPointDto: QualityPointRequestDto): QualityPoint;
  createQualityPointUser1Entity(
    qualityPointId: number,
    userId: number,
  ): QualityPointUser1;
  createQualityPointUser2Entity(
    qualityPointId: number,
    userId: number,
  ): QualityPointUser2;
  getCheckListDetailsByQualityPoint(qualityPointId: number): Promise<any>;
  getCheckListDetailsByQualityPointList(
    materialCriteriaIdList: number[],
  ): Promise<any>;
  getListByIds(qualityPointIds: number[]): Promise<any>;
}
