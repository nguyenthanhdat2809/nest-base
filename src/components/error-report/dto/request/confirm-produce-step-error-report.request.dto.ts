import { BaseDto } from "@core/dto/base.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class ConfirmProduceStepErrorReportRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  id: number;
  @ApiProperty()
  @ApiProperty()
  @Expose()
  confirmedBy: number;
}