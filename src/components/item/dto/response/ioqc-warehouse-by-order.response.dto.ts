import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Type } from 'class-transformer';

class Order {
  @ApiProperty({ description: 'ID SO' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Tên SO' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Mã SO' })
  @Expose()
  code: string;

  @ApiProperty({ description: 'Ngày thực hiện' })
  @Expose()
  deadline: string;
}

class Warehouse {
  @ApiProperty({ description: 'ID Kho' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Tên Kho' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Mã Kho' })
  @Expose()
  code: string;
}

class Factory {
  @ApiProperty({ description: 'ID Công Ty' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Tên Công Ty' })
  @Expose()
  name: string;
}

class User {
  @ApiProperty({ description: 'ID Người Thực Hiện' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Tên Người Thực Hiện' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Mã Người Thực Hiện' })
  @Expose()
  code: string;
}

export class IoqcWarehouseByOrderResponseDto {
  @ApiProperty({ type: Order })
  @Expose()
  @Type(() => Order)
  order: Order;

  @ApiProperty({ type: Warehouse })
  @Expose()
  @Type(() => Warehouse)
  warehouse: Warehouse;

  @ApiProperty({ type: Factory })
  @Expose()
  @Type(() => Factory)
  factory: Factory;

  @ApiProperty({ type: User })
  @Expose()
  @Type(() => User)
  user: User;
}
