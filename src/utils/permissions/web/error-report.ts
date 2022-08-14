import { FORMAT_CODE_PERMISSION, StatusPermission } from '@constant/common';

export const ERROR_REPORT_GROUP_PERMISSION = {
  name: 'Phiếu báo cáo lỗi',
  code: FORMAT_CODE_PERMISSION + 'ERROR_REPORT_GROUP',
  status: StatusPermission.ACTIVE,
};

export const VIEW_ERROR_REPORT_PERMISSION = {
  name: 'Xem phiếu báo cáo lỗi',
  code: FORMAT_CODE_PERMISSION + 'VIEW_ERROR_REPORT',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: ERROR_REPORT_GROUP_PERMISSION.code,
};

export const CONFIRM_ERROR_REPORT_PERMISSION = {
  name: 'Xác nhận phiếu báo cáo lỗi',
  code: FORMAT_CODE_PERMISSION + 'CONFIRM_ERROR_REPORT',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: ERROR_REPORT_GROUP_PERMISSION.code,
};

export const REJECT_ERROR_REPORT_PERMISSION = {
  name: 'Từ chối phiếu báo cáo lỗi',
  code: FORMAT_CODE_PERMISSION + 'REJECT_ERROR_REPORT',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: ERROR_REPORT_GROUP_PERMISSION.code,
};

export const EXPORT_ERROR_REPORT_PERMISSION = {
  name: 'Export phiếu báo cáo lỗi',
  code: FORMAT_CODE_PERMISSION + 'EXPORT_ERROR_REPORT',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: ERROR_REPORT_GROUP_PERMISSION.code,
};

export const ERROR_REPORT_PERMISSION = [
  VIEW_ERROR_REPORT_PERMISSION,
  CONFIRM_ERROR_REPORT_PERMISSION,
  REJECT_ERROR_REPORT_PERMISSION,
  EXPORT_ERROR_REPORT_PERMISSION,
];
