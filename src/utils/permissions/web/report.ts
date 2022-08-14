import { FORMAT_CODE_PERMISSION, StatusPermission } from '@constant/common';

export const REPORT_GROUP_PERMISSION = {
  name: 'Báo cáo chất lượng',
  code: FORMAT_CODE_PERMISSION + 'REPORT_GROUP',
  status: StatusPermission.ACTIVE,
};

export const VIEW_REPORT_PERMISSION = {
  name: 'Xem báo cáo chất lượng',
  code: FORMAT_CODE_PERMISSION + 'VIEW_REPORT',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: REPORT_GROUP_PERMISSION.code,
};

export const EXPORT_REPORT_PERMISSION = {
  name: 'Export báo cáo chất lượng',
  code: FORMAT_CODE_PERMISSION + 'EXPORT_REPORT',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: REPORT_GROUP_PERMISSION.code,
};

export const REPORT_PERMISSION = [
  VIEW_REPORT_PERMISSION,
  EXPORT_REPORT_PERMISSION,
];
