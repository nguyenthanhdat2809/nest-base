import { BaseDto } from "@core/dto/base.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PaginationQuery } from "@utils/pagination.query";
import { Type } from "class-transformer";

export class Filter {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  column: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  text: any;
}

export class GetMoListRequestDto extends PaginationQuery {
  @ApiPropertyOptional({
    example: [{ columm: 'name', text: 'abc' }],
    description: '',
  })
  @IsOptional()
  @IsArray()
  @Type(() => Filter)
  filter?: Filter[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['0', '1'])
  isGetAll: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['0', '1'])
  isPlanning: string;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  user: any;
}