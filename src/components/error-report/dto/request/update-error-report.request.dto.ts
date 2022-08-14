import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Priority } from '@entities/error-report/error-report-error-list.entity';
import { BaseDto } from '@core/dto/base.dto';
import { ERROR_REPORT_CONST } from '@constant/entity.constant';

class ErrorCause {
  @IsNumber()
  errorGroupId: number;

  @IsNumber()
  causeGroupId: number;
}

export class UpdateErrorReportRequestDto extends BaseDto {
  @ApiProperty({
    example: '1',
    description: 'ID of the error report',
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsArray()
  errorCauseMap: ErrorCause[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(
    ERROR_REPORT_CONST.ERROR_REPORT_ERROR_LIST.ERROR_DESCRIPTION.MAX_LENGTH,
  )
  errorDescription: string;

  @ApiProperty()
  @IsEnum(Priority)
  priority: number;

  @ApiProperty()
  @IsNumber()
  assignTo: number;

  @ApiProperty()
  @IsDateString()
  repairDeadline: Date;
}
