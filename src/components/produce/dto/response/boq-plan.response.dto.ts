import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { QualityPlanBomResponseDto } from '@components/quality-plan/dto/response/quality-plan-bom.response.dto';

export class BoqPlanResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  planFrom: Date;

  @ApiProperty()
  @Expose()
  planTo: Date;

  @ApiProperty()
  @Expose()
  boqPlanBoms: QualityPlanBomResponseDto;
}
