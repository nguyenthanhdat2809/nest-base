import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DetailQualityPlanBomListResponseDto } from '@components/quality-plan/dto/response/detail-quality-plan-bom-list.response.dto';

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}

class MetaData {
  @ApiProperty({ type: [DetailQualityPlanBomListResponseDto], description: "Dữ liệu chi tiết" })
  @Expose()
  data: DetailQualityPlanBomListResponseDto[];

  @ApiProperty({ type: Meta, description: "Phân trang" })
  @Expose()
  meta: Meta;
}

export class ListQualityPlanBomResponseDto extends SuccessResponse {
  @ApiProperty({
    example: {
      items: [
        {
          planErrorRate: '20.00',
          workOrderId: 3017,
          qualityPlanBomQualityPointUsers: [
              {
                  userId: 33
              },
              {
                  userId: 34
              }
          ],
        },
        {
          planErrorRate: '10.00',
          workOrderId: 3018,
          qualityPlanBomQualityPointUsers: [
              {
                  userId: 33
              },
              {
                  userId: 34
              }
          ],
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
