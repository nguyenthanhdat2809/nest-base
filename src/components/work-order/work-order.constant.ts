export enum WorkOrderStatusEnum {
  CREATED = 0,
  CONFIRMED = 1,
  REJECTED = 2,
  IN_PROGRESS = 3,
  COMPLETED = 4,
}

export enum TransitStatusEnum {
  CREATED = 0,
  REJECTED = 1,
  CONFIRMED = 2,
  IN_PROGRESS = 3,
  COMPLETED = 4,
}

export const CAN_CONFIRM_IN_TRANSIT_STATUS: number[] = [
  TransitStatusEnum.CREATED,
  TransitStatusEnum.REJECTED,
];

export const CAN_REJECT_IN_TRANSIT_STATUS: number[] = [
  TransitStatusEnum.CREATED,
];

export const CAN_IMPORT_IN_TRANSIT_STATUS: number[] = [
  TransitStatusEnum.CONFIRMED,
  TransitStatusEnum.IN_PROGRESS,
];

export const CAN_UPDATE_WORK_ORDER_STATUS: number[] = [
  WorkOrderStatusEnum.CREATED,
  WorkOrderStatusEnum.REJECTED,
];

export const CAN_DELETE_WORK_ORDER_STATUS: number[] = [
  WorkOrderStatusEnum.CREATED,
  WorkOrderStatusEnum.REJECTED,
];

export const CAN_SUBMIT_WORK_ORDER_INPUT: number[] = [
  WorkOrderStatusEnum.IN_PROGRESS,
  WorkOrderStatusEnum.CONFIRMED,
];

export const CAN_SUBMIT_WORK_ORDER_SCRAP: number[] = [
  WorkOrderStatusEnum.IN_PROGRESS,
  WorkOrderStatusEnum.CONFIRMED,
];

export const CAN_EXPORT_WORK_ORDER_STATUS: number[] = [
  WorkOrderStatusEnum.IN_PROGRESS,
];

export const CAN_SCAN_WORK_ORDER_STATUS: number[] = [
  WorkOrderStatusEnum.IN_PROGRESS,
  WorkOrderStatusEnum.CONFIRMED,
];

export const CAN_PRINT_WORK_ORDER_QR_CODE: number[] = [
  WorkOrderStatusEnum.IN_PROGRESS,
  WorkOrderStatusEnum.CONFIRMED,
];

export const CAN_QC_WORK_ORDER: number[] = [
  WorkOrderStatusEnum.IN_PROGRESS,
  WorkOrderStatusEnum.CONFIRMED,
];

export const WORK_ORDER_CODE_PREFIX = 'WO';

export const FormatCodeWorkOrder = `${WORK_ORDER_CODE_PREFIX}`;

export const QC_CHECK = {
  Checked: '1',
  Unchecked: '0',
};