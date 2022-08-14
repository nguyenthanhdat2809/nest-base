import { status } from '@entities/check-list/check-list.entity';
import {
  ACTION_KEY,
  IMPORT_PREFIX,
  IS_MANDATORY,
  IS_OPTIONAL,
} from '@constant/import.constant';

export enum CheckListStatusEnum {
  ACTIVE = 0,
  IN_ACTIVE = 1,
}

export const STATUS_TO_CONFIRM_CHECK_LIST_STATUS: number[] = [
  CheckListStatusEnum.ACTIVE,
  CheckListStatusEnum.IN_ACTIVE,
];

export const FILE_EXPORT_CHECK_LIST_NAME = 'check-list';
export const FILE_EXPORT_CHECK_LIST_HEADER = [
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
    from: 'description',
  },
  {
    from: 'status',
  },
];

export const CHECK_LIST_STATUS_VALUE = [
  {
    value: status.IN_ACTIVE,
    text: 'Chờ xác nhận',
  },
  {
    value: status.ACTIVE,
    text: 'Xác nhận',
  },
];

const CHECK_LIST_KEY = `${IMPORT_PREFIX}.check-list`;

export const CHECK_LIST_CONST = {
  IMPORT: {
    HEADERS: [
      [ACTION_KEY, IS_MANDATORY],
      [`${CHECK_LIST_KEY}.code`, IS_MANDATORY],
      [`${CHECK_LIST_KEY}.name`, IS_MANDATORY],
      [`${CHECK_LIST_KEY}.description`, IS_OPTIONAL],
      [`${CHECK_LIST_KEY}.title`, IS_MANDATORY],
      [`${CHECK_LIST_KEY}.descriptionContent`, IS_MANDATORY],
      [`${CHECK_LIST_KEY}.checkType`, IS_MANDATORY],
      [`${CHECK_LIST_KEY}.norm`, IS_MANDATORY],
      [`${CHECK_LIST_KEY}.valueTop`, IS_MANDATORY],
      [`${CHECK_LIST_KEY}.valueBottom`, IS_MANDATORY],
      [`${CHECK_LIST_KEY}.errorGroupCode`, IS_MANDATORY],
      [`${CHECK_LIST_KEY}.itemUnitCode`, IS_MANDATORY],
    ],
    COL_INDEX: {
      CODE: 2,
      NAME: 3,
      DESCRIPTION: 4,
      TITLE: 5,
      DESCRIPTION_CONTENT: 6,
      CHECK_TYPE: 7,
      NORM: 8,
      VALUE_TOP: 9,
      VALUE_BOTTOM: 10,
      ERROR_GROUP_CODE: 11,
      ITEM_UNIT_CODE: 12,
    },
  },
};
