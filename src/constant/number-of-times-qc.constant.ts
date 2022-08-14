export const NUMBER_OF_TIMES_QC = {
  QC_ONE: 1,
  QC_ONE_TWO: 2,
  QC_TWO_TWO: 3,
  QC_TWO: 4,
};

export const NUMBER_OF_TIMES_QC_VALUE = [
  {
    value: NUMBER_OF_TIMES_QC.QC_ONE,
    text: 'QC 1 Lần', // 1/1
  },
  {
    value: NUMBER_OF_TIMES_QC.QC_ONE_TWO,
    text: 'QC lần 1/2',
  },
  {
    value: NUMBER_OF_TIMES_QC.QC_TWO_TWO,
    text: 'QC lần 2/2',
  },
  {
    value: NUMBER_OF_TIMES_QC.QC_TWO,
    text: 'QC 2 Lần', // 1/2 + 2/2
  },
];
