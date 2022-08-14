import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IoqcOrderResponseDto } from '@components/item/dto/response/ioqc-order.response.dto';

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}

class MetaData {
  @Expose()
  items: IoqcOrderResponseDto[];

  @Expose()
  meta: Meta;
}

export class GetListIoqcOrderResponseDto extends SuccessResponse {
  @ApiProperty({
    example: {
      items: [
        {
          id: 2,
          name: 'Tên Lệnh 2',
          code: '00002',
          deadline: '2020-02-02',
        },
        {
          id: 1,
          name: 'Tên Lệnh 1',
          code: '00001',
          deadline: '2020-02-02',
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
