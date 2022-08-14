import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class GetInProgressMoResponseDto {
  @ApiProperty({ example: 1, description: 'Id của MO' })
  @Expose()
  id: number;

  @ApiProperty({ example: '123', description: 'Tên của MO' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'MO001', description: 'Mã của MO' })
  @Expose()
  code: string;
}
