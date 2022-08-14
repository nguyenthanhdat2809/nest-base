import { WorkOrderServiceInterface } from '@components/work-order/interface/work-order.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ProduceServiceInterface } from '@components/produce/interface/produce.service.interface';
import { I18nService } from 'nestjs-i18n';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { WOPrintQrcodeRequestDto } from '@components/work-order/dto/request/wo-print-qr-code.request.dto';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { GetWoListRequestDto } from '@components/work-order/dto/request/get-wo-list.request.dto';
import { plainToClass } from 'class-transformer';
import { GetWoListResponseDto } from '@components/work-order/dto/response/get-wo-list.response.dto';
import { isEmpty } from 'lodash';
import { PagingResponse } from '@utils/paging.response';

@Injectable()
export class WorkOrderService implements WorkOrderServiceInterface {
  constructor(
    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceServiceInterface,
    @InjectConnection()
    private readonly connection: Connection,
    private readonly i18n: I18nService,
  ) {}
  public async printQrCode(payload: WOPrintQrcodeRequestDto): Promise<any> {
    const response = await this.produceService.printWOQrCode(payload);
    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.WO_QR_CODE_PRINT_ERROR'))
        .build();
    }
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response.data)
      .build();
  }

  public async getWoList(request: GetWoListRequestDto): Promise<any> {
    const response = await this.produceService.getWorkOrderList(request);
    if (isEmpty(response?.data?.items)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.WORK_ORDER_NOT_FOUND'))
        .build();
    }
    const result = plainToClass(GetWoListResponseDto, response.data?.items, {
      excludeExtraneousValues: true,
    });
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
  }
}
