import { BaseDto } from "@core/dto/base.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Expose } from "class-transformer";

export class QualityPointsByIds extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  ids: number[];
}