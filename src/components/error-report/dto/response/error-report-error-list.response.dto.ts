import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Priority } from '@entities/error-report/error-report-error-list.entity';
import { ErrorReportErrorDetailResponseDto } from '@components/error-report/dto/response/error-report-error-detail.response.dto';
import { BaseUserResponseDto } from '@components/user/dto/response/base.user.response.dto';

export class ErrorReportErrorListResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  errorReportStageDetailId: number;

  @ApiProperty()
  @Expose()
  errorReportIoqcDetailId: number;

  @ApiProperty()
  @Expose()
  assignedTo: BaseUserResponseDto;

  @ApiProperty()
  @Expose()
  errorDescription: string;

  @ApiProperty()
  @Expose()
  priority: Priority;

  @ApiProperty()
  @Expose()
  repairDeadline: Date;

  @ApiProperty()
  @Expose()
  errorReportErrorDetails: ErrorReportErrorDetailResponseDto[];
}
