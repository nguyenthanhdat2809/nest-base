import { ItemPrintQrcodeRequestDto } from "@components/item/dto/request/item-print-qr-code.request.dto";
import { GetItemListRequestDto } from "@components/item/dto/request/get-item-list.request.dto";
import { GetPackageListRequestDto } from "@components/item/dto/request/get-package-list.request.dto";
import { GetBlockListRequestDto } from "@components/item/dto/request/get-block-list.request.dto";

export interface ItemServiceInterface {
  getListByIDs(ids: number[], relation?: string[]): Promise<any>;
  getItemById(id: number);
  scanQRCode(request: any);
  getItemUnitList();
  getItemList(request: GetItemListRequestDto);
  getDetailItemUnit(id: number): Promise<any>;
  getEnvItemInQualityPoint();
  printItemQrCode(request: ItemPrintQrcodeRequestDto): Promise<any>;
  getPackageList(request: GetPackageListRequestDto): Promise<any>;
  getBlockList(request: GetBlockListRequestDto): Promise<any>;
  getItemByConditions(params: any): Promise<any>;
  getItemUnitByIds(
    ids: string,
  ): Promise<any>;
}
