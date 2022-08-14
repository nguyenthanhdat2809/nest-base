import { CellValue, Row, Workbook, Worksheet } from 'exceljs';
import {
  FILE_TYPE,
  IMPORT_ACTION,
  IMPORT_CONST,
  IS_MANDATORY,
  IsMandatory,
} from '@constant/import.constant';
import { I18nRequestScopeService, I18nService } from 'nestjs-i18n';
import { ImportResponseDto } from '@core/dto/import/response/import.response.dto';
import { stringFormat, toStringTrimLowerCase } from '@utils/object.util';
import { ConfigService } from '@config/config.service';
import { ResponsePayload } from '@utils/response-payload';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Buffer } from 'buffer';
import * as Papa from 'papaparse';
import { ImportRequestDto } from '@core/dto/import/request/import.request.dto';
import { isEmpty } from 'lodash';
import { access, mkdir } from 'fs/promises';
import { constants } from 'fs';
import ErrnoException = NodeJS.ErrnoException;
import { ApiError } from '@utils/api.error';
import { InitWorksheetDto } from '@core/dto/import/response/init-worksheet.dto';
import { EOL } from 'os';
import { ImportResultDto } from '@core/dto/import/response/import.result.dto';
import { ValidateActionRowDataRequestDto } from '@core/dto/import/request/validate-action-row-data.request.dto';
import { ValidateActionRowDataResponseDto } from '@core/dto/import/response/validate-action-row-data.response.dto';

export abstract class ImportDataAbstract {
  protected readonly templateDir: string;

  protected constructor(
    protected readonly i18n: I18nRequestScopeService,
    protected readonly configService: ConfigService,
  ) {
    this.templateDir = this.configService.get('templateDir');
  }

  protected abstract validateRowData(
    dataRowValues: string[] | CellValue[] | { [key: string]: CellValue },
    colOffset: number,
  ): Promise<string[]>;

  protected abstract getRowData(dataRowValues, colOffset: number);

  protected abstract saveImportData(
    fileName: string,
    fileType: string,
    dataRows: Row[] | Array<Array<string>>,
    colOffset: number,
  ): Promise<ImportResponseDto>;

  protected abstract createTemplateFile(
    templateFilePath: string,
  ): Promise<void>;

  /**
   * Import utility function
   * @param request Import request dto
   * @param headers
   * @protected
   */
  protected async importUtil(
    request: ImportRequestDto,
    headers: Array<Array<string | IsMandatory>>,
  ): Promise<ResponsePayload<ImportResponseDto>> {
    const { fileData, fileName, mimeType } = request;

    // return an error message if the file type is not XLSX or CSV
    if (
      mimeType != FILE_TYPE.XLSX.MIME_TYPE &&
      mimeType != FILE_TYPE.CSV.MIME_TYPE
    )
      return new ResponseBuilder<ImportResponseDto>()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('validation.IMPORT_INVALID_FILE_TYPE'),
        )
        .build();

    let dataRows: Row[] | string[][];
    let offset = IMPORT_CONST.COL_OFFSET.XLSX;

    // if file type is XLSX then read file using exceljs
    if (mimeType == FILE_TYPE.XLSX.MIME_TYPE) {
      let workbook = new Workbook();
      workbook = await workbook.xlsx.load(Buffer.from(fileData));

      const worksheet = workbook.getWorksheet(
        IMPORT_CONST.SHEET.DATA_SHEET_NAME,
      );

      // return an error message if the imported file's template is invalid
      if (!worksheet)
        return new ResponseBuilder<ImportResponseDto>()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('validation.IMPORT_INVALID_TEMPLATE'),
          )
          .build();

      const headerRow = worksheet.getRow(IMPORT_CONST.SHEET.HEADER_ROW).values;

      const validateHeaderMsg = await this.validateHeader(
        headerRow,
        headers,
        offset,
      );

      // return an error message if the imported file's headers are invalid
      if (validateHeaderMsg != null)
        return new ResponseBuilder<ImportResponseDto>()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(validateHeaderMsg)
          .build();

      dataRows = worksheet.getRows(
        IMPORT_CONST.SHEET.HEADER_ROW,
        worksheet.rowCount,
      );

