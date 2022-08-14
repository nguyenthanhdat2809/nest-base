import { BaseDto } from "@core/dto/base.dto";
import { ApiProperty, ApiResponse } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class GetMoListResponseDto extends BaseDto {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  code: string;
  @ApiProperty()
  @Expose()
  name: string;
}