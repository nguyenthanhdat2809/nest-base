import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDto } from "@core/dto/base.dto";
import { TransactionHistoryTypeEnum } from "@components/transaction-history/transaction-history.constant";

export class GetMaximumQcQuantityRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  orderId: number;
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  workCenterId: number;
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  totalUnQcQuantity: number;
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  type: TransactionHistoryTypeEnum;
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsOptional()
  itemId?: number;
}