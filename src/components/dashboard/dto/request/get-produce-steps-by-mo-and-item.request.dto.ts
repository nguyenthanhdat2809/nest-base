import { BaseDto } from "@core/dto/base.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";
import { Expose } from "class-transformer";

export class GetProduceStepsByMoAndItemRequestDto extends BaseDto {
  @ApiProperty({ example: 1, description: 'Id của MO' })
  @Expose()
  @IsInt()
  @IsNotEmpty()
  moId: number;
  @ApiProperty({ example: 1, description: 'Id của item' })
  @Expose()
  @IsInt()
  @IsNotEmpty()
  itemId: number;
}