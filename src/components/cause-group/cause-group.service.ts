import { Inject, Injectable } from '@nestjs/common';
import { ResponsePayload } from '@utils/response-payload';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { plainToClass } from 'class-transformer';
import { I18nRequestScopeService, I18nService } from 'nestjs-i18n';
import { CauseGroupServiceInterface } from '@components/cause-group/interface/cause-group.service.interface';
import { CauseGroupRepositoryInterface } from '@components/cause-group/interface/cause-group.repository.interface';
import { CauseGroupRequestDto } from '@components/cause-group/dto/request/cause-group.request.dto';
import { CauseGroupResponseDto } from '@components/cause-group/dto/response/cause-group.response.dto';
import { CauseGroup } from '@entities/cause-group/cause-group.entity';
import { ErrorMessageEnum } from '@constant/error-message.enum';
import { UpdateCauseGroupRequestDto } from '@components/cause-group/dto/request/update-cause-group.request.dto';
import { GetListCauseGroupRequestDto } from '@components/cause-group/dto/request/get-list-cause-group.request.dto';
import { PagingResponse } from '@utils/paging.response';
import { stringFormat, toStringTrim } from '@utils/object.util';
import { ErrorReportErrorDetailRepositoryInterface } from '@components/error-report/interface/error-report-error-detail.repository.interface';
import { ImportRequestDto } from '@core/dto/import/request/import.request.dto';
import { ImportResponseDto } from '@core/dto/import/response/import.response.dto';
import { CellValue, Row, Workbook } from 'exceljs';
import {
  FILE_EXPORT_CAUSE_GROUP_NAME,
  FILE_EXPORT_CAUSE_GROUP_HEADER,
} from '@components/cause-group/cause-group.constant';
import { isEmpty } from 'lodash';
import { CsvWriter } from '@core/csv/csv.write';
import { TIME_ZONE_VN } from '@constant/common';
import { extendMoment } from 'moment-range';
import * as MomentTimezone from 'moment-timezone';
import { CauseGroupDeleteRequestDto } from '@components/cause-group/dto/request/cause-group-delete.request.dto';
import { CheckOwnerPermissionServiceInterface } from '@components/check-owner-permission/interface/check-owner-permission.service.interface';
import {
  BASE_OWNER_DEPARTMENT_IDS,
  BASE_OWNER_ROLES_CODES,
} from '@components/check-owner-permission/check-owner-permission.constant';
import {
  FILE_TYPE,
  IMPORT_ACTION,
  IMPORT_CONST,
} from '@constant/import.constant';
import { CauseGroupImportResultDto } from '@components/cause-group/dto/response/cause-group.import.result.dto';
import { EOL } from 'os';
import { GetFileResponseDto } from '@core/dto/import/response/get-file.response.dto';
import { ImportDataAbstract } from '@core/abstracts/import-data.abstract';
import { ConfigService } from '@config/config.service';
import { CAUSE_GROUP_CONST } from '@components/cause-group/cause-group.constant';
import { join } from 'path';
import { readFile, stat } from 'fs/promises';
import { GetListCauseGroupResponseDto } from '@components/cause-group/dto/response/get-list-cause-group.response.dto';

const moment = extendMoment(MomentTimezone);

