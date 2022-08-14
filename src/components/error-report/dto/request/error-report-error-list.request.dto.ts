import { Priority } from "@entities/error-report/error-report-error-list.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class ErrorReportErrorListRequestDto {
  @ApiProperty()
  @Expose()
  errorReportStageDetailId: number;
  @ApiProperty()
  @Expose()
  errorReportIoqcDetailId: number;
  @ApiProperty()
  @Expose()
  assignedTo: number;
  @ApiProperty()
  @Expose()
  errorDescription: string;
  @ApiProperty()
  @Expose()
  priority: Priority;
  @ApiProperty()
  @Expose()
  repairDeadline: Date;
}
