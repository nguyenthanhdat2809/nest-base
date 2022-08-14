import { QualityPlanRequestDto } from '@components/quality-plan/dto/request/quality-plan.request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from "class-validator";

export class UpdateQualityPlanRequestDto extends QualityPlanRequestDto {
  @ApiProperty()
  @IsInt()
  id: number;
  @IsNotEmpty()
  user: any;
}
