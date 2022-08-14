import { ResponseCodeEnum } from './../../constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ItemServiceInterface } from './interface/item.service.interface';
import { ItemPrintQrcodeRequestDto } from '@components/item/dto/request/item-print-qr-code.request.dto';
import { ResponseBuilder } from '@utils/response-builder';
import { I18nService } from 'nestjs-i18n';
import { GetItemListRequestDto } from '@components/item/dto/request/get-item-list.request.dto';
import { plainToClass } from 'class-transformer';
import { GetItemListResponseDto } from '@components/item/dto/response/get-item-list.response.dto';
import { isEmpty } from 'lodash';
import { PagingResponse } from '@utils/paging.response';
import { GetPackageListRequestDto } from "@components/item/dto/request/get-package-list.request.dto";
import { GetPackageListResponseDto } from "@components/item/dto/response/get-package-list.response.dto";
import { GetBlockListRequestDto } from "@components/item/dto/request/get-block-list.request.dto";
import { GetBlockListResponseDto } from "@components/item/dto/response/get-block-list.response.dto";

@Injectable()
export class ItemService implements ItemServiceInterface {
  constructor(
    @Inject('ITEM_SERVICE_CLIENT')
    private readonly itemServiceClient: ClientProxy,
    private readonly i18n: I18nService,
  ) {}

  async getEnvItemInQualityPoint(): Promise<any> {
    try {
      const response = await this.itemServiceClient
        .send('get_item_list', { isGetAll: '1' })
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return;
      }

      const res = response.data.items.reduce((x, y) => {
        x.push({
          id: y.id,
          code: y.code,
          name: y.name,
          isUsed: false,
        });
        return x;
      }, []);

      return res;
    } catch (err) {
      return;
    }
  }

  async getDetailItemUnit(id: number): Promise<any> {
    try {
      const payload = { id: id };
      const response = await this.itemServiceClient
        .send('get_item_unit_setting_detail', payload)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return;
      }
      return response.data;
    } catch (err) {
      return;
    }
  }

  async getListByIDs(ids: number[], relation?: string[]): Promise<any> {
    try {
      const response = await this.itemServiceClient
        .send('get_items_by_ids', { itemIds: ids, relation })
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response.data;
    } catch (err) {
      return [];
    }
  }

  async getItemList(request: GetItemListRequestDto) {
    try {
      const response = await this.itemServiceClient
        .send('get_item_list', request)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.CANNOT_GET_ITEM_LIST'))
          .build();
      }
      if (isEmpty(response.data?.items)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.ITEM_NOT_FOUND'))
          .build();
      }
      const result = plainToClass(
        GetItemListResponseDto,
        response.data?.items,
        { excludeExtraneousValues: true },
      );
      const count = response.data?.meta?.total;
      return new ResponseBuilder<PagingResponse>({
        items: result,
        meta: {
          total: count,
          page: request.page,
        },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    } catch (err) {
      console.log(err);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CANNOT_GET_ITEM_LIST'))
        .build();
    }
  }

  async getItemUnitList() {
    try {
      const response = await this.itemServiceClient
        .send('get_list_item_unit_setting', {})
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response.data.items;
    } catch (err) {
      return [];
    }
  }

  async getItemById(id: number) {
    try {
      const response = await this.itemServiceClient
        .send('get_item_detail', { id: id })
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return null;
      }
      return response.data;
    } catch (err) {
      return null;
    }
  }

  scanQRCode = async (request: any) =>
    await this.itemServiceClient.send('scan_qr_code', request).toPromise();

  public async printItemQrCode(
    request: ItemPrintQrcodeRequestDto,
  ): Promise<any> {
    try {
      const response = await this.itemServiceClient
        .send('print_qr_code', request)
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.ITEM_QR_CODE_PRINT_ERROR'),
          )
          .build();
      }
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData(response.data)
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.ITEM_QR_CODE_PRINT_ERROR'),
        )
        .build();
    }
  }

  public async getPackageList(request: GetPackageListRequestDto): Promise<any> {
    try {
      const response = await this.itemServiceClient
        .send('get_package_list', request)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.CANNOT_GET_PACKAGE_LIST'),
          )
          .build();
      }
      if (isEmpty(response.data?.items)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.PACKAGE_NOT_FOUND'))
          .build();
      }
      const result = plainToClass(
        GetPackageListResponseDto,
        response.data?.items,
        { excludeExtraneousValues: true },
      );
      const count = response.data?.meta?.total;
      return new ResponseBuilder<PagingResponse>({
        items: result,
        meta: {
          total: count,
          page: request.page,
        },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    } catch (err) {
      console.log(err);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CANNOT_GET_BLOCK_LIST'))
        .build();
    }
  }

  public async getBlockList(request: GetBlockListRequestDto): Promise<any> {
    try {
      const response = await this.itemServiceClient
        .send('get_block_list', request)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.CANNOT_GET_BLOCK_LIST'))
          .build();
      }
      if (isEmpty(response.data?.items)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.BLOCK_NOT_FOUND'))
          .build();
      }
      const result = plainToClass(
        GetBlockListResponseDto,
        response.data?.items,
        { excludeExtraneousValues: true },
      );
      const count = response.data?.meta?.total;
      return new ResponseBuilder<PagingResponse>({
        items: result,
        meta: {
          total: count,
          page: request.page,
        },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    } catch (err) {
      console.log(err);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CANNOT_GET_BLOCK_LIST'))
        .build();
    }
  }

  async getItemByConditions(params: any): Promise<any> {
    try {
      const itemsResponse = await this.itemServiceClient
        .send('get_item_list', params)
        .toPromise();

      if (itemsResponse.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return itemsResponse?.data?.items;
    } catch (err) {
      return [];
    }
  }

  async getItemUnitByIds(
    ids: string,
  ): Promise<any> {
    return await this.itemServiceClient
      .send('get_list_item_unit_setting', {
        filter: [{ column: 'ids', text: ids }]
      })
      .toPromise();
  }
}
