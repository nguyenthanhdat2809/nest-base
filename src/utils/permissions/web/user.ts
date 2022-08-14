import { FORMAT_CODE_PERMISSION, StatusPermission } from '@constant/common';

export const USER_GROUP_PERMISSION = {
  name: 'Quản lý user',
  code: FORMAT_CODE_PERMISSION + 'USER_GROUP',
  status: StatusPermission.ACTIVE,
};

export const CREATE_USER_PERMISSION = {
  name: 'Tạo user',
  code: FORMAT_CODE_PERMISSION + 'CREATE_USER',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
};

export const UPDATE_USER_PERMISSION = {
  name: 'Sửa user',
  code: FORMAT_CODE_PERMISSION + 'UPDATE_USER',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
};

export const DELETE_USER_PERMISSION = {
  name: 'Xóa user',
  code: FORMAT_CODE_PERMISSION + 'DELETE_USER',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
};

export const VIEW_USER_PERMISSION = {
  name: 'Xem user',
  code: FORMAT_CODE_PERMISSION + 'VIEW_USER',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
};

export const USER_PERMISSION = [
  CREATE_USER_PERMISSION,
  UPDATE_USER_PERMISSION,
  DELETE_USER_PERMISSION,
  VIEW_USER_PERMISSION,
];
