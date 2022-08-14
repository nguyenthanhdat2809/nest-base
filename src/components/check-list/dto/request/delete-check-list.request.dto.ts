import { BaseDto } from "@core/dto/base.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";
import { Expose } from "class-transformer";

export class DeleteCheckListRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  id: number;
  
  @IsNotEmpty()
  user: any;
}