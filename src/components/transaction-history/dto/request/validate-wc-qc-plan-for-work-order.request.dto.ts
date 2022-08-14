import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { BaseDto } from "@core/dto/base.dto";

export class ValidateWcQcPlanForWorkOrderRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  workOrderId: number;
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  workCenterId: number;
}