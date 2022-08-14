import { FORMAT_CODE_PERMISSION, StatusPermission } from '@constant/common';

export const QUALITY_POINT_GROUP_PERMISSION = {
  name: 'Định nghĩa tiêu chí chất lượng',
  code: FORMAT_CODE_PERMISSION + 'QUALITY_POINT_GROUP',
  status: StatusPermission.ACTIVE,
};

export const CREATE_QUALITY_POINT_PERMISSION = {
  name: 'Tạo tiêu chí',
  code: FORMAT_CODE_PERMISSION + 'CREATE_QUALITY_POINT',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: QUALITY_POINT_GROUP_PERMISSION.code,
};

export const UPDATE_QUALITY_POINT_PERMISSION = {
  name: 'Sửa tiêu chí',
  code: FORMAT_CODE_PERMISSION + 'UPDATE_QUALITY_POINT',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: QUALITY_POINT_GROUP_PERMISSION.code,
};

export const DELETE_QUALITY_POINT_PERMISSION = {
  name: 'Xóa tiêu chí',
  code: FORMAT_CODE_PERMISSION + 'DELETE_QUALITY_POINT',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: QUALITY_POINT_GROUP_PERMISSION.code,
};

export const VIEW_QUALITY_POINT_PERMISSION = {
  name: 'Xem tiêu chí',
  code: FORMAT_CODE_PERMISSION + 'VIEW_QUALITY_POINT',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: QUALITY_POINT_GROUP_PERMISSION.code,
};

export const CONFIRM_QUALITY_POINT_PERMISSION = {
  name: 'Xác nhận tiêu chí',
  code: FORMAT_CODE_PERMISSION + 'CONFIRM_QUALITY_POINT',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: QUALITY_POINT_GROUP_PERMISSION.code,
};

export const IMPORT_QUALITY_POINT_PERMISSION = {
  name: 'Import tiêu chí',
  code: FORMAT_CODE_PERMISSION + 'IMPORT_QUALITY_POINT',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: QUALITY_POINT_GROUP_PERMISSION.code,
};

export const EXPORT_QUALITY_POINT_PERMISSION = {
  name: 'Export tiêu chí',
  code: FORMAT_CODE_PERMISSION + 'EXPORT_QUALITY_POINT',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: QUALITY_POINT_GROUP_PERMISSION.code,
};

export const COPY_QUALITY_POINT_ITEM_PERMISSION = {
  name: 'Sao chép tiêu chí',
  code: FORMAT_CODE_PERMISSION + 'COPY_QUALITY_POINT_ITEM',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: QUALITY_POINT_GROUP_PERMISSION.code,
};

export const QUALITY_POINT_PERMISSION = [
  CREATE_QUALITY_POINT_PERMISSION,
  UPDATE_QUALITY_POINT_PERMISSION,
  DELETE_QUALITY_POINT_PERMISSION,
  VIEW_QUALITY_POINT_PERMISSION,
  CONFIRM_QUALITY_POINT_PERMISSION,
  IMPORT_QUALITY_POINT_PERMISSION,
  EXPORT_QUALITY_POINT_PERMISSION,
  COPY_QUALITY_POINT_ITEM_PERMISSION,
];
