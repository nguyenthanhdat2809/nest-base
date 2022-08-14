import { FORMAT_CODE_PERMISSION, StatusPermission } from "@constant/common";

export const OUTPUT_QC_GROUP_PERMISSION = {
  name: 'QC Đầu ra',
  code: FORMAT_CODE_PERMISSION + 'OUTPUT_QC_GROUP',
  status: StatusPermission.ACTIVE,
};

export const OUTPUT_QC_PROGRESS_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'OUTPUT_QC_PROGRESS',
  name: 'Tiến độ QC đầu ra',
  groupPermissionSettingCode: OUTPUT_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const VIEW_OUTPUT_QC_ERROR_REPORT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'VIEW_OUTPUT_QC_ERROR_REPORT',
  name: 'Xem phiếu báo cáo lỗi QC đầu ra',
  groupPermissionSettingCode: OUTPUT_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const CONFIRM_OUTPUT_QC_ERROR_REPORT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CONFIRM_OUTPUT_QC_ERROR_REPORT',
  name: 'Xác nhận phiếu báo cáo lỗi QC đầu ra',
  groupPermissionSettingCode: OUTPUT_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const REJECT_OUTPUT_QC_ERROR_REPORT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'REJECT_OUTPUT_QC_ERROR_REPORT',
  name: 'Từ chối phiếu báo cáo lỗi QC đầu ra',
  groupPermissionSettingCode: OUTPUT_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const VIEW_HISTORY_OUTPUT_QC_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'VIEW_HISTORY_OUTPUT_QC',
  name: 'Tra cứu giao dịch QC đầu ra',
  groupPermissionSettingCode: OUTPUT_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const CREATE_HISTORY_OUTPUT_QC_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_HISTORY_OUTPUT_QC',
  name: 'Tạo giao dịch QC đầu ra',
  groupPermissionSettingCode: OUTPUT_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const CREATE_OUTPUT_QC_ERROR_REPORT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_OUTPUT_QC_ERROR_REPORT',
  name: 'Tạo phiếu báo cáo lỗi QC đầu ra',
  groupPermissionSettingCode: OUTPUT_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const OUTPUT_QC_PERMISSION = [
  OUTPUT_QC_PROGRESS_PERMISSION,
  VIEW_OUTPUT_QC_ERROR_REPORT_PERMISSION,
  CONFIRM_OUTPUT_QC_ERROR_REPORT_PERMISSION,
  REJECT_OUTPUT_QC_ERROR_REPORT_PERMISSION,
  VIEW_HISTORY_OUTPUT_QC_PERMISSION,
  CREATE_OUTPUT_QC_ERROR_REPORT_PERMISSION,
  CREATE_HISTORY_OUTPUT_QC_PERMISSION,
];
