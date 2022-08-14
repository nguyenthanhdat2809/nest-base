import { FORMAT_CODE_PERMISSION, StatusPermission } from '@constant/common';

export const QC_PLAN_GROUP_PERMISSION = {
  name: 'Lập kế hoạch',
  code: FORMAT_CODE_PERMISSION + 'QC_PLAN_GROUP',
  status: StatusPermission.ACTIVE,
};

export const CREATE_QC_PLAN_PERMISSSION = {
  name: 'Tạo kế hoạch QC',
  code: FORMAT_CODE_PERMISSION + 'CREATE_QC_PLAN',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: QC_PLAN_GROUP_PERMISSION.code,
};

export const VIEW_QC_PLAN_PERMISSSION = {
  name: 'Xem kế hoạch QC',
  code: FORMAT_CODE_PERMISSION + 'VIEW_QC_PLAN',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: QC_PLAN_GROUP_PERMISSION.code,
};

export const UPDATE_QC_PLAN_PERMISSSION = {
  name: 'Sửa kế hoạch QC',
  code: FORMAT_CODE_PERMISSION + 'UPDATE_QC_PLAN',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: QC_PLAN_GROUP_PERMISSION.code,
};

export const DELETE_QC_PLAN_PERMISSSION = {
  name: 'Xóa kế hoạch QC',
  code: FORMAT_CODE_PERMISSION + 'DELETE_QC_PLAN',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: QC_PLAN_GROUP_PERMISSION.code,
};

export const CONFIRM_QC_PLAN_PERMISSSION = {
  name: 'Confirm kế hoạch QC',
  code: FORMAT_CODE_PERMISSION + 'CONFIRM_QC_PLAN',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: QC_PLAN_GROUP_PERMISSION.code,
};

export const QC_PLAN_PERMISSION = [
  CREATE_QC_PLAN_PERMISSSION,
  VIEW_QC_PLAN_PERMISSSION,
  UPDATE_QC_PLAN_PERMISSSION,
  DELETE_QC_PLAN_PERMISSSION,
  CONFIRM_QC_PLAN_PERMISSSION,
];
