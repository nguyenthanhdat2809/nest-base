import { Filter, PaginationQuery, Sort } from '@utils/pagination.query';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsNumber, IsNotEmpty, IsInt } from "class-validator";
import { Type } from 'class-transformer';
import { BaseDto } from '@core/dto/base.dto';

export class QualityPlanListRequestDto extends PaginationQuery {
  @ApiPropertyOptional({ example: 'company', description: '' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    example: [{ column: 'name', text: 'abc' }],
    description: '',
  })
  @IsOptional()
  @IsArray()
  @Type(() => Filter)
  filter?: Filter[];

  @ApiPropertyOptional({
    example: [{ column: 'name', order: 'DESC' }],
    description: '',
  })
  @Type(() => Sort)
  @IsArray()
  @IsOptional()
  sort?: Sort[];

  @IsOptional()
  user?: any;
}

export class QualityPlanQcWcRequestDto extends BaseDto{
  @ApiPropertyOptional({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiPropertyOptional({ example: 'ABC' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  user: any;
}
