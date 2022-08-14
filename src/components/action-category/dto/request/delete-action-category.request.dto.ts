import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";
import { BaseDto } from "@core/dto/base.dto";
import { Expose } from "class-transformer";

export class DeleteActionCategoryRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  user: any;
}