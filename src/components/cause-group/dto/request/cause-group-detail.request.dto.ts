import { IsInt, IsNotEmpty } from "class-validator";
import { BaseDto } from "@core/dto/base.dto";

export class CauseGroupDetailRequestDto extends BaseDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
}