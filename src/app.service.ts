import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { INSERT_PERMISSION } from '@utils/permissions/permission';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
  ) {}
  async onModuleInit() {
    await this.updatePermissions();
  }
  getHello(): any {
    return true;
  }

  private async updatePermissions() {
    let status = false;
    let number = 1;
    do {
      try {
        const responseInsert = await this.userService.insertPermission(
          INSERT_PERMISSION,
        );
        const responseDelete =
          await this.userService.deletePermissionNotActive();
        if (
          responseInsert.statusCode === ResponseCodeEnum.SUCCESS &&
          responseDelete.statusCode === ResponseCodeEnum.SUCCESS
        ) {
          status = true;
        } else {
          number++;
          setTimeout(function () {}, 5000);
        }
      } catch (err) {
        number++;
        setTimeout(function () {}, 5000);
      }
    } while (!status && number < 6);
  }
}
