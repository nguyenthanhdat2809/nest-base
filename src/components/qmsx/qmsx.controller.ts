import { MessagePattern } from '@nestjs/microservices';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Controller, Inject, Req } from '@nestjs/common';
import { QmsxServiceInterface } from '@components/qmsx/interface/qmsx.service.interface';

@Controller('Qmsx')
export class QmsxController {
  constructor(
    @Inject('QmsxServiceInterface')
    private readonly qmsxService: QmsxServiceInterface,
  ) {}

  @MessagePattern('ping')
  public async get(): Promise<any> {
    return new ResponseBuilder('PONG')
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  @MessagePattern('get_env')
  public async getEnv(): Promise<any> {
    return await this.qmsxService.getEnv();
  }
}
