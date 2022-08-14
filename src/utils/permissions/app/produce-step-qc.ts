import { FORMAT_CODE_PERMISSION, StatusPermission } from "@constant/common";

export const PRODUCE_STEP_QC_GROUP_PERMISSION = {
  name: 'QC Công Đoạn',
  code: FORMAT_CODE_PERMISSION + 'PRODUCE_STEP_QC_GROUP',
  status: StatusPermission.ACTIVE,
};

export const PRODUCE_STEP_QC_PROGRESS_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'PRODUCE_STEP_QC_PROGRESS',
  name: 'Tiến độ QC công đoạn',
  groupPermissionSettingCode: PRODUCE_STEP_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const VIEW_PRODUCE_STEP_QC_ERROR_REPORT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'VIEW_PRODUCE_STEP_QC_ERROR_REPORT',
  name: 'Xem phiếu báo cáo lỗi QC công đoạn',
  groupPermissionSettingCode: PRODUCE_STEP_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const CONFIRM_PRODUCE_STEP_QC_ERROR_REPORT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CONFIRM_PRODUCE_STEP_QC_ERROR_REPORT',
  name: 'Xác nhận phiếu báo cáo lỗi QC công đoạn',
  groupPermissionSettingCode: PRODUCE_STEP_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const REJECT_PRODUCE_STEP_QC_ERROR_REPORT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'REJECT_PRODUCE_STEP_QC_ERROR_REPORT',
  name: 'Từ chối phiếu báo cáo lỗi QC công đoạn',
  groupPermissionSettingCode: PRODUCE_STEP_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const VIEW_HISTORY_PRODUCE_STEP_QC_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'VIEW_HISTORY_PRODUCE_STEP_QC',
  name: 'Tra cứu giao dịch QC công đoạn',
  groupPermissionSettingCode: PRODUCE_STEP_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const CREATE_HISTORY_PRODUCE_STEP_QC_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_HISTORY_PRODUCE_STEP_QC',
  name: 'Tạo giao dịch QC công đoạn',
  groupPermissionSettingCode: PRODUCE_STEP_QC_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const PRODUCE_STEP_QC_PERMISSION = [
  PRODUCE_STEP_QC_PROGRESS_PERMISSION,
  VIEW_PRODUCE_STEP_QC_ERROR_REPORT_PERMISSION,
  CONFIRM_PRODUCE_STEP_QC_ERROR_REPORT_PERMISSION,
  REJECT_PRODUCE_STEP_QC_ERROR_REPORT_PERMISSION,
  VIEW_HISTORY_PRODUCE_STEP_QC_PERMISSION,
  CREATE_HISTORY_PRODUCE_STEP_QC_PERMISSION,
];