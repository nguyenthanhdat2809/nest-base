import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class GetItemsByMoResponseDto {
  @ApiProperty({ example: 1, description: 'Id của item' })
  @Expose()
  id: number;
  @ApiProperty({ example: 'abc', description: 'Tên của item' })
  @Expose()
  name: string;
}