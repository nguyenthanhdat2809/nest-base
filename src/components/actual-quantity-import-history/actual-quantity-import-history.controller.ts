import { Body, Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ResponsePayload } from '@utils/response-payload';
import { isEmpty } from 'lodash';
import { ActualQuantityImportHistoryServiceInterface } from '@components/actual-quantity-import-history/interface/actual-quantity-import-history.service.interface';
import { CreateActualQuantityProduceStepsImportHistoryRequestDto } from '@components/actual-quantity-import-history/dto/request/create-actual-quantity-produce-steps-import-history.request.dto';

@Controller('actual-quantity-import-histories')
export class ActualQuantityImportHistoryController {
  constructor(
    @Inject('ActualQuantityImportHistoryServiceInterface')
    private readonly actualQuantityImportHistoryService: ActualQuantityImportHistoryServiceInterface,
  ) {}

  @MessagePattern('create_actual_quantity_produce_steps_import_history')
  public async createActualQuantityProduceStepsImportHistory(
    @Body() payload: CreateActualQuantityProduceStepsImportHistoryRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.actualQuantityImportHistoryService.createActualQuantityProduceStepsImportHistory(
      request,
    );
  }
}
