import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { ErrorGroup } from '@entities/error-group/error-group.entity';
import { ErrorGroupRequestDto } from '@components/error-group/dto/request/error-group.request.dto';
import { GetListErrorGroupRequestDto } from '@components/error-group/dto/request/get-list-error-group.request.dto';

export interface ErrorGroupRepositoryInterface
  extends BaseInterfaceRepository<ErrorGroup> {
  createEntity(errorGroupDto: ErrorGroupRequestDto): ErrorGroup;
  getList(request: GetListErrorGroupRequestDto);
  getExistedRecord(
    id: number,
    errorGroupDto: ErrorGroupRequestDto,
  ): Promise<[ErrorGroup, ErrorGroup]>;
  findOneByCode(code: string): Promise<ErrorGroup>;
  getListByTransactionHistoryId(transactionHistoryId: number): Promise<any>;
  getErrorGroupByIds(ids: number[]): Promise<any>;
}
