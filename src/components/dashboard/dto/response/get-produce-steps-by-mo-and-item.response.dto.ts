import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class GetProduceStepsByMoAndItemResponseDto {
  @ApiProperty({ example: 1, description: 'Id của công đoạn' })
  @Expose()
  id: number;
  @ApiProperty({ example: 'abc', description: 'Tên của công đoạn' })
  @Expose()
  name: string;
}