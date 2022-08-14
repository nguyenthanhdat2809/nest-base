import { FORMAT_CODE_PERMISSION, StatusPermission } from '@constant/common';

export const LOGIN_GROUP_PERMISSION = {
  name: 'Login',
  code: FORMAT_CODE_PERMISSION + 'LOGIN_GROUP',
  status: StatusPermission.ACTIVE,
};

export const LOGIN_PERMISSION = {
  name: 'Login',
  code: FORMAT_CODE_PERMISSION + 'LOGIN_PERMISSION',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: LOGIN_GROUP_PERMISSION.code,
};

export const CHANGE_PASSWORD_REQUEST_PERMISSION = {
  name: 'Yêu cầu thay đổi mật khẩu',
  code: FORMAT_CODE_PERMISSION + 'CHANGE_PASSWORD_REQUEST',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: LOGIN_GROUP_PERMISSION.code,
};

export const VIEW_LOGIN_PERMISSION = {
  name: 'Xem login',
  code: FORMAT_CODE_PERMISSION + 'VIEW_LOGIN',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: LOGIN_GROUP_PERMISSION.code,
};

export const LOGIN_PERMISSIONS = [
  LOGIN_PERMISSION,
  CHANGE_PASSWORD_REQUEST_PERMISSION,
  VIEW_LOGIN_PERMISSION,
];
