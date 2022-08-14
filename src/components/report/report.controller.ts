import { MessagePattern } from '@nestjs/microservices';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Body, Controller, Inject, Req } from '@nestjs/common';
import { ResponsePayload } from '@utils/response-payload';
import { isEmpty } from 'lodash';
import { ReportServiceInterface } from '@components/report/interface/report.service.interface';
import { ReportQcRequestDto } from '@components/report/dto/request/report-qc.request.dto';
import { GetListReportQcOperationProductResponseDto } from '@components/report/dto/response/get-list-report-qc-operation-product.response.dto';
import { TypeReport } from '@components/report/report.constant';
import { PermissionCode } from "@core/decorator/get-code.decorator";
import { EXPORT_REPORT_PERMISSION, VIEW_REPORT_PERMISSION } from "@utils/permissions/web/report";

@Controller('Report')
export class ReportController {
  constructor(
    @Inject('ReportServiceInterface')
    private readonly reportService: ReportServiceInterface,
  ) {}

  @PermissionCode(VIEW_REPORT_PERMISSION.code)
  @MessagePattern('get_list_report_qc_operation_product')
  public async getListReportQcOperationProduct(
    @Body() payload: ReportQcRequestDto,
  ): Promise<
    ResponsePayload<GetListReportQcOperationProductResponseDto | any>
  > {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.reportService.getListReportQcOperationProduct(request);
  }

  @PermissionCode(VIEW_REPORT_PERMISSION.code)
  @MessagePattern('get_list_report_qc_input')
  public async getListReportQcInput(
    @Body() payload: ReportQcRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.reportService.getListReportIOqc(
      request,
      TypeReport.INPUT
    );
  }

  @PermissionCode(VIEW_REPORT_PERMISSION.code)
  @MessagePattern('get_list_report_qc_output')
  public async getListReportQcOutput(
    @Body() payload: ReportQcRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.reportService.getListReportIOqc(
      request,
      TypeReport.OUTPUT
    );
  }

  // Export CSV
  @PermissionCode(EXPORT_REPORT_PERMISSION.code)
  @MessagePattern('export_report_qc_operation_product')
  public async exportReportQcOperationProduct(
    @Body() payload: ReportQcRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.reportService.exportReportQcOperationProduct(request);
  }

  @PermissionCode(VIEW_REPORT_PERMISSION.code)
  @MessagePattern('get_list_report_qc_input_export')
  public async getListReportQcInputExport(
    @Body() payload: ReportQcRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.reportService.getListReportIOqc(
      request,
      TypeReport.INPUT,
      true
    );
  }

  @PermissionCode(VIEW_REPORT_PERMISSION.code)
  @MessagePattern('get_list_report_qc_output_export')
  public async getListReportQcOutputExport(
    @Body() payload: ReportQcRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.reportService.getListReportIOqc(
      request,
      TypeReport.OUTPUT,
      true
    );
  }
}
