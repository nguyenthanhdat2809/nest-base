import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ErrorReportIOForAppResponseDto } from '@components/error-report/dto/response/error-report-io-for-app.response.dto';

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}

class MetaData {
  @Expose()
  data: ErrorReportIOForAppResponseDto[];

  @Expose()
  meta: Meta;
}

export class ErrorReportListIOForAppResponseDto extends SuccessResponse {
  @ApiProperty({
    example: [
      {
        id: 1,
        codeErrorReport: '0001',
        codeOrder: '0001',
        codeItem: '0001',
        nameItem: 'Ghế Gỗ',
        status: 1,
        createdAt: '2021-07-13 09:13:15.562609+00'
      },
    ],
    description: 'Danh sách phiếu báo cáo lỗi QC đầu ra và đầu vào',
  })
  @Expose()
  data: MetaData;
}
