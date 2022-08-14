import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ErrorReportStageDetailResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  itemName: string;

  @ApiProperty()
  @Expose()
  routingName: string;

  @ApiProperty()
  @Expose()
  moName: string;

  @ApiProperty()
  @Expose()
  moCode: string;

  @ApiProperty()
  @Expose()
  producingStepName: string;
}
