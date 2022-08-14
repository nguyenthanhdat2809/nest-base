import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ErrorReportResponseDto } from '@components/error-report/dto/response/error-report.response.dto';

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}

class MetaData {
  @Expose()
  data: ErrorReportResponseDto[];

  @Expose()
  meta: Meta;
}

export class ErrorReportListResponseDto extends SuccessResponse {
  @ApiProperty()
  @Expose()
  data: MetaData;
}
