import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { PERMISSION_CODE } from '@core/decorator/get-code.decorator';
import { I18nService } from 'nestjs-i18n';
import { ResponseCodeEnum } from '@constant/response-code.enum';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('USER_SERVICE')
    private readonly userClient: ClientProxy,

    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('GUARD-ITEM----------------------------------');
    const permissionCode = this.reflector.getAllAndOverride<string>(
      PERMISSION_CODE,
      [context.getHandler(), context.getClass()],
    );

    const req = await context.switchToHttp().getRequest();
    const userId = req.userId;

    if (!permissionCode || !userId) {
      return true; // To do
    }

    const checkPermissionCondition = {
      userId: userId,
      permissionCode: permissionCode,
    };

    const response = await this.userClient
      .send('final_check_user_permission', checkPermissionCondition)
      .toPromise();
    if (response.statusCode === ResponseCodeEnum.SUCCESS) {
      return true;
    }
    return false;
  }
}
