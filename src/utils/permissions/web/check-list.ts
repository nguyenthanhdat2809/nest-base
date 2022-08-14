import { FORMAT_CODE_PERMISSION, StatusPermission } from '@constant/common';

export const CHECK_LIST_GROUP_PERMISSION = {
  name: 'Danh sách kiểm tra lỗi',
  code: FORMAT_CODE_PERMISSION + 'CHECK_LIST_GROUP',
  status: StatusPermission.ACTIVE,
};

export const CREATE_CHECK_LIST_PERMISSION = {
  name: 'Tạo check list',
  code: FORMAT_CODE_PERMISSION + 'CREATE_CHECK_LIST',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: CHECK_LIST_GROUP_PERMISSION.code,
};

export const UPDATE_CHECK_LIST_PERMISSION = {
  name: 'Sửa check list',
  code: FORMAT_CODE_PERMISSION + 'UPDATE_CHECK_LIST',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: CHECK_LIST_GROUP_PERMISSION.code,
};

export const DELETE_CHECK_LIST_PERMISSION = {
  name: 'Xóa check list',
  code: FORMAT_CODE_PERMISSION + 'DELETE_CHECK_LIST',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: CHECK_LIST_GROUP_PERMISSION.code,
};

export const VIEW_CHECK_LIST_PERMISSION = {
  name: 'Xem check list',
  code: FORMAT_CODE_PERMISSION + 'VIEW_CHECK_LIST',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: CHECK_LIST_GROUP_PERMISSION.code,
};

export const CONFIRM_CHECK_LIST_PERMISSION = {
  name: 'Xác nhận check list',
  code: FORMAT_CODE_PERMISSION + 'CONFIRM_CHECK_LIST',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: CHECK_LIST_GROUP_PERMISSION.code,
};

export const IMPORT_CHECK_LIST_PERMISSION = {
  name: 'Import check list',
  code: FORMAT_CODE_PERMISSION + 'IMPORT_CHECK_LIST',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: CHECK_LIST_GROUP_PERMISSION.code,
};

export const EXPORT_CHECK_LIST_PERMISSION = {
  name: 'Export check list',
  code: FORMAT_CODE_PERMISSION + 'EXPORT_CHECK_LIST',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: CHECK_LIST_GROUP_PERMISSION.code,
};

export const COPY_ITEM_CHECK_LIST_PERMISSION = {
  name: 'Sao chép check list',
  code: FORMAT_CODE_PERMISSION + 'COPY_ITEM_CHECK_LIST',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: CHECK_LIST_GROUP_PERMISSION.code,
};

export const CHECK_LIST_PERMISSION = [
  CREATE_CHECK_LIST_PERMISSION,
  UPDATE_CHECK_LIST_PERMISSION,
  DELETE_CHECK_LIST_PERMISSION,
  VIEW_CHECK_LIST_PERMISSION,
  CONFIRM_CHECK_LIST_PERMISSION,
  IMPORT_CHECK_LIST_PERMISSION,
  EXPORT_CHECK_LIST_PERMISSION,
  COPY_ITEM_CHECK_LIST_PERMISSION,
];
