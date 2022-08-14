import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EnumSort, escapeCharForSearch } from './common';
import { SelectQueryBuilder } from 'typeorm';
import { isEmpty } from 'lodash';
import { BASE_ENTITY_CONST } from '@constant/entity.constant';
import { APP_CONST } from '@constant/common';
import { dateFormat } from '@utils/object.util';

export class Sort {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  column: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EnumSort)
  order: any;
}

export class Filter {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  column: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  text: string;
}

export class PaginationQuery extends BaseDto {
  @Allow()
  @Transform((value) => {
    return Number(value.value) || 1;
  })
  page?: number;

  @Allow()
  limit?: number;

  @ApiPropertyOptional({ example: 'factory', description: '' })
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

  @ApiPropertyOptional({
    example: [{ columm: 'name', order: 'DESC' }],
    description: '',
  })
  @Type(() => Sort)
  @IsArray()
  @IsOptional()
  sort?: Sort[];

  get take(): number {
    const limit = Number(this.limit) || 10;

    return limit > 0 && limit <= 200 ? limit : 10;
  }

  get skip(): number {
    const page = (Number(this.page) || 1) - 1;

    return (page < 0 ? 0 : page) * this.take;
  }

  public async buildSearchFilterQuery<T>(
    query: SelectQueryBuilder<T>,
    fieldMap: Map<string, string>,
  ): Promise<SelectQueryBuilder<T>> {
    const filter = this.filter;
    const sort = this.sort;
    const alias = query.alias;

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        const columnName = item.column.toLowerCase();
        const columnValue = item.text.trim();
        const createdAtColName =
          BASE_ENTITY_CONST.CREATED_AT.COL_NAME.toLowerCase();
        const updatedAtColName =
          BASE_ENTITY_CONST.UPDATED_AT.COL_NAME.toLowerCase();
        const idColName = BASE_ENTITY_CONST.ID.COL_NAME.toLowerCase();

        const dbColumnName = fieldMap.get(columnName)?.toLowerCase();
        const filterColumnName = dbColumnName ? dbColumnName : columnName;

        if (columnName == createdAtColName) {
          const dateFilter = columnValue.split(APP_CONST.DATE_FILTER_SEPARATOR);
          const dateFrom = dateFilter[0];
          const dateTo = dateFilter[1];

          query = query.andWhere(
              `"${alias}".created_at between :dateFrom AND :dateTo`,
              {
                dateFrom: dateFrom,
                dateTo: dateTo,
              },
            );
        } else if (columnName === idColName) {
          const ids = columnValue.slice(1, -1);
          if (ids.length > 0)
            query.andWhere(`"${alias}".${filterColumnName} IN (${ids})`);
        } else if (columnName == "code" || columnName == "name" || columnName == "description"){
          query = query.andWhere(
            `LOWER("${alias}".${filterColumnName}) LIKE LOWER(:${filterColumnName}) escape '\\'`,
            {
              [filterColumnName]: `%${escapeCharForSearch(columnValue)}%`,
            },
          );
        } else if (columnName == "status"){
          query.andWhere(`"${alias}".${filterColumnName} IN (:...${filterColumnName})`, {
            [filterColumnName]: columnValue.split(','),
          });
        }
      });
    }

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        switch (item.column) {
          case 'code':
            query = query.orderBy('"code"', item.order);
            break;
          case 'name':
            query = query.orderBy('"name"', item.order);
            break;
          case 'description':
            query = query.orderBy('"description"', item.order);
            break;
          case 'createdAt':
            query = query.orderBy('"created_at"', item.order);
            break;
          case 'status':
            query = query.orderBy('"status"', item.order);
            break;
          default:
            break;
        }
      });
    } else {
      query = query.orderBy(`${alias}.id`, 'DESC');
    }

    return query;
  }
}
