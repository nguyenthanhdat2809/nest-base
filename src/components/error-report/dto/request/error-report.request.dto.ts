import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { ERROR_REPORT_CONST } from '@constant/entity.constant';
import {
  ErrorReportStatus,
  QCType,
} from '@entities/error-report/error-report.entity';

export class ErrorReportRequestDto extends BaseDto {
  @ApiProperty({
    example: 'ERreport1',
    description: 'Code of the error report',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(ERROR_REPORT_CONST.ERROR_REPORT.CODE.MAX_LENGTH)
  code: string;

  @ApiProperty({
    example: 'Error report 1',
    description: 'Name of the error report',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(ERROR_REPORT_CONST.ERROR_REPORT.NAME.MAX_LENGTH)
  name: string;

  @ApiProperty({
    example: 8,
    description: 'Id of the QC stage',
  })
  @IsNotEmpty()
  @IsNumber()
  qcStageId: number;

  @ApiProperty({
    example: 'Error report 1',
    description: 'Name of the error report',
  })
  @IsNotEmpty()
  @IsNumber()
  createdBy: number;

  @ApiProperty({
    example: 'Error report 1',
    description: 'Name of the error report',
  })
  @IsEnum(ErrorReportStatus)
  status: number;

  @ApiProperty({
    example: 'Error report 1',
    description: 'Name of the error report',
  })
  @IsNotEmpty()
  @IsEnum(ErrorReportStatus)
  confirmedBy: number;

  @ApiProperty({
    example: 'Error report 1',
    description: 'Name of the error report',
  })
  @IsDateString()
  confirmedAt: Date;

  @ApiProperty({
    example: 'Error report 1',
    description: 'Name of the error report',
  })
  @IsEnum(QCType)
  reportType: number;
}
