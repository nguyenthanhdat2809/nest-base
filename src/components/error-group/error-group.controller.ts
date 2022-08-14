import { Body, Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ResponsePayload } from '@utils/response-payload';
import { isEmpty } from 'lodash';
import { ErrorGroupServiceInterface } from '@components/error-group/interface/error-group.service.interface';
import { ErrorGroupRequestDto } from '@components/error-group/dto/request/error-group.request.dto';
import { ErrorGroupResponseDto } from '@components/error-group/dto/response/error-group.response.dto';
import { UpdateErrorGroupRequestDto } from '@components/error-group/dto/request/update-error-group.request.dto';
import { GetListErrorGroupRequestDto } from '@components/error-group/dto/request/get-list-error-group.request.dto';
import { GetListErrorGroupResponseDto } from '@components/error-group/dto/response/get-list-error-group.response.dto';
import { ImportRequestDto } from '@core/dto/import/request/import.request.dto';
import { ImportResponseDto } from '@core/dto/import/response/import.response.dto';
import { GetLogRequestDto } from '@core/dto/import/request/get-log.request.dto';
import { GetFileResponseDto } from '@core/dto/import/response/get-file.response.dto';
import { IS_EXPORT } from '@constant/common';
import { PermissionCode } from '@core/decorator/get-code.decorator';
import {
  CREATE_ERROR_GROUP_PERMISSION,
  DELETE_ERROR_GROUP_PERMISSION,
  IMPORT_ERROR_GROUP_PERMISSION,
  UPDATE_ERROR_GROUP_PERMISSION,
  VIEW_ERROR_GROUP_PERMISSION,
} from '@utils/permissions/web/error-group';
import { ErrorGroupDetailRequestDto } from '@components/error-group/dto/request/error-group-detail.request.dto';
import { DeleteErrorGroupRequestDto } from '@components/error-group/dto/request/delete-error-group.request.dto';

@Controller('error-group')
export class ErrorGroupController {
  constructor(
    @Inject('ErrorGroupServiceInterface')
    private readonly errorGroupService: ErrorGroupServiceInterface,
  ) {}

  @PermissionCode(CREATE_ERROR_GROUP_PERMISSION.code)
  @MessagePattern('error_group_create')
  public async create(
    @Body() payload: ErrorGroupRequestDto,
  ): Promise<ResponsePayload<ErrorGroupResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.errorGroupService.create(request);
  }

  @PermissionCode(VIEW_ERROR_GROUP_PERMISSION.code)
  @MessagePattern('error_group_detail')
  public async getDetail(
    @Body() payload: ErrorGroupDetailRequestDto,
  ): Promise<ResponsePayload<ErrorGroupResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.errorGroupService.getDetail(request.id);
  }

  @PermissionCode(UPDATE_ERROR_GROUP_PERMISSION.code)
  @MessagePattern('error_group_update')
  public async update(
    @Body() payload: UpdateErrorGroupRequestDto,
  ): Promise<ResponsePayload<ErrorGroupResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.errorGroupService.updateById(request);
  }

  @PermissionCode(DELETE_ERROR_GROUP_PERMISSION.code)
  @MessagePattern('error_group_delete')
  public async delete(
    @Body() payload: DeleteErrorGroupRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.errorGroupService.delete(request);
  }

  @PermissionCode(VIEW_ERROR_GROUP_PERMISSION.code)
  @MessagePattern('error_group_list')
  public async getList(
    @Body() payload: GetListErrorGroupRequestDto,
  ): Promise<ResponsePayload<GetListErrorGroupResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.errorGroupService.getList(request);
  }

  @MessagePattern('error_group_export')
  public async exportErrorGroup(
    @Body() payload: GetListErrorGroupRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.isExport = IS_EXPORT;

    return await this.errorGroupService.getList(request);
  }

  @PermissionCode(IMPORT_ERROR_GROUP_PERMISSION.code)
  @MessagePattern('error_group_import')
  public async import(
    @Body() payload: ImportRequestDto,
  ): Promise<ResponsePayload<ImportResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.errorGroupService.import(request);
  }
  @MessagePattern('error_group_get_template')
  public async getTemplate(): Promise<ResponsePayload<GetFileResponseDto>> {
    return await this.errorGroupService.getImportTemplate();
  }
}