      // if file type is CSV then read file using PapaParse
    } else if (mimeType == FILE_TYPE.CSV.MIME_TYPE) {
      offset = IMPORT_CONST.COL_OFFSET.CSV;
      let headerValues;

      const content = Buffer.from(fileData).toString(
        IMPORT_CONST.DEFAULT_ENCODING.TEXT,
      );

      Papa.parse(content, {
        step: function (row, parser) {
          headerValues = row.data;
          parser.abort();
        },
      });

      const validateHeaderMsg = await this.validateHeader(
        headerValues,
        headers,
        IMPORT_CONST.COL_OFFSET.CSV,
      );

      // return an error message if the imported file's headers are invalid
      if (validateHeaderMsg)
        return new ResponseBuilder<ImportResponseDto>()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(validateHeaderMsg)
          .build();

      dataRows = Papa.parse(content).data;
    }

    return new ResponseBuilder<ImportResponseDto>()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(await this.saveImportData(fileName, mimeType, dataRows, offset))
      .build();
  }

  /**
   * Validate required fields
   * @param logs Processing logs
   * @param colName Column name
   * @param cellValue Cell's value
   * @param maxLength Field's max length
   * @protected
   */
  protected async validateRequiredField(
    logs: string[],
    colName: string,
    cellValue: string,
    maxLength: number,
  ) {
    if (!cellValue || cellValue.length <= 0) {
      logs.push(
        stringFormat(
          await this.i18n.translate('validation.IMPORT_FIELD_REQUIRED'),
          colName,
        ),
      );
    }

    await this.validateMaxLength(logs, colName, cellValue, maxLength);
  }

  /**
   * Validate max length of field
   * @param logs Processing logs
   * @param colName Column name
   * @param cellValue Cell's value
   * @param maxLength Field's max length
   * @protected
   */
  protected async validateMaxLength(
    logs: string[],
    colName: string,
    cellValue: string,
    maxLength: number,
  ) {
    if (cellValue && cellValue.length > maxLength)
      logs.push(
        stringFormat(
          await this.i18n.translate('validation.IMPORT_MAX_LENGTH_EXCEED'),
          colName,
          maxLength,
        ),
      );
  }

  /**
   * Validate headers of imported file
   * @param headerRowValues Header row's values
   * @param availableHeaders Headers defined in the entity constant
   * @param colOffset Column offset
   * @protected
   */
  protected async validateHeader(
    headerRowValues: string[] | CellValue[] | { [key: string]: CellValue },
    availableHeaders: Array<Array<string | IsMandatory>>,
    colOffset: number,
  ): Promise<string> {
    const position = IMPORT_CONST.POSITION;

    const requiredFieldNum = availableHeaders.filter(
      (header) => header[position.IS_MANDATORY] == IS_MANDATORY,
    ).length;

    const headerValuesCount = (headerRowValues.length as number) - colOffset;

    if (!headerRowValues || headerRowValues.length <= 0)
      return await this.i18n.translate('validation.IMPORT_INVALID_TEMPLATE');

    // check if total header values is invalid:
    // - Less than number of required fields
    // - Greater than total fields
    if (
      headerValuesCount < requiredFieldNum ||
      headerValuesCount > availableHeaders.length
    )
      return await this.i18n.translate('validation.IMPORT_INVALID_TEMPLATE');

    const availableHeaderNames = await Promise.all(
      availableHeaders.map((header) => {
        return this.i18n.translate(header[position.HEADER_NAME] as string);
      }),
    );

    for (let i = 0; i < headerValuesCount; i++) {
      if (
        toStringTrimLowerCase(headerRowValues[i + colOffset]) !=
        toStringTrimLowerCase(availableHeaderNames[i])
      )
        return await this.i18n.translate('validation.IMPORT_INVALID_HEADER');
    }

    return null;
  }

  /**
   * Validate actions by each column's header
   * @param rowValues Row's values
   * @param colOffset Column offset
   * @protected Validation logs
   */
  protected async getActionValidationMessages(
    rowValues: string[] | CellValue[] | { [key: string]: CellValue },
  ): Promise<string[]> {
    const logs = [];

    const availableActions = await Promise.all(
      IMPORT_CONST.ACTIONS.map(async (key) => {
        if (key === '') return key;

        const translatedAction = await this.i18n.translate(key);

        return toStringTrimLowerCase(translatedAction);
      }),
    );

    const action = toStringTrimLowerCase(rowValues[IMPORT_ACTION.COL_INDEX]);

    if (isEmpty(action)) {
      const [header, message] = await Promise.all([
        this.i18n.translate(IMPORT_ACTION.HEADER),
        this.i18n.translate('validation.IMPORT_FIELD_REQUIRED'),
      ]);

      logs.push(stringFormat(message, header));
    } else if (!availableActions.includes(action)) {
      const [header, message] = await Promise.all([
        this.i18n.translate(IMPORT_ACTION.HEADER),
        this.i18n.translate('validation.IMPORT_FIELD_INCORRECT'),
      ]);

      logs.push(stringFormat(message, header));
    }

    return logs;
  }

  protected async handleImportedRow(
    saveDbResult: ResponsePayload<any>,
    importResult: any,
    importResults: any[],
    successCount: number,
  ) {
    let updatedSuccessCount = successCount;

    if (saveDbResult.statusCode != ResponseCodeEnum.SUCCESS)
      importResult.log = saveDbResult.message;
    else {
      const errorGroup = saveDbResult.data;

      importResult.id = errorGroup.id;
      importResult.action = await this.i18n.translate(IMPORT_ACTION.DONE);
      updatedSuccessCount++;
    }

    importResults.push(importResult);

    return updatedSuccessCount;
  }

  protected async checkTemplateDirExistence(): Promise<string> {
    try {
      await access(this.templateDir, constants.R_OK | constants.W_OK);

      return null;
    } catch (err) {
      if (err.code != IMPORT_CONST.ERR_CODE.FILE_NOT_FOUND) return err.message;
      else await mkdir(this.templateDir, '744');
    }
  }

  protected async checkTemplateFileExistence(
    filePath: string,
  ): Promise<ErrnoException> {
    try {
      await access(filePath, constants.R_OK | constants.W_OK);

      return null;
    } catch (err) {
      return err;
    }
  }

  protected async checkTemplateExistence(
    templateFilePath: string,
  ): Promise<void> {
    const checkTemplateDirExistenceErr = await this.checkTemplateDirExistence();

    if (checkTemplateDirExistenceErr)
      throw new ApiError(
        ResponseCodeEnum.INTERNAL_SERVER_ERROR,
        checkTemplateDirExistenceErr,
      );

    const checkTemplateFileExistenceErr = await this.checkTemplateFileExistence(
      templateFilePath,
    );

    if (
      checkTemplateFileExistenceErr?.code !=
      IMPORT_CONST.ERR_CODE.FILE_NOT_FOUND
    )
      throw new ApiError(
        ResponseCodeEnum.INTERNAL_SERVER_ERROR,
        checkTemplateFileExistenceErr.message,
      );
  }

  protected async initializeWorksheet(
    templateFilePath: string,
    headers: any,
    workbook: Workbook,
  ): Promise<InitWorksheetDto> {
    await this.checkTemplateExistence(templateFilePath);

    const worksheet = workbook.addWorksheet(IMPORT_CONST.SHEET.DATA_SHEET_NAME);

    const headerNames = await Promise.all(
      headers.map((header) =>
        this.i18n.translate(
          header[IMPORT_CONST.POSITION.HEADER_NAME] as string,
        ),
      ),
    );

    const headerRow = worksheet.getRow(IMPORT_CONST.SHEET.HEADER_ROW);

    return {
      actionColIndex: IMPORT_ACTION.COL_INDEX,
      headers: headerNames,
      headerRow: headerRow,
      worksheet: worksheet,
    };
  }

  protected async formatTemplateSheet(
    headerRow: Row,
    worksheet: Worksheet,
    actionColIndex: number,
    colIndexes: any,
  ) {
    headerRow.getCell(actionColIndex).style = {
      fill: {
        type: IMPORT_CONST.TEMPLATE.FILL_TYPE,
        pattern: IMPORT_CONST.TEMPLATE.PATTERN,
        fgColor: IMPORT_CONST.TEMPLATE.ACTION_FILL_COLOR,
      },
      border: IMPORT_CONST.TEMPLATE.ROW_BORDER,
    };

    const rowAfterHeader = worksheet.getRow(IMPORT_CONST.SHEET.HEADER_ROW + 1);
    rowAfterHeader.getCell(actionColIndex).border =
      IMPORT_CONST.TEMPLATE.ROW_BORDER;

    // add border for header cells
    // iterate cells of all columns from action col to description col
    for (let i = actionColIndex; i <= colIndexes.DESCRIPTION; i++) {
      headerRow.getCell(i).style = {
        fill: {
          type: IMPORT_CONST.TEMPLATE.FILL_TYPE,
          pattern: IMPORT_CONST.TEMPLATE.PATTERN,
          fgColor: IMPORT_CONST.TEMPLATE.HEADERS_FILL_COLOR,
        },
        border: IMPORT_CONST.TEMPLATE.ROW_BORDER,
      };

      rowAfterHeader.getCell(i).border = IMPORT_CONST.TEMPLATE.ROW_BORDER;
    }

    headerRow.font = { bold: true };

    const actions = await Promise.all(
      IMPORT_CONST.ACTIONS.map((action) => this.i18n.translate(action)),
    );

    // add data validation for action
    rowAfterHeader.getCell(actionColIndex).dataValidation = {
      type: IMPORT_CONST.TEMPLATE.DATA_VALIDATION_TYPE,
      allowBlank: true,
      formulae: [
        `${actions.join(IMPORT_CONST.SHEET.DATA_VALIDATION_SEPARATOR)}`,
      ],
    };
  }

  protected async validateActionAndRowData(
    request: ValidateActionRowDataRequestDto,
  ): Promise<ValidateActionRowDataResponseDto> {
    const {
      inputAction,
      importResult,
      importResults,
      dataRowValues,
      totalCount,
      colOffset,
    } = request;

    let updatedTotalCount = totalCount;

    const [actionCreate, actionUpdate] = await Promise.all([
      this.i18n.translate(IMPORT_ACTION.CREATE),
      this.i18n.translate(IMPORT_ACTION.UPDATE),
    ]);

    let logs: string[];

    // validate data of row having IMPORT_ACTION.ADD or IMPORT_ACTION.UPDATE
    // before importing
    if (inputAction == actionCreate || inputAction == actionUpdate) {
      updatedTotalCount++;
      logs = await this.validateRowData(dataRowValues, colOffset);

      // if there is any error messages then push the validation result into
      // the results collection and skip importing current row
      if (!isEmpty(logs)) {
        importResult.log = logs.join(EOL);
        importResults.push(importResult);

        return { actionCreate, actionUpdate, updatedTotalCount };
      }
    } else return null;

    return { actionCreate, actionUpdate, updatedTotalCount };
  }
}
