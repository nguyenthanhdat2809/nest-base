import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class BaseCheckListDetailRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  id: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  qcPassQuantity: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  qcRejectQuantity: number;
}