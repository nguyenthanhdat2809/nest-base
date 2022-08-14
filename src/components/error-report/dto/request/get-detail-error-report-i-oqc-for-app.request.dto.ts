import { BaseDto } from "@core/dto/base.dto";
import { IsInt, IsNotEmpty } from "class-validator";

export class GetDetailErrorReportIOqcForAppRequestDto extends BaseDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
}