import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ReportQcOperationProductResponseDto } from '@components/report/dto/response/report-qc-operation-product.response.dto';

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}

class MetaData {
  @Expose()
  items: ReportQcOperationProductResponseDto[];

  @Expose()
  meta: Meta;
}

export class GetListReportQcOperationProductResponseDto extends SuccessResponse {
  @ApiProperty({
    example: {
      items: [
        {
          id: 1,
          moName: 'Lệnh Sản Xuất',
          itemName: 'Tên Sản Phẩm',
          routingName: 'Tên qui trình',
          routingVersion_name: 'Tên qui trình',
          producingStepName: 'Tên qui trình',
          planningQuantity: 100,
          actualQuantity: 80,
          totalUnqcQuantity: 50,
          totalQcQuantity: 30,
          totalQcRejectQuantity: 10,
          totalQcRemainingErrors: 10,
          errorReportId: 10
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
