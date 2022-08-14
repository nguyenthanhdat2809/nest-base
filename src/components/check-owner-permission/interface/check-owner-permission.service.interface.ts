import { BaseCheckOwnerPermissionRequestDto } from "@components/check-owner-permission/dto/request/base-check-owner-permission.request.dto";

export interface CheckOwnerPermissionServiceInterface {
  checkOwnerPermission(
    request: BaseCheckOwnerPermissionRequestDto,
  ): Promise<any>;
}