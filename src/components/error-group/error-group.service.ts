import { Inject, Injectable } from '@nestjs/common';
import { ResponsePayload } from '@utils/response-payload';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { plainToClass } from 'class-transformer';
import { I18nRequestScopeService, I18nService } from 'nestjs-i18n';
import { ErrorGroupServiceInterface } from '@components/error-group/interface/error-group.service.interface';
import { ErrorGroupRepositoryInterface } from '@components/error-group/interface/error-group.repository.interface';
import { ErrorGroupRequestDto } from '@components/error-group/dto/request/error-group.request.dto';
import { ErrorGroupResponseDto } from '@components/error-group/dto/response/error-group.response.dto';
import { ErrorGroup } from '@entities/error-group/error-group.entity';
import { ErrorMessageEnum } from '@constant/error-message.enum';
import { UpdateErrorGroupRequestDto } from '@components/error-group/dto/request/update-error-group.request.dto';
import { GetListErrorGroupResponseDto } from '@components/error-group/dto/response/get-list-error-group.response.dto';
import { GetListErrorGroupRequestDto } from '@components/error-group/dto/request/get-list-error-group.request.dto';
import { PagingResponse } from '@utils/paging.response';
import { ImportRequestDto } from '@core/dto/import/request/import.request.dto';
import { ImportResponseDto } from '@core/dto/import/response/import.response.dto';
import { CellValue, Row, Workbook } from 'exceljs';
import {
  FILE_TYPE,
  IMPORT_ACTION,
  IMPORT_CONST,
} from '@constant/import.constant';
import { ImportDataAbstract } from '@core/abstracts/import-data.abstract';
import { EOL } from 'os';
import { ErrorGroupImportResultDto } from '@components/error-group/dto/response/error-group.import.result.dto';
import { stringFormat, toStringTrim } from '@utils/object.util';
import { ConfigService } from '@config/config.service';
import { join } from 'path';
import { GetFileResponseDto } from '@core/dto/import/response/get-file.response.dto';
import { CheckListDetailRepositoryInterface } from '@components/check-list/interface/check-list-detail.repository.interface';
import { isEmpty } from 'lodash';
import { ERROR_GROUP_CONST } from '@components/error-group/error-group.constant';
import { readFile, stat } from 'fs/promises';
import {
  FILE_EXPORT_ERROR_GROUP_NAME,
  FILE_EXPORT_ERROR_GROUP_HEADER,
} from '@components/error-group/error-group.constant';
import { CsvWriter } from '@core/csv/csv.write';
import { TIME_ZONE_VN } from '@constant/common';
import { extendMoment } from 'moment-range';
import * as MomentTimezone from 'moment-timezone';
import { DeleteErrorGroupRequestDto } from '@components/error-group/dto/request/delete-error-group.request.dto';
import {
  BASE_OWNER_DEPARTMENT_IDS,
  BASE_OWNER_ROLES_CODES,
} from '@components/check-owner-permission/check-owner-permission.constant';
import { CheckOwnerPermissionServiceInterface } from '@components/check-owner-permission/interface/check-owner-permission.service.interface';

const moment = extendMoment(MomentTimezone);

