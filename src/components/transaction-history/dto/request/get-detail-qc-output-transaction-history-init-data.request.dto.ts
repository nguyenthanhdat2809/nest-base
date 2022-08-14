import { BaseDto } from "@core/dto/base.dto";
import { IsInt, IsNotEmpty } from "class-validator";

export class GetDetailQcOutputTransactionInitDataRequestDto extends BaseDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
