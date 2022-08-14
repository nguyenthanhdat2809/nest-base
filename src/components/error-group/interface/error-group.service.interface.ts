import { ResponsePayload } from '@utils/response-payload';
import { ErrorGroupRequestDto } from '@components/error-group/dto/request/error-group.request.dto';
import { ErrorGroupResponseDto } from '@components/error-group/dto/response/error-group.response.dto';
import { UpdateErrorGroupRequestDto } from '@components/error-group/dto/request/update-error-group.request.dto';
import { GetListErrorGroupRequestDto } from '@components/error-group/dto/request/get-list-error-group.request.dto';
import { GetListErrorGroupResponseDto } from '@components/error-group/dto/response/get-list-error-group.response.dto';
import { ImportRequestDto } from '@core/dto/import/request/import.request.dto';
import { ImportResponseDto } from '@core/dto/import/response/import.response.dto';
import { GetFileResponseDto } from '@core/dto/import/response/get-file.response.dto';
import { GetLogRequestDto } from '@core/dto/import/request/get-log.request.dto';
import { DeleteErrorGroupRequestDto } from "@components/error-group/dto/request/delete-error-group.request.dto";

export interface ErrorGroupServiceInterface {
  create(
    errorGroupRequestDto: ErrorGroupRequestDto,
  ): Promise<ResponsePayload<ErrorGroupResponseDto>>;
  getDetail(id: number): Promise<ResponsePayload<ErrorGroupResponseDto | any>>;
  delete(request: DeleteErrorGroupRequestDto): Promise<ResponsePayload<any>>;
  updateById(
    request: UpdateErrorGroupRequestDto,
  ): Promise<ResponsePayload<ErrorGroupResponseDto>>;
  getList(
    request: GetListErrorGroupRequestDto,
  ): Promise<ResponsePayload<GetListErrorGroupResponseDto | any>>;
  import(
    request: ImportRequestDto,
  ): Promise<ResponsePayload<ImportResponseDto>>;
  getImportTemplate(): Promise<ResponsePayload<GetFileResponseDto>>;
  getListByTransactionHistoryId(transactionHistoryId): Promise<any>;
  updateByCode(
    request: ErrorGroupRequestDto,
  ): Promise<ResponsePayload<ErrorGroupResponseDto>>;
  getDetailByCode(
    code: string,
  ): Promise<ResponsePayload<ErrorGroupResponseDto | any>>;
}
