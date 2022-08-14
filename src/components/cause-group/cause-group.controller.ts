import { Body, Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ResponsePayload } from '@utils/response-payload';
import { isEmpty } from 'lodash';
import { CauseGroupServiceInterface } from '@components/cause-group/interface/cause-group.service.interface';
import { CauseGroupRequestDto } from '@components/cause-group/dto/request/cause-group.request.dto';
import { CauseGroupResponseDto } from '@components/cause-group/dto/response/cause-group.response.dto';
import { UpdateCauseGroupRequestDto } from '@components/cause-group/dto/request/update-cause-group.request.dto';
import { GetListCauseGroupRequestDto } from '@components/cause-group/dto/request/get-list-cause-group.request.dto';
import { GetListCauseGroupResponseDto } from '@components/cause-group/dto/response/get-list-cause-group.response.dto';
import { IS_EXPORT } from '@constant/common';
import { PermissionCode } from '@core/decorator/get-code.decorator';
import {
  CREATE_CAUSE_GROUP_PERMISSION,
  DELETE_CAUSE_GROUP_PERMISSION,
  UPDATE_CAUSE_GROUP_PERMISSION,
  VIEW_CAUSE_GROUP_PERMISSION,
} from '@utils/permissions/web/cause-group';
import { CauseGroupDetailRequestDto } from '@components/cause-group/dto/request/cause-group-detail.request.dto';
import { CauseGroupDeleteRequestDto } from '@components/cause-group/dto/request/cause-group-delete.request.dto';

@Controller('cause-group')
export class CauseGroupController {
  constructor(
    @Inject('CauseGroupServiceInterface')
    private readonly causeGroupService: CauseGroupServiceInterface,
  ) {}

  @PermissionCode(CREATE_CAUSE_GROUP_PERMISSION.code)
  @MessagePattern('cause_group_create')
  public async create(
    @Body() payload: CauseGroupRequestDto,
  ): Promise<ResponsePayload<CauseGroupResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.causeGroupService.create(request);
  }

  @PermissionCode(VIEW_CAUSE_GROUP_PERMISSION.code)
  @MessagePattern('cause_group_detail')
  public async getDetail(
    @Body() payload: CauseGroupDetailRequestDto,
  ): Promise<ResponsePayload<CauseGroupResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.causeGroupService.getDetail(request.id);
  }

  @PermissionCode(UPDATE_CAUSE_GROUP_PERMISSION.code)
  @MessagePattern('cause_group_update')
  public async update(
    @Body() payload: UpdateCauseGroupRequestDto,
  ): Promise<ResponsePayload<CauseGroupResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.causeGroupService.updateById(request);
  }

  @PermissionCode(DELETE_CAUSE_GROUP_PERMISSION.code)
  @MessagePattern('cause_group_delete')
  public async delete(
    @Body() payload: CauseGroupDeleteRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.causeGroupService.delete(request);
  }

  @PermissionCode(VIEW_CAUSE_GROUP_PERMISSION.code)
  @MessagePattern('cause_group_list')
  public async getList(
    @Body() payload: GetListCauseGroupRequestDto,
  ): Promise<ResponsePayload<GetListCauseGroupResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.causeGroupService.getList(request);
  }

  @MessagePattern('cause_group_export')
  public async exportCauseGroup(
    @Body() payload: GetListCauseGroupRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.isExport = IS_EXPORT;

    return await this.causeGroupService.getList(request);
  }

  @PermissionCode(VIEW_CAUSE_GROUP_PERMISSION.code)
  @MessagePattern('cause_group_get_all')
  public async getAll(): Promise<ResponsePayload<any>> {
    return await this.causeGroupService.getAll();
  }
}
