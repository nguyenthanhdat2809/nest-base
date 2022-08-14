import { Body, Controller, Inject } from '@nestjs/common';
import { TransactionHistoryServiceInterface } from '@components/transaction-history/interface/transaction-history.service.interface';
import { WorkOrderServiceInterface } from '@components/work-order/interface/work-order.service.interface';
import { MessagePattern } from '@nestjs/microservices';
import { WOPrintQrcodeRequestDto } from '@components/work-order/dto/request/wo-print-qr-code.request.dto';
import { isEmpty } from '@utils/object.util';
import { GetWoListRequestDto } from '@components/work-order/dto/request/get-wo-list.request.dto';
import { PermissionCode } from "@core/decorator/get-code.decorator";
import { SCAN_QR_CODE_HOME_PERMISSION } from "@utils/permissions/app/home";

@Controller('work-order')
export class WorkOrderController {
  constructor(
    @Inject('WorkOrderServiceInterface')
    private readonly workOrderService: WorkOrderServiceInterface,
  ) {}
  @PermissionCode(SCAN_QR_CODE_HOME_PERMISSION.code)
  @MessagePattern('print_work_order_qr_code')
  public async printQrCode(
    @Body() payload: WOPrintQrcodeRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.workOrderService.printQrCode(request);
  }

  @MessagePattern('get_wo_list_for_qr_code')
  public async getWoList(@Body() payload: GetWoListRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.workOrderService.getWoList(request);
  }
}
