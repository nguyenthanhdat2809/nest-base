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
import { OrderTypeProductionOrderEnum } from '@components/sale/sale.constant';

export class GetListQcTransactionInitDataRequestDto extends PaginationQuery {
  type?: number;
  user?: any;
}
