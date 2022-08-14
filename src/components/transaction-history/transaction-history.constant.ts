import { STAGES_OPTION } from '@constant/qc-stage.constant';

export enum TransactionHistoryStatusEnum {
  Created = 0,
  Confirmed = 1,
  Rejected = 2,
}

export enum TransactionHistoryTypeEnum {
  Purchased = STAGES_OPTION.PO_IMPORT,
  ProductionImport = STAGES_OPTION.PRO_IMPORT,
  ProductionExport = STAGES_OPTION.PRO_EXPORT,
  SaleExport = STAGES_OPTION.SO_EXPORT,
  OutputProducingStep = STAGES_OPTION.OUTPUT_PRODUCTION,
  InputProducingStep = STAGES_OPTION.INPUT_PRODUCTION,
}

export enum TransactionHistoryItemTypeEnum {
  Materials,
  PreviousBom,
  OutputQcItem,
};


export const TRANSACTION_HISTORY = {
  CODE_PREFIX: 'GD',
};

export enum TransactionHistoryLogTimeStatusEnum {
  IN_PROGRESS,
  PAUSED,
  COMPLETED,
}

export enum TransactionHistoryLogTimeTypeEnum {
  AUTOMATIC,
  MANUAL,
};

export enum TransactionHistoryIOqcTypeEnum {
  input,
  output,
};

export enum TransactionHistoryProduceStepTypeEnum {
  input,
  output,
};

export const DashBoardDateTimeFormat = 'DD/MM/YYYY';

export const TransactionHistoryInputQcTypes = [
  TransactionHistoryTypeEnum.Purchased,
  TransactionHistoryTypeEnum.ProductionImport,
];

export const TransactionHistoryOutputQcTypes = [
  TransactionHistoryTypeEnum.ProductionExport,
  TransactionHistoryTypeEnum.SaleExport,
];

export const TransactionHistoryProducingStepsQcTypes = [
  TransactionHistoryTypeEnum.InputProducingStep,
  TransactionHistoryTypeEnum.OutputProducingStep,
]

export enum IS_QC_NEEDED_ENUM {
  NOT_NEEDED,
  NEEDED,
}