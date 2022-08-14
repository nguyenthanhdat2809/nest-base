import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CheckListResponseDto } from '@components/check-list/dto/response/check-list.response.dto';
import { SuccessResponse } from '@utils/success.response.dto';

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}
export class MetaData {
  @Expose()
  data: CheckListResponseDto[];

  @Expose()
  meta: Meta;
}

export class CheckListAllResponseDto extends SuccessResponse {
  @ApiProperty({
    example: {
      items: [
        {
          id: 1,
          name: 'GetListQuality 1',
          code: 'ABCDE 1',
          createdAt: '2021-07-14T02:48:36.864Z',
          updatedAt: '2021-07-14T02:48:36.864Z',
        },
        {
          id: 2,
          name: 'GetListQuality 2',
          code: 'ABCDE 2',
          createdAt: '2021-07-14T02:48:36.864Z',
          updatedAt: '2021-07-14T02:48:36.864Z',
        },
      ],
      meta: {
        total: 3,
        page: 1,
      },
    },
  })
  @Expose()
  data: MetaData;
}
