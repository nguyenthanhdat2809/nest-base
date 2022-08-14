import { FORMAT_CODE_PERMISSION, StatusPermission } from '@constant/common';

export const DASHBOARD_GROUP_PERMISSION = {
  name: 'Dashboard',
  code: FORMAT_CODE_PERMISSION + 'DASHBOARD_GROUP',
  status: StatusPermission.ACTIVE,
};

export const VIEW_DASHBOARD_PERMISSION = {
  name: 'Xem dashboard',
  code: FORMAT_CODE_PERMISSION + 'VIEW_DASHBOARD',
  status: StatusPermission.ACTIVE,
  groupPermissionSettingCode: DASHBOARD_GROUP_PERMISSION.code,
};

export const DASHBOARD_PERMISSION = [VIEW_DASHBOARD_PERMISSION];
