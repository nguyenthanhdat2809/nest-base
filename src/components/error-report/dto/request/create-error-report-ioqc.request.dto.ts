import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, MaxLength, ValidateNested, IsOptional } from "class-validator";
import { ERROR_REPORT_CONST } from '@constant/entity.constant';
import { Priority } from '@entities/error-report/error-report-error-list.entity';

class CreateErrorReportErrorGroupRequestDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  qcRejectQuantity: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  causeGroupId: number;
}

export class CreateErrorReportIOqcRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @MaxLength(ERROR_REPORT_CONST.ERROR_REPORT.NAME.MAX_LENGTH)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1, description: 'ID tiêu chí' })
  @Expose()
  @IsNotEmpty()
  qcCriteriaId: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  createdByUserId: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  transactionHistoryId: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  warehouseId: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  itemId: number;

  @ApiProperty()
  @Expose()
  @IsOptional()
  customerId: number;

  @ApiProperty()
  @Expose()
  @IsOptional()
  vendorId: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  receivedUserId: number;

  @ApiProperty()
  @Expose()
  @MaxLength(
    ERROR_REPORT_CONST.ERROR_REPORT_ERROR_LIST.ERROR_DESCRIPTION.MAX_LENGTH,
  )
  errorDescription: string;

  @ApiProperty()
  @Expose()
  @IsEnum(Priority)
  @IsNotEmpty()
  priority: number;

  @ApiProperty()
  @Expose()
  repairDeadline: Date;

  @ApiProperty()
  @Expose()
  @Type(() => CreateErrorReportErrorGroupRequestDto)
  @ValidateNested()
  errorGroups: CreateErrorReportErrorGroupRequestDto[];
}
