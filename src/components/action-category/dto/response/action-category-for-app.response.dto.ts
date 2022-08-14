import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class ActionCategoryForAppResponseDto {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  name: string;
  @ApiProperty()
  @Expose()
  code: string;
}