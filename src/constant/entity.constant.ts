export const BASE_ENTITY_CONST = {
  CREATED_AT: {
    DB_COL_NAME: 'created_at',
    COL_NAME: 'createdAt',
  },
  UPDATED_AT: {
    DB_COL_NAME: 'updated_at',
    COL_NAME: 'updatedAt',
  },
  ID: {
    DB_COL_NAME: 'id',
    COL_NAME: 'id',
  },
};

export const ERROR_REPORT_CONST = {
  ERROR_REPORT: {
    ENTITY_NAME: 'error_report',
    ID: {
      DB_COL_NAME: 'id',
      COL_NAME: 'id',
    },
    CODE: {
      DB_COL_NAME: 'code',
      COL_NAME: 'Mã',
      MAX_LENGTH: 50,
      PREFIX: 'ER',
    },
    NAME: {
      DB_COL_NAME: 'name',
      COL_NAME: 'Tên',
      MAX_LENGTH: 255,
    },
    QC_STAGE_ID: {
      DB_COL_NAME: 'qc_stage_id',
      COL_NAME: 'qcStageId',
    },
    STATUS: {
      DB_COL_NAME: 'status',
      COL_NAME: 'status',
    },
    CREATED_BY: {
      DB_COL_NAME: 'created_by',
      COL_NAME: 'createdBy',
    },
  },
  ERROR_REPORT_ERROR_LIST: {
    ENTITY_NAME: 'error_report_error_list',
    ID: {
      DB_COL_NAME: 'id',
      COL_NAME: 'id',
    },
    ERROR_DESCRIPTION: {
      DB_COL_NAME: 'errorDescription',
      COL_NAME: 'Mô tả lỗi',
      MAX_LENGTH: 255,
    },
  },
};

export const QUALITY_PLAN_CONST = {
  QUALITY_PLAN: {
    ENTITY_NAME: 'quality_plan',
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
    QC_STAGE_ID: {
      DB_COL_NAME: 'qc_stage_id',
      COL_NAME: 'qcStageId',
    },
    CREATED_BY: {
      DB_COL_NAME: 'created_by',
      COL_NAME: 'createdBy',
    },
    STATUS: {
      DB_COL_NAME: 'status',
      COL_NAME: 'status',
    },
  },
  QUALITY_PLAN_DETAIL: {
    ENTITY_NAME: 'quality_plan_detail',
  },
};

export const TRANSACTION_HISTORY_CONST = {
  ENTITY_NAME: 'transaction_history',
  ID: {
    DB_COL_NAME: 'id',
    COL_NAME: 'id',
  },
  CODE: {
    DB_COL_NAME: 'code',
    COL_NAME: 'Mã',
    MAX_LENGTH: 50,
  },
  TYPE: {
    DB_COL_NAME: 'type',
    COL_NAME: 'Loại',
  },
  ORDER_ID: {
    DB_COL_NAME: 'order_id',
    COL_NAME: 'Mã lệnh',
  },
};
