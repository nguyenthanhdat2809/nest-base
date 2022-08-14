import { PaginationQuery } from '@utils/pagination.query';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Allow,
  IsOptional,
  IsString,
  IsEnum,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { EnumSort } from '@utils/common';
import { BaseDto } from '@core/dto/base.dto';

class Filter {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  column: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  text: string;
}
export class GetListQcTransactionInitDataForWebRequestDto extends BaseDto {
  @Allow()
  @Transform((value) => {
    return Number(value.value) || 1;
  })
  @ApiProperty({
    type: Number,
  })
  page?: number;

  @Allow()
  @ApiProperty({
    type: Number,
  })
  limit?: number;

  @ApiPropertyOptional(
    {
      example: 'Tên XXX',
      description: 'Tìm kiếm theo Mã Phiếu or Mã Sản Phẩm or Mã Lệnh'
    }
  )
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    example: [{ columm: 'name', text: 'abc' }],
    description: '',
  })
  @IsOptional()
  @IsArray()
  @Type(() => Filter)
  filter?: Filter[];

  get take(): number {
    const limit = Number(this.limit) || 10;

    return limit > 0 && limit <= 200 ? limit : 10;
  }

  get skip(): number {
    const page = (Number(this.page) || 1) - 1;

    return (page < 0 ? 0 : page) * this.take;
  }
}
