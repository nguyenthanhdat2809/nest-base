import { PaginationQuery } from '@utils/pagination.query';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, Min } from 'class-validator';
import { TransactionHistoryTypeEnum } from '@components/transaction-history/transaction-history.constant';

export class TransactionHistoryListRequestDto extends PaginationQuery {
  @ApiProperty()
  @IsOptional()
  @Min(1)
  orderId?: number;

  @IsEnum(TransactionHistoryTypeEnum)
  type: TransactionHistoryTypeEnum;
}
