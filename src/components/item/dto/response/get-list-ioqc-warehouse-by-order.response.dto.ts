import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IoqcWarehouseByOrderResponseDto } from '@components/item/dto/response/ioqc-warehouse-by-order.response.dto';

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}

class MetaData {
  @Expose()
  items: IoqcWarehouseByOrderResponseDto[];

  @Expose()
  meta: Meta;
}

export class GetListIoqcWarehouseByOrderResponseDto extends SuccessResponse {
  @ApiProperty({
    example: {
      items: [
        {
          order: {
            id: 27,
            name: 'Xuất kho',
            code: 'PrOxuat',
            deadline: '2021-10-01T02:01:30.577Z',
          },
          warehouse: {
            id: 17,
            name: 'Kho sắt',
            code: '6547',
          },
          factory: {
            id: 18,
            name: 'Nhà máy kim cương',
          },
          user: {
            id: 1,
            name: 'admin',
            code: '000000001',
          },
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
