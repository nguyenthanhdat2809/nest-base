import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AlertResponseDto } from '@components/alert/dto/response/alert.response.dto';

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}

class MetaData {
  @Expose()
  data: AlertResponseDto[];

  @Expose()
  meta: Meta;
}

export class GetListAlertResponseDto extends SuccessResponse {
  @ApiProperty({
    example: {
      items: [
        {
          id: 2,
          name: 'Thông báo cải tiến 2',
          code: '00002',
          stage: 2,
          user: {
            userId: 2,
            name: 'Nguyễn Văn B'
          },
          status: 1
        },
        {
          id: 1,
          name: 'Thông báo cải tiến 1',
          code: '00001',
          stage: 1,
          user: {
            userId: 1,
            name: 'Nguyễn Văn A'
          },
          status: 0
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
