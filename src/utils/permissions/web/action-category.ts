import { FORMAT_CODE_PERMISSION, StatusPermission } from '@constant/common';

export const ACTION_CATEGORY_GROUP_PERMISSION = {
  name: 'Định nghĩa nhóm đối sách',
  code: FORMAT_CODE_PERMISSION + 'ACTION_CATEGORY_GROUP',
  status: StatusPermission.ACTIVE,
};

export const CREATE_ACTION_CATEGORY_PERMISSION = {
  name: 'Tạo nhóm đối sách',
  code: FORMAT_CODE_PERMISSION + 'CREATE_ACTION_CATEGORY',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: ACTION_CATEGORY_GROUP_PERMISSION.code,
};

export const UPDATE_ACTION_CATEGORY_PERMISSION = {
  name: 'Sửa nhóm đối sách',
  code: FORMAT_CODE_PERMISSION + 'UPDATE_ACTION_CATEGORY',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: ACTION_CATEGORY_GROUP_PERMISSION.code,
};

export const DELETE_ACTION_CATEGORY_PERMISSION = {
  name: 'Xóa nhóm đối sách',
  code: FORMAT_CODE_PERMISSION + 'DELETE_ACTION_CATEGORY',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: ACTION_CATEGORY_GROUP_PERMISSION.code,
};

export const VIEW_ACTION_CATEGORY_PERMISSION = {
  name: 'Xem nhóm đối sách',
  code: FORMAT_CODE_PERMISSION + 'VIEW_ACTION_CATEGORY',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: ACTION_CATEGORY_GROUP_PERMISSION.code,
};

export const IMPORT_ACTION_CATEGORY_PERMISSION = {
  name: 'Import nhóm đối sách',
  code: FORMAT_CODE_PERMISSION + 'IMPORT_ACTION_CATEGORY',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: ACTION_CATEGORY_GROUP_PERMISSION.code,
};

export const ACTION_CATEGORY_PERMISSION = [
  CREATE_ACTION_CATEGORY_PERMISSION,
  UPDATE_ACTION_CATEGORY_PERMISSION,
  DELETE_ACTION_CATEGORY_PERMISSION,
  VIEW_ACTION_CATEGORY_PERMISSION,
  IMPORT_ACTION_CATEGORY_PERMISSION,
];
