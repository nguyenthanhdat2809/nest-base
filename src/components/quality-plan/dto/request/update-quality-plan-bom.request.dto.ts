import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { QualityPlanBomRequestDto } from '@components/quality-plan/dto/request/quality-plan-bom-request.dto';

export class UpdateQualityPlanBomRequestDto extends QualityPlanBomRequestDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
