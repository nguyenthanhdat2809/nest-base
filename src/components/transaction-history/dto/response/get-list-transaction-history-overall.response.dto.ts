import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SuccessResponse } from '@utils/success.response.dto';
import { TransactionHistoryOverallResponseDto } from '@components/transaction-history/dto/response/transaction-history-overall.response.dto';

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}

class MetaData {
  @Expose()
  data: TransactionHistoryOverallResponseDto[];

  @Expose()
  meta: Meta;
}

export class GetListTransactionHistoryOverallResponseDto extends SuccessResponse {
  @ApiProperty({
    example: {
      items: [
        {
          id: 787,
          code: 'GD787',
          createdAt: '2022-01-04T08:21:10.826Z',
          type: '0',
          order: {
            id: 126,
            code: 'molcImp',
            name: 'Kế hoạch nguyên vật liệu LC- Lệnh sx Bàn Landco',
          },
          item: {
            id: 488,
            code: '02lcnvl',
            name: 'LC- Nguyên vật liệu',
          },
          totalQcTimes: '0',
          formality: '0',
        },
        {
          id: 784,
          code: 'GD784',
          createdAt: '2022-01-04T07:00:32.031Z',
          type: '0',
          order: {
            id: 126,
            code: 'molcImp',
            name: 'Kế hoạch nguyên vật liệu LC- Lệnh sx Bàn Landco',
          },
          item: {
            id: 488,
            code: '02lcnvl',
            name: 'LC- Nguyên vật liệu',
          },
          totalQcTimes: '0',
          formality: '0',
        },
      ],
      meta: {
        total: 12,
        page: 2,
      },
    },
  })
  @Expose()
  data: MetaData;
}
