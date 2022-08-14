import { QCPlanStatus } from "@entities/quality-plan/quality-plan.entity";

export const QUALITY_PLAN_DB = {
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
    MAX_LENGTH: 50,
  }
};

export enum TypeDetailOrder {
  SO,
  PRO,
  PO
}

export const InProgressQualityPlanStatus = [
  QCPlanStatus.InProgress,
  QCPlanStatus.Confirmed,
]

export const optionQualityPlanStatus = [
  {
    value: QCPlanStatus.Awaiting,
    text: 'Chờ xác nhận',
  },
  {
    value: QCPlanStatus.Confirmed,
    text: 'Xác nhận',
  },
  {
    value: QCPlanStatus.InProgress,
    text: 'Đang thực hiện',
  },
  {
    value: QCPlanStatus.Completed,
    text: 'Hoàn thành',
  },
]
