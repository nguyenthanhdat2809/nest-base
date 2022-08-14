import { Body, Controller, Inject } from "@nestjs/common";
import { ItemServiceInterface } from '@components/item/interface/item.service.interface';
import { MessagePattern } from '@nestjs/microservices';
import { ItemPrintQrcodeRequestDto } from '@components/item/dto/request/item-print-qr-code.request.dto';
import { isEmpty } from '@utils/object.util';
import { GetItemListRequestDto } from "@components/item/dto/request/get-item-list.request.dto";
import { GetPackageListRequestDto } from "@components/item/dto/request/get-package-list.request.dto";
import { GetBlockListRequestDto } from "@components/item/dto/request/get-block-list.request.dto";

@Controller('item')
export class ItemController {
  constructor(
    @Inject('ItemServiceInterface')
    private readonly itemService: ItemServiceInterface,
  ) {}
  @MessagePattern('print_item_qr_code')
  public async printQrCode(
    @Body() payload: ItemPrintQrcodeRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.itemService.printItemQrCode(request);
  }
  @MessagePattern('get_item_list_for_qr_code')
  public async getItemList(
    @Body() payload: GetItemListRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.itemService.getItemList(request);
  }
  @MessagePattern('get_package_list_for_qr_code')
  public async getPackageList(
    @Body() payload: GetPackageListRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.itemService.getPackageList(request);
  }

  @MessagePattern('get_block_list_for_qr_code')
  public async getBlockList(
    @Body() payload: GetBlockListRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.itemService.getBlockList(request);
  }
}
