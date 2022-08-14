import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class ItemDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

export class IoqcTransactionHistoryResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty({ description: 'Sản phẩm', type: [ItemDto], isArray: true })
  @Expose()
  @Type(() => ItemDto)
  item: ItemDto;

  @ApiProperty({ description: 'Ngày s/x' })
  @Expose()
  createdAt: Date;
}
