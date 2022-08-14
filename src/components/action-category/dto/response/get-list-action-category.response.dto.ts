import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ActionCategoryResponseDto } from '@components/action-category/dto/response/action-category.response.dto';

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}

class MetaData {
  @Expose()
  data: ActionCategoryResponseDto[];

  @Expose()
  meta: Meta;
}

export class GetListActionCategoryResponseDto extends SuccessResponse {
  @ApiProperty({
    example: {
      items: [
        {
          id: 2,
          name: 'Đối sách 2',
          code: '00002',
          description: 'Mô tả',
          createdAt: '2021-07-14T02:48:36.864Z',
          updatedAt: '2021-07-14T02:48:36.864Z',
        },
        {
          id: 1,
          name: 'Đối sách 1',
          code: '00001',
          description: 'Mô tả',
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
