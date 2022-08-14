import {
  ACTION_KEY,
  IS_MANDATORY,
  IS_OPTIONAL,
  IMPORT_PREFIX,
} from '@constant/import.constant';

export const FILE_EXPORT_ERROR_GROUP_NAME = 'error-group';
export const FILE_EXPORT_ERROR_GROUP_HEADER = [
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

const ERROR_GROUP_KEY = `${IMPORT_PREFIX}.error-group`;

export const ERROR_GROUP_CONST = {
  IMPORT: {
    HEADERS: [
      [ACTION_KEY, IS_MANDATORY],
      [`${ERROR_GROUP_KEY}.code`, IS_MANDATORY],
      [`${ERROR_GROUP_KEY}.name`, IS_MANDATORY],
      [`${ERROR_GROUP_KEY}.description`, IS_OPTIONAL],
    ],
    COL_INDEX: {
      CODE: 2,
      NAME: 3,
      DESCRIPTION: 4,
    },
  },
  ENTITY_NAME: 'error_group',
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
  REQUIRED_COL_NUM: 2,
};
