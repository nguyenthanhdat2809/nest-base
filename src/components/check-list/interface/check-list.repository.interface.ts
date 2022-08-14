import { CheckList } from '@entities/check-list/check-list.entity';
import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { CheckListRequestDto } from '@components/check-list/dto/request/check-list.request.dto';
import { CheckListAllRequestDto } from '@components/check-list/dto/request/check-list-all.request.dto';

export interface CheckListRepositoryInterface
  extends BaseInterfaceRepository<CheckList> {
  createEntity(checkListDto: CheckListRequestDto): CheckList;
  getDetail(id: number): Promise<any>;
  getList(request: CheckListAllRequestDto);
}
