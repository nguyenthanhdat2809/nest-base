import { IsEnum, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { BaseDto } from "@core/dto/base.dto";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { PaginationQuery } from "@utils/pagination.query";

export class GetPlanItemMoListRequestDto extends PaginationQuery {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsEnum(['0', '1'])
  onlyInProgressItem: string;
}
