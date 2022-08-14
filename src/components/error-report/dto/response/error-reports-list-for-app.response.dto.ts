import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ErrorReportResponseDto } from "@components/error-report/dto/response/error-report.response.dto";
import { TransactionHistoryWorkOrderResponse } from "@components/transaction-history/dto/response/producing-steps-transaction-history.response.dto";
import { SuccessResponse } from "@utils/success.response.dto";



export class ErrorReportWorkOrderResponseForApp extends TransactionHistoryWorkOrderResponse {}

export class ErrorReportResponseForAppDto extends ErrorReportResponseDto {
  @ApiProperty()
  @Expose()
  @Type(() => ErrorReportWorkOrderResponseForApp)
  workOrder: ErrorReportWorkOrderResponseForApp;
}

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}

class MetaData {
  @Expose()
  data: ErrorReportResponseForAppDto[];

  @Expose()
  meta: Meta;
}

export class ErrorReportsListForAppResponseDto extends SuccessResponse {
  @ApiProperty()
  @Expose()
  data: MetaData;
}
