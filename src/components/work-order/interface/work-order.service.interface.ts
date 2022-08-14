import { WOPrintQrcodeRequestDto } from "@components/work-order/dto/request/wo-print-qr-code.request.dto";
import { GetWoListRequestDto } from "@components/work-order/dto/request/get-wo-list.request.dto";

export interface WorkOrderServiceInterface {
  printQrCode(payload: WOPrintQrcodeRequestDto): Promise<any>;
  getWoList(request: GetWoListRequestDto): Promise<any>;
}
