import { BaseDto } from './../../../../core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetDashboardFinishedItemProgressRequestDto extends BaseDto {
  @ApiProperty({ example: 1, description: 'Id của Mo' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  moId: number;

  @ApiProperty({ example: 1, description: 'Id của item' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  itemId: number;

  @ApiProperty({ example: 1, description: 'Id của công đoạn' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  producingStepId: number;
}
