import { BaseDto } from "@core/dto/base.dto";
import { IsInt, IsNotEmpty } from "class-validator";

export class CauseGroupDeleteRequestDto extends BaseDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  user: any;
}