import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { ActionCategory } from '@entities/action-category/action-category.entity';
import { ActionCategoryRequestDto } from '@components/action-category/dto/request/action-category.request.dto';
import { GetListActionCategoryRequestDto } from '@components/action-category/dto/request/get-list-action-category.request.dto';

export interface ActionCategoryRepositoryInterface
  extends BaseInterfaceRepository<ActionCategory> {
  getList(request: GetListActionCategoryRequestDto);
  getExistedRecord(
    id: number,
    causeGroupDto: ActionCategoryRequestDto,
  ): Promise<[ActionCategory, ActionCategory]>;
  createEntity(causeGroupDto: ActionCategoryRequestDto): ActionCategory;
  getListAll();
  getActionCategoryByIds(ids: number[]): Promise<any>;
  findOneByCode(code: string): Promise<ActionCategory>;
}
