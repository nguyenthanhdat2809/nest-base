import { Expose } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";

export class GetItemListResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  isUsed: any;
}
