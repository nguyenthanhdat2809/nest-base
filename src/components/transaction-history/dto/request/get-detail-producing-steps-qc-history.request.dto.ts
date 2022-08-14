import { IsInt, IsNotEmpty } from "class-validator";
import { BaseDto } from "@core/dto/base.dto";

export class GetDetailProducingStepsQcHistoryRequestDto extends BaseDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
