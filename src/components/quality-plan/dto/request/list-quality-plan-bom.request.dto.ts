import { Filter, PaginationQuery, Sort } from '@utils/pagination.query';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class ListQualityPlanBomRequestDto extends PaginationQuery {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['0', '1'])
  isGetAll: string;
}
