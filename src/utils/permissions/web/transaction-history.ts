import { FORMAT_CODE_PERMISSION, StatusPermission } from '@constant/common';

export const TRANSACTION_HISTORY_GROUP_PERMISSION = {
  name: 'Lịch sử giao dịch',
  code: FORMAT_CODE_PERMISSION + 'TRANSACTION_HISTORY_GROUP',
  status: StatusPermission.ACTIVE,
};

export const VIEW_TRANSACTION_HISTORY_PERMISSION = {
  name: 'Xem lịch sử giao dịch',
  code: FORMAT_CODE_PERMISSION + 'VIEW_TRANSACTION_HISTORY',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: TRANSACTION_HISTORY_GROUP_PERMISSION.code,
};

export const TRANSACTION_HISTORY_PERMISSION = [
  VIEW_TRANSACTION_HISTORY_PERMISSION,
];
