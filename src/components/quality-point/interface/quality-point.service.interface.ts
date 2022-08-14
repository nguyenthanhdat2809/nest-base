import { GetListQualityPointRequestDto } from '@components/quality-point/dto/request/get-list-quality-point.request.dto';
import { ResponsePayload } from '@utils/response-payload';
import { GetListQualityPointResponseDto } from '@components/quality-point/dto/response/get-list-quality-point.response.dto';
import { QualityPointRequestDto } from '@components/quality-point/dto/request/quality-point.request.dto';
import { QualityPointDataResponseDto } from '@components/quality-point/dto/response/quality-point-data.response.dto';
import { UpdateQualityPointRequestDto } from '@components/quality-point/dto/request/update-quality-point.request.dto';
import { QualityPointResponseDto } from '@components/quality-point/dto/response/quality-point.response.dto';
import { SuccessResponse } from '@utils/success.response.dto';
import { DetailQualityPointResponseDto } from '@components/quality-point/dto/response/detail-quality-point.response.dto';
import { DeleteQualityPointRequestDto } from '@components/quality-point/dto/request/delete-quality-point.request.dto';

export interface QualityPointServiceInterface {
  confirm(id: number): Promise<any>;
  create(
    qualityDto: QualityPointRequestDto,
  ): Promise<ResponsePayload<QualityPointDataResponseDto | any>>;
  getDetail(
    id: number,
  ): Promise<ResponsePayload<DetailQualityPointResponseDto | any>>;
  remove(
    request: DeleteQualityPointRequestDto,
  ): Promise<ResponsePayload<SuccessResponse | any>>;
  getList(
    request: GetListQualityPointRequestDto,
  ): Promise<ResponsePayload<GetListQualityPointResponseDto | any>>;
  getUserList();
  getCheckListDetailsByQualityPoint(qualityPointId: number): Promise<any>;
  getEnvItemInQualityPoint(idQc: number): Promise<any>;
  getCheckListDetailsByQualityPointList(
    materialCriteriaIdList: number[],
  ): Promise<any>;
  updateById(
    payload: UpdateQualityPointRequestDto,
  ): Promise<ResponsePayload<QualityPointResponseDto | any>>;
  getQualityPointsByIds(ids: number[]): Promise<any>;
}
