export const STAGES_OPTION = {
  PO_IMPORT: 0,
  PRO_IMPORT: 2,
  PRO_EXPORT: 3,
  SO_EXPORT: 5,
  OUTPUT_PRODUCTION: 8,
  INPUT_PRODUCTION: 9,
};

export const STAGE_VALUE = [
  {
    value: STAGES_OPTION.PO_IMPORT,
    text: 'Nhập kho theo PO',
  },
  {
    value: STAGES_OPTION.PRO_IMPORT,
    text: 'Nhập kho theo PrO',
  },
  {
    value: STAGES_OPTION.PRO_EXPORT,
    text: 'Xuất kho theo PrO',
  },
  {
    value: STAGES_OPTION.SO_EXPORT,
    text: 'Xuất kho theo SO',
  },
  {
    value: STAGES_OPTION.OUTPUT_PRODUCTION,
    text: 'Sản xuất đầu ra',
  },
  {
    value: STAGES_OPTION.INPUT_PRODUCTION,
    text: 'Sản xuất đầu vào',
  },
];
