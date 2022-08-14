import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { CauseGroup } from '@entities/cause-group/cause-group.entity';
import { CauseGroupRequestDto } from '@components/cause-group/dto/request/cause-group.request.dto';
import { GetListCauseGroupRequestDto } from '@components/cause-group/dto/request/get-list-cause-group.request.dto';

export interface CauseGroupRepositoryInterface
  extends BaseInterfaceRepository<CauseGroup> {
  createEntity(causeGroupDto: CauseGroupRequestDto): CauseGroup;
  getList(request: GetListCauseGroupRequestDto);
  getExistedRecord(
    id: number,
    causeGroupDto: CauseGroupRequestDto,
  ): Promise<[CauseGroup, CauseGroup]>;
  getListForErrorReport(): Promise<any>;
  getCauseGroupByIds(ids: number[]): Promise<any>;
}
