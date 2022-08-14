import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BoqPlanResponseDto } from '@components/produce/dto/response/boq-plan.response.dto';

export class BoqResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  boqPlan: BoqPlanResponseDto;
}
