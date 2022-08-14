import { Body, Controller, Inject, Query } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ResponsePayload } from '@utils/response-payload';
import { isEmpty } from '@utils/object.util';
import { QualityProgressServiceInterface } from '@components/quality-progress/interface/quality-progress.service.interface';
import { UpdateQcProgressRequestDto } from '@components/quality-progress/dto/request/update-qc-progress.request.dto';
import { QcProgressScanQrRequestDto } from './dto/request/qc-progress-scan-qr.request.dto';
import { ItemBarcodeTypeEnum } from '@components/item/item.constant';
import { TransactionHistoryTypeEnum } from '@components/transaction-history/transaction-history.constant';
import { PermissionCode } from "@core/decorator/get-code.decorator";
import { CREATE_HISTORY_INPUT_QC_PERMISSION } from "@utils/permissions/app/input-qc";
import {
  CREATE_HISTORY_OUTPUT_QC_PERMISSION,
  CREATE_OUTPUT_QC_ERROR_REPORT_PERMISSION
} from "@utils/permissions/app/output-qc";

@Controller('quality-progress')
export class QualityProgressController {
  constructor(
    @Inject('QualityProgressServiceInterface')
    private readonly qualityProgressService: QualityProgressServiceInterface,
  ) {}

  // Scan PO SO PrO
  @MessagePattern('scan_qr_po_quality_progress')
  public async scanQRPOQualityProgress(
    @Body() data: QcProgressScanQrRequestDto,
  ) {
    const { request, responseError } = data;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.type = ItemBarcodeTypeEnum.PO;

    return await this.qualityProgressService.scanQRCode(request);
  }

  @MessagePattern('scan_qr_pro_quality_progress')
  public async scanQRPrOQualityProgress(
    @Body() data: QcProgressScanQrRequestDto,
  ) {
    const { request, responseError } = data;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.type = ItemBarcodeTypeEnum.PRO;

    return await this.qualityProgressService.scanQRCode(request);
  }

  @MessagePattern('scan_qr_so_quality_progress')
  public async scanQRSOQualityProgress(
    @Body() data: QcProgressScanQrRequestDto,
  ) {
    const { request, responseError } = data;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.type = ItemBarcodeTypeEnum.SO;

    return await this.qualityProgressService.scanQRCode(request);
  }

  // Update PO PrO SO
  @PermissionCode(CREATE_HISTORY_INPUT_QC_PERMISSION.code)
  @MessagePattern('update_po_quality_progress')
  public async updatePOQualityProgress(
    @Body() data: UpdateQcProgressRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = data;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.qualityProgressService.update(
      request,
      TransactionHistoryTypeEnum.Purchased,
    );
  }

  @PermissionCode(CREATE_HISTORY_OUTPUT_QC_PERMISSION.code)
  @MessagePattern('update_so_quality_progress')
  public async updateSOQualityProgress(
    @Body() data: UpdateQcProgressRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = data;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.qualityProgressService.update(
      request,
      TransactionHistoryTypeEnum.SaleExport,
    );
  }

  // PrO Import
  @PermissionCode(CREATE_HISTORY_INPUT_QC_PERMISSION.code)
  @MessagePattern('update_input_pro_quality_progress')
  public async updateInputPrOQualityProgress(
    @Body() data: UpdateQcProgressRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = data;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.qualityProgressService.update(
      request,
      TransactionHistoryTypeEnum.ProductionImport,
    );
  }

  // PrO Export
  @PermissionCode(CREATE_HISTORY_OUTPUT_QC_PERMISSION.code)
  @MessagePattern('update_output_pro_quality_progress')
  public async updateOutputPrOQualityProgress(
    @Body() data: UpdateQcProgressRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = data;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.qualityProgressService.update(
      request,
      TransactionHistoryTypeEnum.ProductionExport,
    );
  }
}
