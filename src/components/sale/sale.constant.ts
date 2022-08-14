export enum OrderTypeProductionOrderEnum {
  Input = 0,
  Output = 1,
}

export enum OrderStatusEnum {
  Pending = 0,
  Confirmed = 1,
  InProgress = 2,
  Approved = 3,
  Completed = 4,
}

export const ORDER_STATUSES = [
  OrderStatusEnum.Pending,
  OrderStatusEnum.Confirmed,
  OrderStatusEnum.InProgress,
  OrderStatusEnum.Approved,
  OrderStatusEnum.Completed,
];

export enum OrderQCCheckedEnum {
  unChecked,
  Checked,
}