@Injectable()
export class CauseGroupService
  extends ImportDataAbstract
  implements CauseGroupServiceInterface
{
  constructor(
    @Inject('CauseGroupRepositoryInterface')
    private readonly causeGroupRepository: CauseGroupRepositoryInterface,

    @Inject('ErrorReportErrorDetailRepositoryInterface')
    private readonly errorReportErrorDetailRepository: ErrorReportErrorDetailRepositoryInterface,

    @Inject('CheckOwnerPermissionServiceInterface')
    private readonly checkOwnerPermissionService: CheckOwnerPermissionServiceInterface,

    protected readonly i18n: I18nRequestScopeService,

    protected readonly configService: ConfigService,
  ) {
    super(i18n, configService);
  }

  // Create error group
  public async create(
    causeGroupDto: CauseGroupRequestDto,
  ): Promise<ResponsePayload<CauseGroupResponseDto>> {
    try {
      const checkUniqueCauseGroupMsg = await this.checkUniqueCauseGroup(
        null,
        causeGroupDto,
      );

      if (checkUniqueCauseGroupMsg) {
        return new ResponseBuilder<CauseGroupResponseDto>()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(checkUniqueCauseGroupMsg)
          .build();
      }

      const causeGroup = this.causeGroupRepository.createEntity(causeGroupDto);

      return await this.save(causeGroup);
    } catch (err) {
      return new ResponseBuilder<CauseGroupResponseDto>()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  // Get detail of an error group
  public async getDetail(
    id: number,
  ): Promise<ResponsePayload<CauseGroupResponseDto | any>> {
    const result = await this.causeGroupRepository.findOneById(id);

    // if the error group with requested id is not found
    if (!result) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const response = plainToClass(CauseGroupResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async save(
    causeGroup: CauseGroup,
  ): Promise<ResponsePayload<CauseGroupResponseDto> | any> {
    try {
      const result = await this.causeGroupRepository.create(causeGroup);
      const response = plainToClass(CauseGroupResponseDto, result, {
        excludeExtraneousValues: true,
      });

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData(response)
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    }
  }

  private async checkUniqueCauseGroup(
    id: number,
    causeGroupDto: CauseGroupRequestDto,
  ): Promise<string> {
    const [existedRecordByCode, existedRecordByName] =
      await this.causeGroupRepository.getExistedRecord(id, causeGroupDto);

    const msg = await this.i18n.translate('error.DB_RECORD_EXISTED');

    if (existedRecordByCode && existedRecordByName) {
      return stringFormat(
        msg,
        `${CAUSE_GROUP_CONST.CODE.COL_NAME}, ${CAUSE_GROUP_CONST.NAME.COL_NAME}`,
      );
    } else if (existedRecordByCode) {
      return stringFormat(msg, CAUSE_GROUP_CONST.CODE.COL_NAME);
    } else if (existedRecordByName) {
      return stringFormat(msg, CAUSE_GROUP_CONST.NAME.COL_NAME);
    }

    return null;
  }

  public async updateById(
    causeGroupDto: UpdateCauseGroupRequestDto,
  ): Promise<ResponsePayload<CauseGroupResponseDto | any>> {
    const { user } = causeGroupDto;
    const causeGroup = await this.causeGroupRepository.findOneById(
      causeGroupDto.id,
    );

    if (!causeGroup) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    // check owner permission
    const isOwnerPermitted =
      await this.checkOwnerPermissionService.checkOwnerPermission({
        user: user,
        record: causeGroup,
        roleCodes: BASE_OWNER_ROLES_CODES,
        departmentIds: BASE_OWNER_DEPARTMENT_IDS,
      });

    if (!isOwnerPermitted) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAUSE_GROUP_NOT_OWNER'))
        .build();
    }

    const checkUniqueCauseGroupMsg = await this.checkUniqueCauseGroup(
      causeGroupDto.id,
      causeGroupDto,
    );

    if (checkUniqueCauseGroupMsg) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(checkUniqueCauseGroupMsg)
        .build();
    }

    causeGroup.code = causeGroupDto.code.trim();
    causeGroup.name = causeGroupDto.name.trim();
    causeGroup.description = causeGroupDto.description.trim();

    return await this.save(causeGroup);
  }

  public async delete(
    request: CauseGroupDeleteRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { user, id } = request;

    const causeGroup = await this.causeGroupRepository.findOneByCondition({
      id: id,
      deletedAt: null,
    });

    if (!causeGroup) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    // check owner permission
    const isOwnerPermitted =
      await this.checkOwnerPermissionService.checkOwnerPermission({
        user: user,
        record: causeGroup,
        roleCodes: BASE_OWNER_ROLES_CODES,
        departmentIds: BASE_OWNER_DEPARTMENT_IDS,
      });

    if (!isOwnerPermitted) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAUSE_GROUP_NOT_OWNER'))
        .build();
    }

    const errorReportErrorDetails =
      await this.errorReportErrorDetailRepository.findByCondition({
        causeGroupId: id,
      });

    if (!isEmpty(errorReportErrorDetails)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_DELETE'))
        .build();
    }

    try {
      await this.causeGroupRepository.softDelete(id);
      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(ErrorMessageEnum.CAN_NOT_DELETE)
        .build();
    }
  }

  public async getList(
    request: GetListCauseGroupRequestDto,
  ): Promise<ResponsePayload<GetListCauseGroupResponseDto | any>> {
    const { isExport, page } = request;
    const { result, count } = await this.causeGroupRepository.getList(request);

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
      csvWriter.name = FILE_EXPORT_CAUSE_GROUP_NAME;
      csvWriter.mapHeader = FILE_EXPORT_CAUSE_GROUP_HEADER;
      csvWriter.i18n = this.i18n;

      return new ResponseBuilder<any>({
        file: await csvWriter.writeCsv(dataExport),
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();
    }

    const items = plainToClass(CauseGroupResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder<PagingResponse>({
      items: items,
      meta: { total: count, page: page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async getAll(): Promise<any> {
    const result = await this.causeGroupRepository.getListForErrorReport();
    const items = plainToClass(CauseGroupResponseDto, result, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(items)
      .build();
  }

  /**
   * Import function for service interface
   * @param request Import request dto
   */
  public async import(
    request: ImportRequestDto,
  ): Promise<ResponsePayload<ImportResponseDto>> {
    return this.importUtil(request, CAUSE_GROUP_CONST.IMPORT.HEADERS);
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

    const colIndexes = CAUSE_GROUP_CONST.IMPORT.COL_INDEX;

    // iterate every cell of the row
    for (
      let colIndex = colOffset;
      colIndex < dataRowValues.length;
      colIndex++
    ) {
      const cellValue = toStringTrim(dataRowValues[colIndex]);

      switch (colIndex) {
        case colIndexes.CODE:
          const causeGroupConstCode = CAUSE_GROUP_CONST.CODE;

          await this.validateRequiredField(
            logs,
            causeGroupConstCode.COL_NAME,
            cellValue,
            causeGroupConstCode.MAX_LENGTH,
          );

          break;

        case colIndexes.NAME:
          const causeGroupConstName = CAUSE_GROUP_CONST.NAME;

          await this.validateRequiredField(
            logs,
            causeGroupConstName.COL_NAME,
            cellValue,
            causeGroupConstName.MAX_LENGTH,
          );

          break;

        case colIndexes.DESCRIPTION:
          const causeGroupConstDescription = CAUSE_GROUP_CONST.DESCRIPTION;

          await this.validateMaxLength(
            logs,
            causeGroupConstDescription.COL_NAME,
            cellValue,
            causeGroupConstDescription.MAX_LENGTH,
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
    const colIndexes = CAUSE_GROUP_CONST.IMPORT.COL_INDEX;

    const causeGroupDto: CauseGroupRequestDto = {
      code: toStringTrim(dataRowValues[colIndexes.CODE]),
      name: toStringTrim(dataRowValues[colIndexes.NAME]),
      description: toStringTrim(dataRowValues[colIndexes.DESCRIPTION]),
      request: null,
      responseError: null,
      userId: null,
    };

    const inputAction = toStringTrim(dataRowValues[IMPORT_ACTION.COL_INDEX]);

    const result: CauseGroupImportResultDto = {
      log: null,
      action: inputAction,
      id: null,
      code: causeGroupDto.code,
      name: causeGroupDto.name,
      description: causeGroupDto.description,
    };

    return { causeGroupDto, inputAction, importResult: result };
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
    const importResults: CauseGroupImportResultDto[] = [];

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

      const { causeGroupDto, inputAction, importResult } =
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

      let saveDbResult: ResponsePayload<CauseGroupResponseDto>;

      switch (inputAction) {
        case actionCreate:
          saveDbResult = await this.create(causeGroupDto);
          break;

        case actionUpdate:
          saveDbResult = await this.updateByCode(causeGroupDto);
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
      CAUSE_GROUP_CONST.ENTITY_NAME,
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
    const colIndexes = CAUSE_GROUP_CONST.IMPORT.COL_INDEX;
    const workbook = new Workbook();

    const { actionColIndex, headers, headerRow, worksheet } =
      await this.initializeWorksheet(
        templateFilePath,
        CAUSE_GROUP_CONST.IMPORT.HEADERS,
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

  public async updateByCode(
    request: CauseGroupRequestDto,
  ): Promise<ResponsePayload<CauseGroupResponseDto>> {
    const causeGroup = await this.causeGroupRepository.findOneByCondition({
      code: request.code,
    });

    const requestWithId = plainToClass(UpdateCauseGroupRequestDto, request);

    requestWithId.id = causeGroup?.id;

    return await this.update(causeGroup, requestWithId);
  }

  private async update(
    causeGroup: CauseGroup,
    request: UpdateCauseGroupRequestDto,
  ) {
    if (!causeGroup) {
      return new ResponseBuilder<CauseGroupResponseDto>()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const checkUniqueCauseGroupMsg = await this.checkUniqueCauseGroup(
      request.id,
      request,
    );

    if (checkUniqueCauseGroupMsg) {
      return new ResponseBuilder<CauseGroupResponseDto>()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(checkUniqueCauseGroupMsg)
        .build();
    }

    causeGroup.code = request.code.trim();
    causeGroup.name = request.name.trim();
    causeGroup.description = request.description?.trim();

    return await this.save(causeGroup);
  }
}
