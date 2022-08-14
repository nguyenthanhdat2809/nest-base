import { ResponsePayload } from '@utils/response-payload';
import { CauseGroupRequestDto } from '@components/cause-group/dto/request/cause-group.request.dto';
import { CauseGroupResponseDto } from '@components/cause-group/dto/response/cause-group.response.dto';
import { GetListCauseGroupRequestDto } from '@components/cause-group/dto/request/get-list-cause-group.request.dto';
import { CauseGroupDeleteRequestDto } from "@components/cause-group/dto/request/cause-group-delete.request.dto";
import { PagingResponse } from '@utils/paging.response';
import { ImportRequestDto } from '@core/dto/import/request/import.request.dto';
import { ImportResponseDto } from '@core/dto/import/response/import.response.dto';
import { GetFileResponseDto } from '@core/dto/import/response/get-file.response.dto';
import { UpdateCauseGroupRequestDto } from '@components/cause-group/dto/request/update-cause-group.request.dto';

export interface CauseGroupServiceInterface {
  create(
    causeGroupRequestDto: CauseGroupRequestDto,
  ): Promise<ResponsePayload<CauseGroupResponseDto | any>>;
  getDetail(id: number): Promise<ResponsePayload<CauseGroupResponseDto | any>>;
  updateById(
    companyDto: UpdateCauseGroupRequestDto,
  ): Promise<ResponsePayload<CauseGroupResponseDto | any>>;
  delete(request: CauseGroupDeleteRequestDto): Promise<ResponsePayload<any>>;
  getList(
    request: GetListCauseGroupRequestDto,
  ): Promise<ResponsePayload<PagingResponse>>;
  getAll(): Promise<ResponsePayload<CauseGroupResponseDto>>;
  import(
    request: ImportRequestDto,
  ): Promise<ResponsePayload<ImportResponseDto>>;
  getImportTemplate(): Promise<ResponsePayload<GetFileResponseDto>>;
  updateByCode(
    request: CauseGroupRequestDto,
  ): Promise<ResponsePayload<CauseGroupResponseDto>>;
}
