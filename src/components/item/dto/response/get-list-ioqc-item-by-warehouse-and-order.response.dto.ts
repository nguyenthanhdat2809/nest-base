import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IoqcItemByWarehouseAndOrderResponseDto } from '@components/item/dto/response/ioqc-item-by-warehouse-and-order-response.dto';

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}

class MetaData {
  @Expose()
  items: IoqcItemByWarehouseAndOrderResponseDto[];

  @Expose()
  meta: Meta;
}

export class GetListIoqcItemByWarehouseAndOrderResponseDto extends SuccessResponse {
  @ApiProperty({
    example: {
      items: [
        {
          itemId: 2,
          itemName: 'Tên sản phẩm 2',
          itemCode: '00002',
          quantity: 100,
          orderId: 1,
          warehouseId: 1,
        },
        {
          itemId: 1,
          itemName: 'Tên sản phẩm 1',
          itemCode: '00001',
          quantity: 50,
          orderId: 1,
          warehouseId: 1,
        },
      ],
      meta: {
        total: 2,
        page: 1,
      },
    },
  })
  @Expose()
  data: MetaData;
}
