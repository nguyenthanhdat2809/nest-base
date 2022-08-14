import { FORMAT_CODE_PERMISSION, StatusPermission } from '@constant/common';

export const CAUSE_GROUP_GROUP_PERMISSION = {
  name: 'Định nghĩa nguyên nhân',
  code: FORMAT_CODE_PERMISSION + 'CAUSE_GROUP_GROUP',
  status: StatusPermission.ACTIVE,
};

export const CREATE_CAUSE_GROUP_PERMISSION = {
  name: 'Tạo nguyên nhân',
  code: FORMAT_CODE_PERMISSION + 'CREATE_CAUSE_GROUP',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: CAUSE_GROUP_GROUP_PERMISSION.code,
};

export const UPDATE_CAUSE_GROUP_PERMISSION = {
  name: 'Sửa nguyên nhân',
  code: FORMAT_CODE_PERMISSION + 'UPDATE_CAUSE_GROUP',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: CAUSE_GROUP_GROUP_PERMISSION.code,
};

export const DELETE_CAUSE_GROUP_PERMISSION = {
  name: 'Xóa nguyên nhân',
  code: FORMAT_CODE_PERMISSION + 'DELETE_CAUSE_GROUP',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: CAUSE_GROUP_GROUP_PERMISSION.code,
};

export const VIEW_CAUSE_GROUP_PERMISSION = {
  name: 'Xem nguyên nhân',
  code: FORMAT_CODE_PERMISSION + 'VIEW_CAUSE_GROUP',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: CAUSE_GROUP_GROUP_PERMISSION.code,
};

export const IMPORT_CAUSE_GROUP_PERMISSION = {
  name: 'Import nguyên nhân',
  code: FORMAT_CODE_PERMISSION + 'IMPORT_CAUSE_GROUP',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: CAUSE_GROUP_GROUP_PERMISSION.code,
};

export const CAUSE_GROUP_PERMISSION = [
  CREATE_CAUSE_GROUP_PERMISSION,
  UPDATE_CAUSE_GROUP_PERMISSION,
  DELETE_CAUSE_GROUP_PERMISSION,
  VIEW_CAUSE_GROUP_PERMISSION,
  IMPORT_CAUSE_GROUP_PERMISSION,
];
