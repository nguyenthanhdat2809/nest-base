import { UpdateWoMaterialInputQcQuantityRequestDto } from "@components/produce/dto/request/update-wo-material-input-qc-quantity.request.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";
import { Expose } from "class-transformer";

export class UpdateWoPreviousBomInputQcQuantityRequestDto extends UpdateWoMaterialInputQcQuantityRequestDto {
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  id: number;
}
