import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from "class-transformer";
import { ProducingStepsTransactionHistoryResponseDto } from '@components/transaction-history/dto/response/producing-steps-transaction-history.response.dto';
import { TransactionHistoryForWebResponseDto } from '@components/transaction-history/dto/response/transaction-history-for-web.response.dto';

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}

class MetaData {
  @Expose()
  data: TransactionHistoryForWebResponseDto[];

  @Expose()
  meta: Meta;
}

export class GetListIoqcTransactionHistoryForWebResponseDto extends SuccessResponse {
  @ApiProperty()
  @Expose()
  data: MetaData;
}