import { FORMAT_CODE_PERMISSION, StatusPermission } from '@constant/common';

export const ALERT_GROUP_PERMISSION = {
  name: 'Thông báo cải tiến chất lượng',
  code: FORMAT_CODE_PERMISSION + 'ALERT_GROUP',
  status: StatusPermission.ACTIVE,
};

export const CREATE_ALERT_PERMISSION = {
  name: 'Tạo thông báo',
  code: FORMAT_CODE_PERMISSION + 'CREATE_ALERT',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: ALERT_GROUP_PERMISSION.code,
};

export const UPDATE_ALERT_PERMISSION = {
  name: 'Sửa thông báo',
  code: FORMAT_CODE_PERMISSION + 'UPDATE_ALERT',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: ALERT_GROUP_PERMISSION.code,
};

export const DELETE_ALERT_PERMISSION = {
  name: 'Xóa thông báo',
  code: FORMAT_CODE_PERMISSION + 'DELETE_ALERT',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: ALERT_GROUP_PERMISSION.code,
};

export const VIEW_ALERT_PERMISSION = {
  name: 'Xem thông báo',
  code: FORMAT_CODE_PERMISSION + 'VIEW_ALERT',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: ALERT_GROUP_PERMISSION.code,
};

export const CONFIRM_ALERT_PERMISSION = {
  name: 'Xác nhận thông báo',
  code: FORMAT_CODE_PERMISSION + 'CONFIRM_ALERT',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: ALERT_GROUP_PERMISSION.code,
};

export const ALERT_PERMISSION = [
  CREATE_ALERT_PERMISSION,
  UPDATE_ALERT_PERMISSION,
  DELETE_ALERT_PERMISSION,
  VIEW_ALERT_PERMISSION,
  CONFIRM_ALERT_PERMISSION,
];
