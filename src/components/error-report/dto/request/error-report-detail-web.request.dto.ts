import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";
import { Expose } from "class-transformer";
import { BaseDto } from "@core/dto/base.dto";

export class ErrorReportDetailWebRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  id: number;
}