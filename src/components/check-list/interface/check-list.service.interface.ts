import { ResponsePayload } from '@utils/response-payload';
import { SuccessResponse } from '@utils/success.response.dto';
import { CheckListRequestDto } from '@components/check-list/dto/request/check-list.request.dto';
import { CheckListResponseDto } from '@components/check-list/dto/response/check-list.response.dto';
import { CheckListAllRequestDto } from '@components/check-list/dto/request/check-list-all.request.dto';
import { CheckListAllResponseDto } from '@components/check-list/dto/response/check-list-all.response.dto';
import { UpdateCheckListRequestDto } from '@components/check-list/dto/request/update-check-list.request.dto';
import { UpdateCheckListStatusRequestDto } from '@components/check-list/dto/request/update-check-list-status-request.dto';
import { CheckList } from '@entities/check-list/check-list.entity';
import { DeleteCheckListRequestDto } from "@components/check-list/dto/request/delete-check-list.request.dto";

export interface CheckListServiceInterface {
  confirm(payload: UpdateCheckListStatusRequestDto): Promise<any>;
  create(
    CheckListRequestDto: CheckListRequestDto,
  ): Promise<ResponsePayload<CheckListResponseDto | any>>;
  getDetail(id: number): Promise<any>;
  getList(
    request: CheckListAllRequestDto,
  ): Promise<ResponsePayload<CheckListAllResponseDto | any>>;
  updateById(
    payload: UpdateCheckListRequestDto,
  ): Promise<ResponsePayload<CheckListResponseDto | any>>;
  remove(
    request: DeleteCheckListRequestDto,
  ): Promise<ResponsePayload<SuccessResponse | any>>;
  getItemUnitList();
  getErrorGroupList();
  getCheckListConfirm();
  getDetailByCode(code: string): Promise<ResponsePayload<CheckListResponseDto>>;
  update(
    checkListEntity: CheckList,
    payload: UpdateCheckListRequestDto,
  ): Promise<ResponsePayload<CheckListResponseDto | any>>
}
