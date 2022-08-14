import { IsInt, IsNotEmpty } from "class-validator";
import { BaseDto } from "@core/dto/base.dto";

export class ProducingStepErrorReportDetailForAppRequestDto extends BaseDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
}