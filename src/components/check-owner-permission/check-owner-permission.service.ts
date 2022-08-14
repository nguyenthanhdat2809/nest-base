import { CheckOwnerPermissionServiceInterface } from '@components/check-owner-permission/interface/check-owner-permission.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { BaseCheckOwnerPermissionRequestDto } from "@components/check-owner-permission/dto/request/base-check-owner-permission.request.dto";
import { isEmpty } from "lodash";

@Injectable()
export class CheckOwnerPermissionService
  implements CheckOwnerPermissionServiceInterface
{
  constructor(
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
  ) {}
  async checkOwnerPermission(
    request: BaseCheckOwnerPermissionRequestDto,
  ): Promise<any> {
    const { user, record, departmentIds, roleCodes } = request;

    // Check permissions by department and roles
    if (!isEmpty(user?.userRoleSettings) && !isEmpty(user?.departmentSettings)) {
      const userRoles = user.userRoleSettings.filter((x) =>
        roleCodes.includes(x.code),
      );
      const userDepartments = user.departmentSettings.filter((x) =>
        departmentIds.includes(x.id),
      );

      if (!isEmpty(userRoles) && !isEmpty(userDepartments)) {
        // TODO if user role && user department not empty => record.createdBy must be user id
        if (record.createdBy === user.id || record.userId === user.id) {
          return true;
        } else return false;
      }
    }
    return true;
  }
}