@Injectable()
export class ErrorGroupService
  extends ImportDataAbstract
  implements ErrorGroupServiceInterface
{
  constructor(
    @Inject('ErrorGroupRepositoryInterface')
    private readonly errorGroupRepository: ErrorGroupRepositoryInterface,

    @Inject('CheckListDetailRepositoryInterface')
    private readonly checkListDetailRepository: CheckListDetailRepositoryInterface,

    protected readonly i18n: I18nRequestScopeService,

    @Inject('CheckOwnerPermissionServiceInterface')
    private readonly checkOwnerPermissionService: CheckOwnerPermissionServiceInterface,

    protected readonly configService: ConfigService,
  ) {
    super(i18n, configService);
  }

  // Create error group
  public async create(
    errorGroupDto: ErrorGroupRequestDto,
  ): Promise<ResponsePayload<ErrorGroupResponseDto>> {
    try {
      const checkUniqueErrorGroupMsg = await this.checkUniqueErrorGroup(
        null,
        errorGroupDto,
      );

      if (checkUniqueErrorGroupMsg) {
        return new ResponseBuilder<ErrorGroupResponseDto>()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(checkUniqueErrorGroupMsg)
          .build();
      }

      const errorGroup = this.errorGroupRepository.createEntity(errorGroupDto);

      return await this.save(errorGroup);
    } catch (err) {
      return new ResponseBuilder<ErrorGroupResponseDto>()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  // Get detail of an error group
  public async getDetail(
    id: number,
  ): Promise<ResponsePayload<ErrorGroupResponseDto> | any> {
    const result = await this.errorGroupRepository.findOneById(id);

    // if the error group with requested id is not found
    if (!result) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const response = plainToClass(ErrorGroupResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async save(
    errorGroup: ErrorGroup,
  ): Promise<ResponsePayload<ErrorGroupResponseDto>> {
    try {
      const result = await this.errorGroupRepository.create(errorGroup);
      const response = plainToClass(ErrorGroupResponseDto, result, {
        excludeExtraneousValues: true,
      });

      return new ResponseBuilder<ErrorGroupResponseDto>()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData(response)
        .build();
    } catch (error) {
      return new ResponseBuilder<ErrorGroupResponseDto>()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  private async checkUniqueErrorGroup(
    id: number,
    errorGroupDto: ErrorGroupRequestDto,
  ): Promise<string> {
    const [existedRecordByCode, existedRecordByName] =
      await this.errorGroupRepository.getExistedRecord(id, errorGroupDto);

    let msg: string;

    if (existedRecordByCode || existedRecordByName)
      msg = await this.i18n.translate('error.DB_RECORD_EXISTED');

    if (existedRecordByCode && existedRecordByName) {
      return stringFormat(
        msg,
        `${ERROR_GROUP_CONST.CODE.COL_NAME}, ${ERROR_GROUP_CONST.NAME.COL_NAME}`,
      );
    } else if (existedRecordByCode) {
      return stringFormat(msg, ERROR_GROUP_CONST.CODE.COL_NAME);
    } else if (existedRecordByName) {
      return stringFormat(msg, ERROR_GROUP_CONST.NAME.COL_NAME);
    }

    return null;
  }

  public async updateById(
    errorGroupDto: UpdateErrorGroupRequestDto,
  ): Promise<ResponsePayload<ErrorGroupResponseDto | any>> {
    const errorGroup = await this.errorGroupRepository.findOneById(
      errorGroupDto.id,
    );

    if (!errorGroup) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    // check owner permission
    const isOwnerPermitted =
      await this.checkOwnerPermissionService.checkOwnerPermission({
        user: errorGroupDto.user,
        record: errorGroup,
        roleCodes: BASE_OWNER_ROLES_CODES,
        departmentIds: BASE_OWNER_DEPARTMENT_IDS,
      });

    if (!isOwnerPermitted) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.ERROR_GROUP_NOT_OWNER'))
        .build();
    }

    const checkUniqueErrorGroupMsg = await this.checkUniqueErrorGroup(
      errorGroupDto.id,
      errorGroupDto,
    );

    if (checkUniqueErrorGroupMsg) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(checkUniqueErrorGroupMsg)
        .build();
    }

    errorGroup.code = errorGroupDto.code.trim();
    errorGroup.name = errorGroupDto.name.trim();
    errorGroup.description = errorGroupDto.description?.trim();

    return await this.save(errorGroup);
  }

  public async delete(
    request: DeleteErrorGroupRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { user, id } = request;

    const errorGroup = await this.errorGroupRepository.findOneByCondition({
      id: id,
      deletedAt: null,
    });

    if (!errorGroup) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    // check owner permission
    const isOwnerPermitted =
      await this.checkOwnerPermissionService.checkOwnerPermission({
        user: user,
        record: errorGroup,
        roleCodes: BASE_OWNER_ROLES_CODES,
        departmentIds: BASE_OWNER_DEPARTMENT_IDS,
      });

    if (!isOwnerPermitted) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.ERROR_GROUP_NOT_OWNER'))
        .build();
    }

    const checkListDetails =
      await this.checkListDetailRepository.findByCondition({
        errorGroupId: id,
      });

    if (!isEmpty(checkListDetails)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_DELETE'))
        .build();
    }

    try {
      await this.errorGroupRepository.softDelete(id);
      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(ErrorMessageEnum.CAN_NOT_DELETE)
        .build();
    }
  }

  public async getList(
    request: GetListErrorGroupRequestDto,
  ): Promise<ResponsePayload<GetListErrorGroupResponseDto | any>> {
    const { isExport, page } = request;
    const { result, count } = await this.errorGroupRepository.getList(request);

    if (isEmpty(result) && !isExport) {
      return new ResponseBuilder<PagingResponse>({
        items: [],
        meta: { total: 0, page: 0 },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    }

    if (isExport) {
      let dataExport = result.reduce((x, y) => {
        x.push({
          id: y?.id ? y.id : '',
          code: y?.code ? y.code : '',
          name: y?.name ? y.name : '',
          description: y?.description ? y.description : '',
          createdAt: y?.createdAt
            ? moment(y.createdAt).tz(TIME_ZONE_VN).format('YYYY-MM-DD hh:mm A')
            : '',
        });

        return x;
      }, []);

      if (isEmpty(dataExport)) {
        dataExport = [
          {
            id: '',
            code: '',
            name: '',
            description: '',
            createdAt: '',
          },
        ];
      }

      const csvWriter = new CsvWriter();
      csvWriter.name = FILE_EXPORT_ERROR_GROUP_NAME;
      csvWriter.mapHeader = FILE_EXPORT_ERROR_GROUP_HEADER;
      csvWriter.i18n = this.i18n;

      return new ResponseBuilder<any>({
        file: await csvWriter.writeCsv(dataExport),
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();
    }

    const response = plainToClass(ErrorGroupResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder<PagingResponse>({
      items: response,
      meta: { total: count, page: page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  /**
   * Import function for service interface
   * @param request Import request dto
   */
  public async import(
    request: ImportRequestDto,
  ): Promise<ResponsePayload<ImportResponseDto>> {
    return this.importUtil(request, ERROR_GROUP_CONST.IMPORT.HEADERS);
  }

  /**
   * Validate a data row of imported data rows
   * @param dataRowValues Row of data
   * @param colOffset Column index offset
   * @protected Log of validated row
   */
  protected async validateRowData(
    dataRowValues: string[] | CellValue[] | { [key: string]: CellValue },
    colOffset: number,
  ): Promise<string[]> {
    const logs = await this.getActionValidationMessages(dataRowValues);

    const colIndexes = ERROR_GROUP_CONST.IMPORT.COL_INDEX;

    // iterate every cell of the row
    for (
      let colIndex = colOffset;
      colIndex < dataRowValues.length;
      colIndex++
    ) {
      const cellValue = toStringTrim(dataRowValues[colIndex]);

      switch (colIndex) {
        case colIndexes.CODE:
          const errorGroupConstCode = ERROR_GROUP_CONST.CODE;

          await this.validateRequiredField(
            logs,
            errorGroupConstCode.COL_NAME,
            cellValue,
            errorGroupConstCode.MAX_LENGTH,
          );

          break;

        case colIndexes.NAME:
          const errorGroupConstName = ERROR_GROUP_CONST.NAME;

          await this.validateRequiredField(
            logs,
            errorGroupConstName.COL_NAME,
            cellValue,
            errorGroupConstName.MAX_LENGTH,
          );

          break;

        case colIndexes.DESCRIPTION:
          const errorGroupConstDescription = ERROR_GROUP_CONST.DESCRIPTION;

          await this.validateMaxLength(
            logs,
            errorGroupConstDescription.COL_NAME,
            cellValue,
            errorGroupConstDescription.MAX_LENGTH,
          );

          break;

        default:
          break;
      }
    }

    return logs;
  }

  /**
   * Get data in each cell of the row
   * @param dataRowValues Row of data
   * @protected An object including:
   *
   * - A dto for the entity to be created/updated in DB
   * - The action defined in the row
   * - The import result dto to be manipulated later
   */
  protected getRowData(
    dataRowValues: string[] | CellValue[] | { [p: string]: CellValue },
  ) {
    const colIndexes = ERROR_GROUP_CONST.IMPORT.COL_INDEX;

    const errorGroupDto: ErrorGroupRequestDto = {
      code: toStringTrim(dataRowValues[colIndexes.CODE]),
      name: toStringTrim(dataRowValues[colIndexes.NAME]),
      description: toStringTrim(dataRowValues[colIndexes.DESCRIPTION]),
      request: null,
      responseError: null,
      userId: null,
    };

    const inputAction = toStringTrim(dataRowValues[IMPORT_ACTION.COL_INDEX]);

    const result: ErrorGroupImportResultDto = {
      log: null,
      action: inputAction,
      id: null,
      code: errorGroupDto.code,
      name: errorGroupDto.name,
      description: errorGroupDto.description,
    };

    return { errorGroupDto, inputAction, importResult: result };
  }

  /**
   * Save imported data to DB
   * @param fileName Imported file's name
   * @param fileType Imported file's type
   * @param dataRows Imported file's data in rows
   * @param colOffset Column offset
   * @protected Import response dto
   */
  protected async saveImportData(
    fileName: string,
    fileType: string,
    dataRows: Row[] | Array<Array<string>>,
    colOffset: number,
  ): Promise<ImportResponseDto> {
    const importResults: ErrorGroupImportResultDto[] = [];

    let totalCount = 0;
    let successCount = 0;

    // iterate every row of data rows start from IMPORT_CONST.SHEET.HEADER_ROW
    for (
      let rowIndex = IMPORT_CONST.SHEET.HEADER_ROW;
      rowIndex < dataRows.length;
      rowIndex++
    ) {
      let dataRowValues: any = dataRows[rowIndex];

      // if file type is xlsx then extract cells' data using exceljs' "values" property
      if (fileType == FILE_TYPE.XLSX.MIME_TYPE)
        dataRowValues = dataRows[rowIndex].values;

      const { errorGroupDto, inputAction, importResult } =
        this.getRowData(dataRowValues);

      const validateActionAndRowDataResult =
        await this.validateActionAndRowData({
          inputAction,
          dataRowValues,
          totalCount,
          colOffset,
          importResults,
          importResult,
        });

      if (!validateActionAndRowDataResult) continue;

      const { actionCreate, actionUpdate, updatedTotalCount } =
        validateActionAndRowDataResult;

      totalCount = updatedTotalCount;

      let saveDbResult: ResponsePayload<ErrorGroupResponseDto>;

      switch (inputAction) {
        case actionCreate:
          saveDbResult = await this.create(errorGroupDto);
          break;

        case actionUpdate:
          saveDbResult = await this.updateByCode(errorGroupDto);
          break;

        default:
          break;
      }

      successCount = await this.handleImportedRow(
        saveDbResult,
        importResult,
        importResults,
        successCount,
      );
    }

    return {
      // logFileName: await this.writeLog(Papa.unparse(importResults)),
      logFileName: null,
      mimeType: FILE_TYPE.CSV.MIME_TYPE,
      result: importResults,
      totalCount: totalCount,
      successCount: successCount,
    };
  }

  public async getImportTemplate(): Promise<
    ResponsePayload<GetFileResponseDto>
  > {
    const templateFileName = stringFormat(
      IMPORT_CONST.TEMPLATE.FILE_NAME,
      ERROR_GROUP_CONST.ENTITY_NAME,
    );

    const templateFilePath = join(this.templateDir, templateFileName);

    try {
      await stat(templateFilePath);

      const result: GetFileResponseDto = {
        fileName: templateFileName,
        fileContent: await readFile(templateFilePath),
      };

      return new ResponseBuilder<GetFileResponseDto>()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData(result)
        .build();
    } catch (err) {
      if (err.code != IMPORT_CONST.ERR_CODE.FILE_NOT_FOUND)
        return new ResponseBuilder<GetFileResponseDto>()
          .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
          .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
          .build();

      await this.createTemplateFile(templateFilePath);
    }
  }

  protected async createTemplateFile(templateFilePath: string): Promise<void> {
    const colIndexes = ERROR_GROUP_CONST.IMPORT.COL_INDEX;
    const workbook = new Workbook();

    const { actionColIndex, headers, headerRow, worksheet } =
      await this.initializeWorksheet(
        templateFilePath,
        ERROR_GROUP_CONST.IMPORT.HEADERS,
        workbook,
      );

    // resize sheet columns
    worksheet.columns = [
      { header: headers[actionColIndex - 1], width: 25 },
      { header: headers[colIndexes.CODE - 1], width: 17.5 },
      { header: headers[colIndexes.NAME - 1], width: 50 },
      { header: headers[colIndexes.DESCRIPTION - 1], width: 75 },
    ];

    await this.formatTemplateSheet(
      headerRow,
      worksheet,
      actionColIndex,
      colIndexes,
    );

    await workbook.xlsx.writeFile(templateFilePath);
  }

  public async getListByTransactionHistoryId(
    transactionHistoryId: number,
  ): Promise<any> {
    const response =
      await this.errorGroupRepository.getListByTransactionHistoryId(
        transactionHistoryId,
      );
    return response;
  }

  public async updateByCode(
    request: ErrorGroupRequestDto,
  ): Promise<ResponsePayload<ErrorGroupResponseDto>> {
    const errorGroup = await this.errorGroupRepository.findOneByCode(
      request.code,
    );

    const requestWithId = plainToClass(UpdateErrorGroupRequestDto, request);

    requestWithId.id = errorGroup?.id;

    return await this.update(errorGroup, requestWithId);
  }

  private async update(
    errorGroup: ErrorGroup,
    request: UpdateErrorGroupRequestDto,
  ) {
    if (!errorGroup) {
      return new ResponseBuilder<ErrorGroupResponseDto>()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const checkUniqueErrorGroupMsg = await this.checkUniqueErrorGroup(
      request.id,
      request,
    );

    if (checkUniqueErrorGroupMsg) {
      return new ResponseBuilder<ErrorGroupResponseDto>()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(checkUniqueErrorGroupMsg)
        .build();
    }

    errorGroup.code = request.code.trim();
    errorGroup.name = request.name.trim();
    errorGroup.description = request.description?.trim();

    return await this.save(errorGroup);
  }

  public async getDetailByCode(
    code: string,
  ): Promise<ResponsePayload<ErrorGroupResponseDto> | any> {
    const result = await this.errorGroupRepository.findOneByCode(code);

    // if the error group with requested id is not found
    if (!result) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const response = plainToClass(ErrorGroupResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }
}
