import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ErrorGroupResponseDto } from '@components/error-group/dto/response/error-group.response.dto';

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}

class MetaData {
  @Expose()
  data: ErrorGroupResponseDto[];

  @Expose()
  meta: Meta;
}

export class GetListErrorGroupResponseDto extends SuccessResponse {
  @ApiProperty({
    example: {
      items: [
        {
          id: 2,
          name: 'error group 1',
          code: 'ERRgr1',
          description: 'description',
          createdAt: '2021-07-14T02:48:36.864Z',
          updatedAt: '2021-07-14T02:48:36.864Z',
        },
        {
          id: 1,
          name: 'error group 2',
          code: 'ERRgr2',
          description: 'description',
          createdAt: '2021-07-14T02:48:36.864Z',
          updatedAt: '2021-07-14T02:48:36.864Z',
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
