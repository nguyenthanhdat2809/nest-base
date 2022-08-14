import {
  Formality,
  status,
} from '@entities/quality-point/quality-point.entity';
import {
  ACTION_KEY,
  IMPORT_PREFIX,
  IS_MANDATORY,
  IS_OPTIONAL,
} from '@constant/import.constant';

export enum QualityPointStatusEnum {
  ACTIVE = 0,
  IN_ACTIVE = 1,
}

export const STATUS_TO_CONFIRM_QUALITY_POINT_STATUS: number[] = [
  QualityPointStatusEnum.ACTIVE,
  QualityPointStatusEnum.IN_ACTIVE,
];

const QUALITY_POINT_KEY = `${IMPORT_PREFIX}.qualityPoint`;

export const QUALITY_POINT_CONST = {
  STAGE_CHECKED: 8,
  PRODUCE_ID_LENGTH: 3,
  IMPORT: {
    HEADERS: [
      [ACTION_KEY, IS_MANDATORY],
      [`${QUALITY_POINT_KEY}.code`, IS_MANDATORY],
      [`${QUALITY_POINT_KEY}.name`, IS_MANDATORY],
      [`${QUALITY_POINT_KEY}.description`, IS_OPTIONAL],
      [`${QUALITY_POINT_KEY}.itemCode`, IS_MANDATORY],
      [`${QUALITY_POINT_KEY}.qualityPointUser1s`, IS_MANDATORY],
      [`${QUALITY_POINT_KEY}.checkListCode`, IS_MANDATORY],
      [`${QUALITY_POINT_KEY}.formality`, IS_MANDATORY],
      [`${QUALITY_POINT_KEY}.numberOfTime`, IS_MANDATORY],
      [`${QUALITY_POINT_KEY}.quantity`, IS_MANDATORY],
      [`${QUALITY_POINT_KEY}.errorAcceptanceRate`, IS_MANDATORY],
      [`${QUALITY_POINT_KEY}.qualityPointUser2s`, IS_MANDATORY],
      [`${QUALITY_POINT_KEY}.stage`, IS_MANDATORY],
    ],
    COL_INDEX: {
      CODE: 2,
      NAME: 3,
      ITEM_CODE: 4,
      STAGE: 5,
      QUALITY_POINT_USER_1S: 6,
      CHECKLIST_CODE: 7,
      FORMALITY: 8,
      NUMBER_OF_TIME: 9,
      QUANTITY: 10,
      QUALITY_POINT_USER_2S: 11,
      ERROR_ACCEPTANCE_RATE: 12,
      DESCRIPTION: 13,
    },
    USER_SEPARATOR: ',',
  },
};

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

export const STAGE_MAP = STAGE_VALUE.reduce(
  (map, obj) => ((map[obj.value] = obj.text), map),
  {},
);

export const QUALITY_POINT_FORMALITY = [
  {
    value: Formality.Fully,
    text: 'QC toàn phần',
  },
  {
    value: Formality.Partly,
    text: 'QC ngẫu nhiên',
  },
];

export const QUALITY_POINT_STATUS_VALUE = [
  {
    value: status.IN_ACTIVE,
    text: 'Chờ xác nhận',
  },
  {
    value: status.ACTIVE,
    text: 'Xác nhận',
  },
];

export const FILE_EXPORT_QUALITY_POINT_NAME = 'quality-point';
export const FILE_EXPORT_QUALITY_POINT_HEADER = [
  {
    from: 'id',
  },
  {
    from: 'code',
  },
  {
    from: 'name',
  },
  {
    from: 'qcStageName',
  },
  {
    from: 'username',
  },
  {
    from: 'status',
  },
];
