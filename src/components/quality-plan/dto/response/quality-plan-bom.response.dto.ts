import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

class ProducingStepResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

class WorkOrderResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

class QualityPointResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

class QualityPointUser1ResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  username: string;
}

export class QualityPlanBomResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  producingStep: ProducingStepResponseDto;

  @ApiProperty()
  @Expose()
  errorReportIds: number[];

  @ApiProperty()
  @Expose()
  workOrder: WorkOrderResponseDto;

  @ApiProperty()
  @Expose()
  isQC: boolean;

  @ApiProperty()
  @Expose()
  qualityPoint: QualityPointResponseDto;

  @ApiProperty()
  @Expose()
  qualityPointUser: QualityPointUser1ResponseDto;

  @ApiProperty()
  @Expose()
  planFrom: Date;

  @ApiProperty()
  @Expose()
  planTo: Date;

  @ApiProperty()
  @Expose()
  planErrorRate: number;

  @ApiProperty()
  @Expose()
  needQCQuantity: number;

  @ApiProperty()
  @Expose()
  planQCQuantity: number;

  @ApiProperty()
  @Expose()
  passedQCQuantity: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
