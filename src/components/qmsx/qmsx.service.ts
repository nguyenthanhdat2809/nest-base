import { InjectConnection } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import * as bcrypt from 'bcrypt';
import { I18nService } from 'nestjs-i18n';
import { Connection } from 'typeorm';
import { QmsxServiceInterface } from '@components/qmsx/interface/qmsx.service.interface';
import { ErrorGroupRepositoryInterface } from '@components/error-group/interface/error-group.repository.interface';

@Injectable()
export class QmsxService implements QmsxServiceInterface {
  constructor(
    @Inject('ErrorGroupRepositoryInterface')
    private readonly errorGroupRepository: ErrorGroupRepositoryInterface,

    private readonly i18n: I18nService,

    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  public async getEnv(): Promise<any> {
    const [errorGroups] = await Promise.all([
      this.errorGroupRepository.findAll(),
    ]);
    return new ResponseBuilder({
      errorGroups: errorGroups,
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }
}
