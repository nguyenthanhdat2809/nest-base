import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { GetDashboardFinishedItemProgressRequestDto } from '@components/dashboard/dto/request/get-dashboard-finished-item-progress.request.dto';
import { GetDashboardIoQcProgressRequestDto } from '@components/dashboard/dto/request/get-dashboard-io-qc-progress-request.dto';
import { TransactionHistoryTypeEnum } from '@components/transaction-history/transaction-history.constant';

export class GetDashboardOverallQcProgressRequestDto extends BaseDto {
  @ApiProperty({
    example: '2021-12-31',
    description: 'Date from (format yyyy-mm-dd)',
  })
  @Expose()
  @IsOptional()
  @IsDateString()
  from: Date;
  @ApiProperty({
    example: '2021-12-31',
    description: 'Date to (format yyyy-mm-dd)',
  })
  @Expose()
  @IsOptional()
  @IsDateString()
  to: Date;

  @ApiProperty({ example: 1, description: 'loại QC: 0,2,3,5,8' })
  @Expose()
  @IsEnum(TransactionHistoryTypeEnum)
  @Type(() => Number)
  @IsOptional()
  qcStageId: number;

  @ApiProperty({
    example: { moId: 149, itemId: 277, producingStepId: 193 },
    description: 'Filter cho QC công đoạn',
  })
  @Expose()
  @IsOptional()
  @Transform((e) => {
    return e.value ? JSON.parse(e.value) : e.value;
  })
  @Type(() => GetDashboardFinishedItemProgressRequestDto)
  produceStepQcFilter?: GetDashboardFinishedItemProgressRequestDto;

  @ApiProperty({
    example: { qcStageId: 0, orderId: 60, itemId: 296 },
    description: 'Filter cho QC đầu vào/ đầu ra',
  })
  @Expose()
  @IsOptional()
  @Transform((e) => {
    return e.value ? JSON.parse(e.value) : e.value;
  })
  @Type(() => GetDashboardIoQcProgressRequestDto)
  ioQcFilter?: GetDashboardIoQcProgressRequestDto;
}
