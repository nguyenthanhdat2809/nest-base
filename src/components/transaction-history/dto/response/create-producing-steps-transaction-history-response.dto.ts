import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseDto } from '@core/dto/base.dto';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { TransactionHistoryTypeEnum } from '@components/transaction-history/transaction-history.constant';

export class CreateProducingStepsTransactionHistoryResponseDto extends BaseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  orderId: number;

  @ApiProperty()
  @Expose()
  qcPassQuantity: number;

  @ApiProperty()
  @Expose()
  qcRejectQuantity: number;

  @ApiProperty()
  @Expose()
  qcQuantity: number;

  @ApiProperty()
  @Expose()
  note: string;

  @ApiProperty()
  @Expose()
  workCenterId: string;

  @ApiProperty()
  @Expose()
  logTimeId: number;

  @ApiProperty()
  @Expose()
  type: number;

  @ApiProperty()
  @Expose()
  itemId: number;
}
