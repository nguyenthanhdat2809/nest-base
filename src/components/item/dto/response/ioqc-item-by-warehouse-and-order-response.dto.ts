import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class IoqcItemByWarehouseAndOrderResponseDto {
  @ApiProperty({ description: 'ID Lệnh' })
  @Expose()
  orderId: number;

  @ApiProperty({ description: 'ID Kho' })
  @Expose()
  warehouseId: number;

  @ApiProperty({ description: 'ID sản phẩm' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Tên sản phẩm' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Mã sản phẩm' })
  @Expose()
  code: string;

  @ApiProperty({ description: 'Số lượng ...' })
  @Expose()
  quantity: number;

  @ApiProperty({ description: 'Số lượng kế hoạch' })
  @Expose()
  planQuantity: number;

  @ApiProperty({ description: 'Số lượng ...' })
  @Expose()
  actualQuantity: number;
}
