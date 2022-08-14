import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class Order {
  @ApiProperty()
  @Expose()
  id: string;
  @ApiProperty()
  @Expose()
  code: string;
  @ApiProperty()
  @Expose()
  name: string;
}

class Item {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  code: string;
  @ApiProperty()
  @Expose()
  name: string;
}

export class TransactionHistoryOverallResponseDto {
  @ApiProperty({ example: 1, description: 'Id' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'abcd1234', description: 'code GD' })
  @Expose()
  code: string;

  @ApiProperty({ example: '2022-01-07T03:31:24.423Z', description: 'Ngày tạo' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '0', description: 'Loại GD' })
  @Expose()
  type: number;

  @ApiProperty({
    example: {
      id: 126,
      code: 'molcImp',
      name: 'Kế hoạch nguyên vật liệu LC- Lệnh sx Bàn Landco',
    },
    description: 'Thông tin lệnh',
  })
  @Expose()
  @Type(() => Order)
  order: Order;

  @ApiProperty({
    example: {
      id: 488,
      code: '02lcnvl',
      name: 'LC- Nguyên vật liệu',
    },
    description: 'Thông tin sản phẩm',
  })
  @Expose()
  @Type(() => Item)
  item: Item;

  @ApiProperty({ example: 1, description: 'Lần QC' })
  @Expose()
  numberOfTimeQc: number;

  @ApiProperty({ example: 1, description: 'Loại QC - 0: 1 lần, 1: 2 lần' })
  @Expose()
  numberOfTime: number;

  @ApiProperty({
    example: 1,
    description: 'Hình thức QC - 0: toàn bộ, 1: ngẫu nhiên',
  })
  @Expose()
  formality: number;
}
