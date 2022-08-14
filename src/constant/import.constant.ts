import { Borders, DataValidation, FillPattern, FillPatterns } from 'exceljs';

export const IMPORT_PREFIX = 'header-csv';

export const IMPORT_COMMON_PREFIX = `${IMPORT_PREFIX}.common`;

export const IMPORT_ACTION = {
  HEADER: `${IMPORT_COMMON_PREFIX}.action`,
  CREATE: `${IMPORT_COMMON_PREFIX}.create`,
  UPDATE: `${IMPORT_COMMON_PREFIX}.update`,
  IGNORE: `${IMPORT_COMMON_PREFIX}.ignore` || '',
  DONE: `${IMPORT_COMMON_PREFIX}.done`,
  COL_INDEX: 1,
};

export const FILE_TYPE = {
  XLSX: {
    MIME_TYPE:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    EXT: 'xlsx',
  },
  CSV: {
    MIME_TYPE: 'text/csv',
    EXT: 'csv',
  },
};

export const IMPORT_CONST = {
  SHEET: {
    DATA_SHEET_NAME: 'Data',
    HEADER_ROW: 1,
    DATA_START_ROW: 2,
    COMMON_ROW_COUNT: 1,
    DATA_VALIDATION_SEPARATOR: ',',
  },
  ACTION_HEADER: 'Hành động',
  ACTION: 'action',
  ACTIONS: [IMPORT_ACTION.CREATE, IMPORT_ACTION.UPDATE, IMPORT_ACTION.IGNORE],
  COL_OFFSET: {
    XLSX: 1,
    CSV: 1,
  },
  TYPE_OF_ROW: 'Row',
  LOG_FILE_NAME: `import_log-{0}-{1}.${FILE_TYPE.CSV.EXT}`,
  TEMPLATE: {
    FILE_NAME: `import_template-{0}.${FILE_TYPE.XLSX.EXT}`,
    FILL_TYPE: 'pattern' as FillPattern['type'],
    PATTERN: 'solid' as FillPatterns,
    ACTION_FILL_COLOR: { argb: 'FF92D050' },
    HEADERS_FILL_COLOR: { argb: 'FFFABF8F' },
    ROW_BORDER: {
      top: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
    } as Partial<Borders>,
    DATA_VALIDATION_TYPE: 'list' as DataValidation['type'],
  },
  UNICODE_PREFIX: '\uFEFF',
  ERR_CODE: {
    FILE_NOT_FOUND: 'ENOENT',
  },
  OUTPUT_FLAG: {
    WRITE: 'w',
  },
  DEFAULT_ENCODING: {
    TEXT: 'utf8' as BufferEncoding,
    ENCODE: 'base64' as BufferEncoding,
  },
  POSITION: {
    HEADER_NAME: 0,
    IS_MANDATORY: 1,
  },
};

export enum IsMandatory {
  False,
  True,
}

export const IS_MANDATORY = IsMandatory.True;

export const IS_OPTIONAL = IsMandatory.False;

export const ACTION_KEY = IMPORT_ACTION.HEADER;
