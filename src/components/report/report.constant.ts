export const REPORT_QC_OPERATION_PRODUCT_NAME = 'report-qc-operation-product';
export const REPORT_QC_OPERATION_PRODUCT_HEADER = [
  {
    from: 'i',
  },
  {
    from: 'moName',
  },
  {
    from: 'itemName',
  },
  {
    from: 'routingName',
  },
  {
    from: 'producingStepName',
  },
  {
    from: 'quantity',
  },
  {
    from: 'actualQuantity',
  },
  {
    from: 'totalUnQcQuantity',
  },
  {
    from: 'totalQcQuantity',
  },
  {
    from: 'errorQuantity',
  },
  {
    from: 'totalQcRejectQuantity',
  },
];

export const REPORT_QC_INPUT_NAME = 'report-input';
export const REPORT_QC_OUTPUT_NAME = 'report-output';
export const REPORT_IOQC_HEADER = [
  {
    from: 'id',
  },
  {
    from: 'stageName',
  },
  {
    from: 'orderName',
  },
  {
    from: 'itemName',
  },
  {
    from: 'planQuantity',
  },
  {
    from: 'actualQuantity',
  },
  {
    from: 'needQCQuantity',
  },
  {
    from: 'doneQCQuantity',
  },
  {
    from: 'errorQuantity',
  },
];

export enum TypeReport {
  INPUT,
  OUTPUT
}
