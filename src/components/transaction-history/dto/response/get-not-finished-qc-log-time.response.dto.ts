import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class GetNotFinishedQcLogTimeResponseDto {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  status: number;
}
