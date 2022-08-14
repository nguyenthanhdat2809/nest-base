export enum BoqStatusEnum {
  PENDING = 0,
  CONFIRMED = 1,
  REJECTED = 2,
  IN_PROGRESS = 3,
  COMPLETED = 4,
}

export enum ManufacturingOrderStatusEnum {
  PENDING = 0,
  CONFIRMED = 1,
  REJECTED = 2,
  IN_PROGRESS = 3,
  COMPLETED = 4,
}

export enum ManufacturingOrderPlanStatusEnum {
  REJECTED = 0,
  CREATED = 1,
  CONFIRMED = 2,
  IN_PROGRESS = 3,
  COMPLETED = 4,
}

export const WorkOrderFilterColumn = {
  MO_CODE: 'moCode',
  MO_ID: 'moId',
  WO_STATUS: 'woStatus',
  QC_CHECK: 'qcCheck',
  PRODUCING_STEP_NAME: 'producingStepName',
};

export const ManufacturingOrderFilterColumn = {
  STATUS: 'status',
  CODE: 'code',
  NAME: 'name',
  ID: 'manufacturingOrderIds',
};

export const ManufacturingOrderPlanFilterColumn = {
  STATUS: 'planStatus',
};

export const CAN_QC_MO_STATUS = [
  ManufacturingOrderStatusEnum.CONFIRMED,
  ManufacturingOrderStatusEnum.IN_PROGRESS,
];

export const CAN_QC_MO_PLAN_STATUS = [
  ManufacturingOrderPlanStatusEnum.CONFIRMED,
  ManufacturingOrderPlanStatusEnum.IN_PROGRESS,
];