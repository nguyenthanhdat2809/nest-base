import { ErrorReportResponseDto } from '@components/error-report/dto/response/error-report.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ErrorReportStageDetailResponseDto } from '@components/error-report/dto/response/error-report-stage-detail.response.dto';
import { ErrorReportErrorListResponseDto } from '@components/error-report/dto/response/error-report-error-list.response.dto';
import { ErrorReportIoqcDetailResponseDto } from '@components/error-report/dto/response/error-report-ioqc-detail.response.dto';

export class ErrorReportDetailResponseDto extends ErrorReportResponseDto {
  @ApiProperty()
  @Expose()
  errorReportStageDetail: ErrorReportStageDetailResponseDto;

  @ApiProperty()
  @Expose()
  errorReportIoqcDetail: ErrorReportIoqcDetailResponseDto;

  @ApiProperty()
  @Expose()
  errorReportErrorList: ErrorReportErrorListResponseDto;
}
