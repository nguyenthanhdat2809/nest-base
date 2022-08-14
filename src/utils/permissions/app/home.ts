import { FORMAT_CODE_PERMISSION, StatusPermission } from '@constant/common';

export const HOME_GROUP_PERMISSION = {
  name: 'Trang chủ',
  code: FORMAT_CODE_PERMISSION + 'HOME_GROUP',
  status: StatusPermission.ACTIVE,
};

export const VIEW_HOME_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'VIEW_HOME',
  name: 'Xem trang chủ',
  groupPermissionSettingCode: HOME_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const TRANSACTION_HOME_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'TRANSACTION_HOME',
  name: 'Giao dịch',
  groupPermissionSettingCode: HOME_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const SCAN_QR_CODE_HOME_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'SCAN_QR_CODE_HOME',
  name: 'Quét QR Code',
  groupPermissionSettingCode: HOME_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const CONTACT_HOME_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CONTACT_HOME_APP',
  name: 'Liên hệ',
  groupPermissionSettingCode: HOME_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const HOME_PERMISSION = [
  VIEW_HOME_PERMISSION,
  TRANSACTION_HOME_PERMISSION,
  SCAN_QR_CODE_HOME_PERMISSION,
  CONTACT_HOME_PERMISSION,
];
