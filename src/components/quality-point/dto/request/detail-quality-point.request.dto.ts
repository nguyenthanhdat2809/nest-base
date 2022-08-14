import { BaseDto } from "@core/dto/base.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";
import { Expose } from "class-transformer";

export class DetailQualityPointRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  id: number;
}