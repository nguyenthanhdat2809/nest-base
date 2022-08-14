import { FORMAT_CODE_PERMISSION, StatusPermission } from '@constant/common';

export const ERROR_GROUP_GROUP_PERMISSION = {
  name: 'Định nghĩa nhóm lỗi',
  code: FORMAT_CODE_PERMISSION + 'ERROR_GROUP_GROUP',
  status: StatusPermission.ACTIVE,
};

export const CREATE_ERROR_GROUP_PERMISSION = {
  name: 'Tạo nhóm lỗi',
  code: FORMAT_CODE_PERMISSION + 'CREATE_ERROR_GROUP',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: ERROR_GROUP_GROUP_PERMISSION.code,
};

export const UPDATE_ERROR_GROUP_PERMISSION = {
  name: 'Sửa nhóm lỗi',
  code: FORMAT_CODE_PERMISSION + 'UPDATE_ERROR_GROUP',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: ERROR_GROUP_GROUP_PERMISSION.code,
};

export const DELETE_ERROR_GROUP_PERMISSION = {
  name: 'Xóa nhóm lỗi',
  code: FORMAT_CODE_PERMISSION + 'DELETE_ERROR_GROUP',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: ERROR_GROUP_GROUP_PERMISSION.code,
};

export const VIEW_ERROR_GROUP_PERMISSION = {
  name: 'Xem nhóm lỗi',
  code: FORMAT_CODE_PERMISSION + 'VIEW_ERROR_GROUP',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: ERROR_GROUP_GROUP_PERMISSION.code,
};

export const IMPORT_ERROR_GROUP_PERMISSION = {
  name: 'Import nhóm lỗi',
  code: FORMAT_CODE_PERMISSION + 'IMPORT_ERROR_GROUP',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: ERROR_GROUP_GROUP_PERMISSION.code,
};

export const ERROR_GROUP_PERMISSION = [
  CREATE_ERROR_GROUP_PERMISSION,
  UPDATE_ERROR_GROUP_PERMISSION,
  DELETE_ERROR_GROUP_PERMISSION,
  VIEW_ERROR_GROUP_PERMISSION,
  IMPORT_ERROR_GROUP_PERMISSION,
];
