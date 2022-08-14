import { FORMAT_CODE_PERMISSION, StatusPermission } from "@constant/common";

export const INPUT_QC_GROUP_PERMISSION = {
  name: 'QC Đầu vào',
  code: FORMAT_CODE_PERMISSION + 'INPUT_QC_GROUP',
  status: StatusPermission.ACTIVE,
};

export const INPUT_QC_PROGRESS_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'INPUT_QC_PROGRESS',
  name: 'Tiến độ QC đầu vào',
  groupPermissionSettingCode: INPUT_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const VIEW_INPUT_QC_ERROR_REPORT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'VIEW_INPUT_QC_ERROR_REPORT',
  name: 'Xem phiếu báo cáo lỗi QC đầu vào',
  groupPermissionSettingCode: INPUT_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const CONFIRM_INPUT_QC_ERROR_REPORT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CONFIRM_INPUT_QC_ERROR_REPORT',
  name: 'Xác nhận phiếu báo cáo lỗi QC đầu vào',
  groupPermissionSettingCode: INPUT_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const REJECT_INPUT_QC_ERROR_REPORT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'REJECT_INPUT_QC_ERROR_REPORT',
  name: 'Từ chối phiếu báo cáo lỗi QC đầu vào',
  groupPermissionSettingCode: INPUT_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const VIEW_HISTORY_INPUT_QC_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'VIEW_HISTORY_INPUT_QC',
  name: 'Tra cứu giao dịch QC đầu vào',
  groupPermissionSettingCode: INPUT_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const CREATE_HISTORY_INPUT_QC_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_HISTORY_INPUT_QC',
  name: 'Tạo giao dịch QC đầu vào',
  groupPermissionSettingCode: INPUT_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const CREATE_INPUT_QC_ERROR_REPORT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_INPUT_QC_ERROR_REPORT',
  name: 'Tạo phiếu báo cáo lỗi QC đầu vào',
  groupPermissionSettingCode: INPUT_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const INPUT_QC_PERMISSION = [
  INPUT_QC_PROGRESS_PERMISSION,
  VIEW_INPUT_QC_ERROR_REPORT_PERMISSION,
  CONFIRM_INPUT_QC_ERROR_REPORT_PERMISSION,
  REJECT_INPUT_QC_ERROR_REPORT_PERMISSION,
  VIEW_HISTORY_INPUT_QC_PERMISSION,
  CREATE_HISTORY_INPUT_QC_PERMISSION,
  CREATE_INPUT_QC_ERROR_REPORT_PERMISSION,
];