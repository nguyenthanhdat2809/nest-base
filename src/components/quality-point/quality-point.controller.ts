import {
  Body,
  Controller,
  Inject,
  Req,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ResponsePayload } from '@utils/response-payload';
import { isEmpty } from '@utils/object.util';
import { QualityPointResponseDto } from '@components/quality-point/dto/response/quality-point.response.dto';
import { QualityPointServiceInterface } from '@components/quality-point/interface/quality-point.service.interface';
import { GetListQualityPointRequestDto } from '@components/quality-point/dto/request/get-list-quality-point.request.dto';
import { GetListQualityPointResponseDto } from '@components/quality-point/dto/response/get-list-quality-point.response.dto';
import { QualityPointRequestDto } from '@components/quality-point/dto/request/quality-point.request.dto';
import { QualityPointDataResponseDto } from '@components/quality-point/dto/response/quality-point-data.response.dto';
import { UpdateQualityPointRequestDto } from '@components/quality-point/dto/request/update-quality-point.request.dto';
import { SuccessResponse } from '@utils/success.response.dto';
import { DetailQualityPointResponseDto } from '@components/quality-point/dto/response/detail-quality-point.response.dto';
import { QualityPointsByIds } from '@components/quality-point/dto/request/quality-points-by-ids.request.dto';
import { IS_EXPORT } from '@constant/common';
import {
  CONFIRM_QUALITY_POINT_PERMISSION,
  COPY_QUALITY_POINT_ITEM_PERMISSION,
  CREATE_QUALITY_POINT_PERMISSION,
  DELETE_QUALITY_POINT_PERMISSION,
  UPDATE_QUALITY_POINT_PERMISSION,
  VIEW_QUALITY_POINT_PERMISSION,
} from '@utils/permissions/web/quality-point';
import { PermissionCode } from '@core/decorator/get-code.decorator';
import { ConfirmQualityPointRequestDto } from '@components/quality-point/dto/request/confirm-quality-point.request.dto';
import { DetailQualityPointRequestDto } from '@components/quality-point/dto/request/detail-quality-point.request.dto';
import { DeleteQualityPointRequestDto } from '@components/quality-point/dto/request/delete-quality-point.request.dto';

@Controller('QualityPoints')
export class QualityPointController {
  constructor(
    @Inject('QualityPointServiceInterface')
    private readonly qualityPointService: QualityPointServiceInterface,
  ) {}

  @PermissionCode(CREATE_QUALITY_POINT_PERMISSION.code)
  @MessagePattern('create_quality_point')
  public async create(
    @Body() payload: QualityPointRequestDto,
  ): Promise<ResponsePayload<QualityPointDataResponseDto | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.qualityPointService.create(request);
  }

  @PermissionCode(VIEW_QUALITY_POINT_PERMISSION.code)
  @MessagePattern('detail_quality_point')
  public async detail(
    @Body() payload: DetailQualityPointRequestDto,
  ): Promise<ResponsePayload<DetailQualityPointResponseDto | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.qualityPointService.getDetail(request.id);
  }

  @PermissionCode(COPY_QUALITY_POINT_ITEM_PERMISSION.code)
  @MessagePattern('copy_item_quality_point')
  public async copyItemQualityPoint(
    id: number,
  ): Promise<ResponsePayload<DetailQualityPointResponseDto | any>> {
    return await this.qualityPointService.getDetail(id);
  }

  @PermissionCode(UPDATE_QUALITY_POINT_PERMISSION.code)
  @MessagePattern('update_quality_point')
  public async update(
    data: UpdateQualityPointRequestDto,
  ): Promise<ResponsePayload<QualityPointResponseDto | any>> {
    const { request, responseError } = data;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.qualityPointService.updateById(request);
  }

  @PermissionCode(DELETE_QUALITY_POINT_PERMISSION.code)
  @MessagePattern('delete_quality_point')
  public async delete(
    @Body() payload: DeleteQualityPointRequestDto,
  ): Promise<ResponsePayload<SuccessResponse | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.qualityPointService.remove(request);
  }

  @PermissionCode(VIEW_QUALITY_POINT_PERMISSION.code)
  @MessagePattern('quality_point_list')
  public async getListQualityPoint(
    payload: GetListQualityPointRequestDto,
  ): Promise<ResponsePayload<GetListQualityPointResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.qualityPointService.getList(request);
  }

  @MessagePattern('quality_point_export')
  public async exportQualityPoint(
    payload: GetListQualityPointRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.isExport = IS_EXPORT;

    return await this.qualityPointService.getList(request);
  }

  @MessagePattern('get_env_item_in_quality_point')
  public async getEnvItemInQualityPoint(idQc: number): Promise<any> {
    return await this.qualityPointService.getEnvItemInQualityPoint(idQc);
  }

  @MessagePattern('get_user_list')
  public async getUserList() {
    return await this.qualityPointService.getUserList();
  }

  @PermissionCode(CONFIRM_QUALITY_POINT_PERMISSION.code)
  @MessagePattern('confirm_quality_point')
  public async confirm(
    @Body() payload: ConfirmQualityPointRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.qualityPointService.confirm(request.id);
  }

  @PermissionCode(VIEW_QUALITY_POINT_PERMISSION.code)
  @MessagePattern('quality_points_by_ids')
  public async getQualityPointsByIds(
    @Body() payload: QualityPointsByIds,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.qualityPointService.getQualityPointsByIds(request.ids);
  }
}
