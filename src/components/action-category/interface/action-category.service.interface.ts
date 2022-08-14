import { ResponsePayload } from '@utils/response-payload';
import { ActionCategoryRequestDto } from '@components/action-category/dto/request/action-category.request.dto';
import { ActionCategoryResponseDto } from '@components/action-category/dto/response/action-category.response.dto';
import { UpdateActionCategoryRequestDto } from '@components/action-category/dto/request/update-action-category.request.dto';
import { GetListActionCategoryRequestDto } from '@components/action-category/dto/request/get-list-action-category.request.dto';
import { GetListActionCategoryResponseDto } from '@components/action-category/dto/response/get-list-action-category.response.dto';
import { DeleteActionCategoryRequestDto } from "@components/action-category/dto/request/delete-action-category.request.dto";

export interface ActionCategoryServiceInterface {
  getList(
    request: GetListActionCategoryRequestDto,
  ): Promise<ResponsePayload<GetListActionCategoryResponseDto | any>>;
  getDetail(
    id: number,
  ): Promise<ResponsePayload<ActionCategoryResponseDto | any>>;
  create(
    actionCategoryRequestDto: ActionCategoryRequestDto,
  ): Promise<ResponsePayload<ActionCategoryResponseDto | any>>;
  updateById(
    actionCategoryDto: UpdateActionCategoryRequestDto,
  ): Promise<ResponsePayload<ActionCategoryResponseDto | any>>;
  delete(request: DeleteActionCategoryRequestDto): Promise<ResponsePayload<any>>;
  getListAll(): Promise<any>;
  updateByCode(
    request: ActionCategoryRequestDto,
  ): Promise<ResponsePayload<ActionCategoryResponseDto>>;
}
