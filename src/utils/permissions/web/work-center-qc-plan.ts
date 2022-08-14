import { FORMAT_CODE_PERMISSION, StatusPermission } from '@constant/common';

export const WORK_CENTER_QC_PLAN_GROUP_PERMISSION = {
  name: 'Kế hoạch QC theo xưởng',
  code: FORMAT_CODE_PERMISSION + 'WORK_CENTER_PLAN_GROUP',
  status: StatusPermission.ACTIVE,
};

export const CREATE_WORK_CENTER_QC_PLAN_PERMISSION = {
  name: 'Tạo kế hoạch QC theo xưởng',
  code: FORMAT_CODE_PERMISSION + 'CREATE_WORK_CENTER_PLAN',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: WORK_CENTER_QC_PLAN_GROUP_PERMISSION.code,
};

export const UPDATE_WORK_CENTER_QC_PLAN_PERMISSION = {
  name: 'Sửa kế hoạch QC theo xưởng',
  code: FORMAT_CODE_PERMISSION + 'UPDATE_WORK_CENTER_PLAN',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: WORK_CENTER_QC_PLAN_GROUP_PERMISSION.code,
};

export const VIEW_WORK_CENTER_QC_PLAN_PERMISSION = {
  name: 'Xem kế hoạch QC theo xưởng',
  code: FORMAT_CODE_PERMISSION + 'VIEW_WORK_CENTER_PLAN',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: WORK_CENTER_QC_PLAN_GROUP_PERMISSION.code,
};

export const WORK_CENTER_QC_PLAN_PERMISSION = [
  CREATE_WORK_CENTER_QC_PLAN_PERMISSION,
  UPDATE_WORK_CENTER_QC_PLAN_PERMISSION,
  VIEW_WORK_CENTER_QC_PLAN_PERMISSION,
];
