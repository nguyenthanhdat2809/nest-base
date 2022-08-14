import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionHistoryTypeEnum } from '@components/transaction-history/transaction-history.constant';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class GetDashboardIoQcProgressRequestDto extends BaseDto {
  @ApiProperty({ example: 1, description: 'loại QC' })
  @Expose()
  @IsEnum(TransactionHistoryTypeEnum)
  @Type(() => Number)
  @IsOptional()
  qcStageId: number;

  @ApiProperty({ example: 1, description: 'Id của lệnh' })
  @Expose()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orderId: number;

  @ApiProperty({ example: 1, description: 'Id sản phẩm' })
  @Expose()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  itemId: number;
}
