import { IsInt, IsNotEmpty } from "class-validator";
import { BaseDto } from "@core/dto/base.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class QualityPlanGetDetailSoRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  id: number;
}