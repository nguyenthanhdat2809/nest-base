import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { BaseDto } from "@core/dto/base.dto";
import { PaginationQuery } from "@utils/pagination.query";
import { IsInt, IsNotEmpty } from "class-validator";

export class GetMoItemDetailRequestDto extends PaginationQuery {
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  id: number;
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  planId: number;
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  itemMoId: number;
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  user: any;
}