import {
  ACTION_KEY,
  IMPORT_PREFIX,
  IS_MANDATORY,
  IS_OPTIONAL,
} from '@constant/import.constant';

const ACTION_CATEGORY_KEY = `${IMPORT_PREFIX}.action-category`;

export const ACTION_CATEGORY_CONST = {
  IMPORT: {
    HEADERS: [
      [ACTION_KEY, IS_MANDATORY],
      [`${ACTION_CATEGORY_KEY}.code`, IS_MANDATORY],
      [`${ACTION_CATEGORY_KEY}.name`, IS_MANDATORY],
      [`${ACTION_CATEGORY_KEY}.description`, IS_OPTIONAL],
    ],
    COL_INDEX: {
      CODE: 2,
      NAME: 3,
      DESCRIPTION: 4,
    },
  },
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
    MAX_LENGTH: 255,
  },
  DESCRIPTION: {
    DB_COL_NAME: 'description',
    COL_NAME: 'Mô tả',
    MAX_LENGTH: 255,
  },
};

export const FILE_EXPORT_ACTION_CATEGORY_NAME = 'action-category';
export const FILE_EXPORT_ACTION_CATEGORY_HEADER = [
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
    from: 'createdAt',
  },
];
