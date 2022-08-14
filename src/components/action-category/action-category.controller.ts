import { Body, Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ResponsePayload } from '@utils/response-payload';
import { isEmpty } from 'lodash';
import { ActionCategoryServiceInterface } from '@components/action-category/interface/action-category.service.interface';
import { ActionCategoryRequestDto } from '@components/action-category/dto/request/action-category.request.dto';
import { ActionCategoryResponseDto } from '@components/action-category/dto/response/action-category.response.dto';
import { UpdateActionCategoryRequestDto } from '@components/action-category/dto/request/update-action-category.request.dto';
import { GetListActionCategoryRequestDto } from '@components/action-category/dto/request/get-list-action-category.request.dto';
import { GetListActionCategoryResponseDto } from '@components/action-category/dto/response/get-list-action-category.response.dto';
import { IS_EXPORT } from '@constant/common';
import { PermissionCode } from "@core/decorator/get-code.decorator";
import {
  CREATE_ACTION_CATEGORY_PERMISSION, DELETE_ACTION_CATEGORY_PERMISSION,
  UPDATE_ACTION_CATEGORY_PERMISSION,
  VIEW_ACTION_CATEGORY_PERMISSION
} from "@utils/permissions/web/action-category";
import { ActionCategoryDetailRequestDto } from "@components/action-category/dto/request/action-category-detail.request.dto";
import { DeleteActionCategoryRequestDto } from "@components/action-category/dto/request/delete-action-category.request.dto";

@Controller('action-categories')
export class ActionCategoryController {
  constructor(
    @Inject('ActionCategoryServiceInterface')
    private readonly actionCategoryService: ActionCategoryServiceInterface,
  ) {}

  @PermissionCode(VIEW_ACTION_CATEGORY_PERMISSION.code)
  @MessagePattern('action_category_list')
  public async getList(
    @Body() payload: GetListActionCategoryRequestDto,
  ): Promise<ResponsePayload<GetListActionCategoryResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.actionCategoryService.getList(request);
  }

  @MessagePattern('action_category_export')
  public async exportActionCategory(
    @Body() payload: GetListActionCategoryRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.isExport = IS_EXPORT;

    return await this.actionCategoryService.getList(request);
  }

  @PermissionCode(VIEW_ACTION_CATEGORY_PERMISSION.code)
  @MessagePattern('action_category_detail')
  public async getDetail(
    @Body() payload: ActionCategoryDetailRequestDto,
  ): Promise<ResponsePayload<ActionCategoryResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.actionCategoryService.getDetail(request.id);
  }

  @PermissionCode(CREATE_ACTION_CATEGORY_PERMISSION.code)
  @MessagePattern('action_category_create')
  public async create(
    @Body() payload: ActionCategoryRequestDto,
  ): Promise<ResponsePayload<ActionCategoryResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.actionCategoryService.create(request);
  }

  @PermissionCode(UPDATE_ACTION_CATEGORY_PERMISSION.code)
  @MessagePattern('action_category_update')
  public async update(
    @Body() payload: UpdateActionCategoryRequestDto,
  ): Promise<ResponsePayload<ActionCategoryResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.actionCategoryService.updateById(request);
  }

  @PermissionCode(DELETE_ACTION_CATEGORY_PERMISSION.code)
  @MessagePattern('action_category_delete')
  public async delete(
    @Body() payload: DeleteActionCategoryRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.actionCategoryService.delete(request);
  }
}
