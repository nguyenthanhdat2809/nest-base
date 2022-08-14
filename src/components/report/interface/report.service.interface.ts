import { ResponsePayload } from '@utils/response-payload';
import { SuccessResponse } from '@utils/success.response.dto';
import { ReportQcRequestDto } from '@components/report/dto/request/report-qc.request.dto';
import { GetListReportQcOperationProductResponseDto } from '@components/report/dto/response/get-list-report-qc-operation-product.response.dto';

export interface ReportServiceInterface {
  getListReportQcOperationProduct(
    request: ReportQcRequestDto,
  ): Promise<ResponsePayload<GetListReportQcOperationProductResponseDto | any>>;
  getListReportIOqc(
    request: ReportQcRequestDto,
    type: number,
    isExport?: boolean,
  ): Promise<any>
  exportReportQcOperationProduct(
    request: ReportQcRequestDto,
  ): Promise<ResponsePayload<any>>
}
