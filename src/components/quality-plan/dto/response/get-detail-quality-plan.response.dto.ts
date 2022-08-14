import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { QualityPlanResponseDto } from '@components/quality-plan/dto/response/quality-plan.response.dto';
import { QualityPlanBomResponseDto } from '@components/quality-plan/dto/response/quality-plan-bom.response.dto';

export class GetDetailQualityPlanResponseDto extends QualityPlanResponseDto {
  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  qualityPlanId: number;

  @ApiProperty()
  @Expose()
  moPlan: any;

  @ApiProperty()
  @Expose()
  mo: any;

  @ApiProperty()
  @Expose()
  planBoms: any;

  @ApiProperty()
  @Expose()
  qualityPlanBoms: QualityPlanBomResponseDto[];

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
