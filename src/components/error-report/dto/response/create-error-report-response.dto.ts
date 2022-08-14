import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { BaseDto } from "@core/dto/base.dto";

export class CreateErrorReportResponseDto extends BaseDto {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  name: string;
  @ApiProperty()
  @Expose()
  code: string;
  @ApiProperty()
  @Expose()
  logTimeId: number;
}