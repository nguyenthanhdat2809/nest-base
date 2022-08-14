import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ErrorReportStageDetailRequestDto {
  @ApiProperty()
  @Expose()
  errorReportId: number;

  @ApiProperty()
  @Expose()
  itemId: number;

  @ApiProperty()
  @Expose()
  moId: number;

  @ApiProperty()
  @Expose()
  routingId: number;

  @ApiProperty()
  @Expose()
  producingStepId: number;

  @ApiProperty()
  @Expose()
  moDetailId: number;

  @ApiProperty()
  workOrderId: number;
}
