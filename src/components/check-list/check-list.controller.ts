import { Body, Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ResponsePayload } from '@utils/response-payload';
import { SuccessResponse } from '@utils/success.response.dto';
import { isEmpty } from '@utils/object.util';
import { CheckListServiceInterface } from '@components/check-list/interface/check-list.service.interface';
import { CheckListRequestDto } from '@components/check-list/dto/request/check-list.request.dto';
import { CheckListAllRequestDto } from '@components/check-list/dto/request/check-list-all.request.dto';
import { CheckListResponseDto } from '@components/check-list/dto/response/check-list.response.dto';
import { CheckListAllResponseDto } from '@components/check-list/dto/response/check-list-all.response.dto';
import { UpdateCheckListRequestDto } from '@components/check-list/dto/request/update-check-list.request.dto';
import { UpdateCheckListStatusRequestDto } from './dto/request/update-check-list-status-request.dto';
import { IS_EXPORT } from '@constant/common';
import { PermissionCode } from "@core/decorator/get-code.decorator";
import {
  CONFIRM_CHECK_LIST_PERMISSION, COPY_ITEM_CHECK_LIST_PERMISSION,
  CREATE_CHECK_LIST_PERMISSION, DELETE_CHECK_LIST_PERMISSION,
  UPDATE_CHECK_LIST_PERMISSION,
  VIEW_CHECK_LIST_PERMISSION
} from "@utils/permissions/web/check-list";
import { DetailCheckListRequestDto } from "@components/check-list/dto/request/detail-check-list.request.dto";
import { DeleteCheckListRequestDto } from "@components/check-list/dto/request/delete-check-list.request.dto";

@Controller('CheckLists')
export class CheckListController {
  constructor(
    @Inject('CheckListServiceInterface')
    private readonly checkListService: CheckListServiceInterface,
  ) {}

  @PermissionCode(CREATE_CHECK_LIST_PERMISSION.code)
  @MessagePattern('create_check_list')
  public async create(
    @Body() payload: CheckListRequestDto,
  ): Promise<ResponsePayload<CheckListResponseDto | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.checkListService.create(request);
  }

  @PermissionCode(VIEW_CHECK_LIST_PERMISSION.code)
  @MessagePattern('detail_check_list')
  public async detail(
    @Body() payload: DetailCheckListRequestDto,
  ): Promise<ResponsePayload<CheckListRequestDto | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.checkListService.getDetail(request.id);
  }

  @PermissionCode(COPY_ITEM_CHECK_LIST_PERMISSION.code)
  @MessagePattern('copy_item_check_list')
  public async copyItemCheckList(
    id: number,
  ): Promise<ResponsePayload<CheckListRequestDto | any>> {
    return await this.checkListService.getDetail(id);
  }

  @PermissionCode(VIEW_CHECK_LIST_PERMISSION.code)
  @MessagePattern('check_list_all')
  public async getCheckListAll(
    @Body() payload: CheckListAllRequestDto,
  ): Promise<ResponsePayload<CheckListAllResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.checkListService.getList(request);
  }

  @MessagePattern('check_list_export')
  public async exportCheckList(
    payload: CheckListAllRequestDto
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.isExport = IS_EXPORT;

    return await this.checkListService.getList(request);
  }

  @PermissionCode(UPDATE_CHECK_LIST_PERMISSION.code)
  @MessagePattern('update_check_list')
  public async update(
    data: UpdateCheckListRequestDto,
  ): Promise<ResponsePayload<CheckListResponseDto | any>> {
    const { request, responseError } = data;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.checkListService.updateById(request);
  }

  @PermissionCode(DELETE_CHECK_LIST_PERMISSION.code)
  @MessagePattern('delete_check_list')
  public async delete(
    @Body() data: DeleteCheckListRequestDto,
  ): Promise<ResponsePayload<SuccessResponse | any>> {
    const { request, responseError } = data;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.checkListService.remove(request);
  }

  @MessagePattern('get_item_unit_to_check_list')
  public async getItemUnitList() {
    return await this.checkListService.getItemUnitList();
  }

  @MessagePattern('get_error_group_to_check_list')
  public async getErrorGroupList() {
    return await this.checkListService.getErrorGroupList();
  }

  @PermissionCode(CONFIRM_CHECK_LIST_PERMISSION.code)
  @MessagePattern('confirm_check_list')
  public async confirm(
    @Body() payload: UpdateCheckListStatusRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.checkListService.confirm(request);
  }

  @PermissionCode(VIEW_CHECK_LIST_PERMISSION.code)
  @MessagePattern('check_list_confirm')
  public async getCheckListConfirm() {
    return await this.checkListService.getCheckListConfirm();
  }
}
