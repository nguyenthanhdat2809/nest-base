export const ALERT_NAME_RECORD = {
  OP: 1,
  INPUT: 2,
  OUTPUT: 3,
}

export enum AlertStatusEnum {
  IN_ACTIVE = 0,
  ACTIVE = 1,
}

export const STATUS_TO_CONFIRM_ALERT: number[] = [
  AlertStatusEnum.IN_ACTIVE,
  AlertStatusEnum.ACTIVE,
];

export enum ALERT_WORK_ORDER_QUALITY_CONTROL_ENUM {
  PROGRESS_ALERT = 1,
  MATERIAL_INPUT_ALERT = 2,
  PREVIOUS_BOM_ALERT = 3,
}

export const ALERT_DB = {
  ID: {
    DB_COL_NAME: 'id',
    COL_NAME: 'id',
  },
  CODE: {
    DB_COL_NAME: 'code',
    COL_NAME: 'Mã',
    MAX_LENGTH: 50,
  },
  NAME: {
    DB_COL_NAME: 'name',
    COL_NAME: 'Tên',
    MAX_LENGTH: 255,
  },
  DESCRIPTION: {
    DB_COL_NAME: 'description',
    COL_NAME: 'Mô tả',
    MAX_LENGTH: 255,
  },
  STAGE: {
    DB_COL_NAME: 'stage',
    COL_NAME: 'Công đoạn QC',
  },
  ITEM_ID: {
    DB_COL_NAME: 'itemId',
    COL_NAME: 'Tên sản phẩm',
  },
  STATUS: {
    DB_COL_NAME: 'status',
    COL_NAME: 'Trạng thái',
  },
  TYPE_ALERT: {
    DB_COL_NAME: 'typeAlert',
    COL_NAME: 'Type Alert',
  },
  USER_ID: {
    DB_COL_NAME: 'userId',
    COL_NAME: 'Người tạo',
  },
  MANUFACTURING_ORDER_ID: {
    DB_COL_NAME: 'manufacturingOrderId',
    COL_NAME: 'Lệnh sản xuất',
  },
  ROUTING_ID: {
    DB_COL_NAME: 'routingId',
    COL_NAME: 'Tên quy trình',
  },
  PRODUCING_STEP_ID: {
    DB_COL_NAME: 'producingStepId',
    COL_NAME: 'Công đoạn sản xuất',
  },
  PURCHASED_ORDER_ID: {
    DB_COL_NAME: 'purchasedOrderId',
    COL_NAME: 'Mã lệnh',
  },
  WAREHOUSE_ID: {
    DB_COL_NAME: 'warehouseId',
    COL_NAME: 'Tên kho',
  },
  ERROR_REPORT_ID: {
    DB_COL_NAME: 'errorReportId',
    COL_NAME: 'Phiếu báo cáo lỗi',
  },
  ALERT_RELATED_USERS: {
    ID: {
      DB_COL_NAME: 'id',
      COL_NAME: 'Bên liên quan',
    },
    ALERT_ID: {
      DB_COL_NAME: 'alertId',
      COL_NAME: 'Thông báo cải tiến chất lượng',
    },
    USER_ID: {
      DB_COL_NAME: 'userId',
      COL_NAME: 'User',
    },
  }
};
