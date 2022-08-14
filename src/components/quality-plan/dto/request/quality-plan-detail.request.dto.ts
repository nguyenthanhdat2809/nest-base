import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";
import { BaseDto } from "@core/dto/base.dto";
import { Expose } from "class-transformer";

export class QualityPlanDetailRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
