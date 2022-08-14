import { Inject, Injectable } from '@nestjs/common';
import { ResponsePayload } from '@utils/response-payload';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { plainToClass } from 'class-transformer';
import { I18nRequestScopeService, I18nService } from 'nestjs-i18n';
import { ErrorMessageEnum } from '@constant/error-message.enum';
import { stringFormat, toStringTrim } from '@utils/object.util';
import {
  FILE_EXPORT_ACTION_CATEGORY_NAME,
  FILE_EXPORT_ACTION_CATEGORY_HEADER,
  ACTION_CATEGORY_CONST,
} from '@components/action-category/action-category.constant';
import { PagingResponse } from '@utils/paging.response';
import { ActionCategoryServiceInterface } from '@components/action-category/interface/action-category.service.interface';
import { ActionCategoryRepositoryInterface } from '@components/action-category/interface/action-category.repository.interface';
import { ActionCategoryRequestDto } from '@components/action-category/dto/request/action-category.request.dto';
import { ActionCategoryResponseDto } from '@components/action-category/dto/response/action-category.response.dto';
import { ActionCategory } from '@entities/action-category/action-category.entity';
import { UpdateActionCategoryRequestDto } from '@components/action-category/dto/request/update-action-category.request.dto';
import { GetListActionCategoryRequestDto } from '@components/action-category/dto/request/get-list-action-category.request.dto';
import { GetListActionCategoryResponseDto } from '@components/action-category/dto/response/get-list-action-category.response.dto';
import { ImportDataAbstract } from '@core/abstracts/import-data.abstract';
import { ConfigService } from '@config/config.service';
import { ImportResponseDto } from '@core/dto/import/response/import.response.dto';
import { ERROR_GROUP_CONST } from '@components/error-group/error-group.constant';
import { CellValue, Row, Workbook } from 'exceljs';
import { ErrorGroupImportResultDto } from '@components/error-group/dto/response/error-group.import.result.dto';
import {
  FILE_TYPE,
  IMPORT_ACTION,
  IMPORT_CONST,
} from '@constant/import.constant';
import { isEmpty } from 'lodash';
import { EOL } from 'os';
import { ActionCategoryImportResultDto } from '@components/action-category/dto/response/action-category.import.result.dto';
import { CsvWriter } from '@core/csv/csv.write';
import { TIME_ZONE_VN } from '@constant/common';
import { extendMoment } from 'moment-range';
import * as MomentTimezone from 'moment-timezone';
import { CheckOwnerPermissionServiceInterface } from '@components/check-owner-permission/interface/check-owner-permission.service.interface';
import {
  BASE_OWNER_DEPARTMENT_IDS,
  BASE_OWNER_ROLES_CODES,
} from '@components/check-owner-permission/check-owner-permission.constant';
import { DeleteActionCategoryRequestDto } from '@components/action-category/dto/request/delete-action-category.request.dto';

const moment = extendMoment(MomentTimezone);

@Injectable()
export class ActionCategoryService
  extends ImportDataAbstract
  implements ActionCategoryServiceInterface
{
  constructor(
    @Inject('ActionCategoryRepositoryInterface')
    private readonly actionCategoryRepository: ActionCategoryRepositoryInterface,

    @Inject('CheckOwnerPermissionServiceInterface')
    private readonly checkOwnerPermissionService: CheckOwnerPermissionServiceInterface,

    protected readonly i18n: I18nRequestScopeService,

    protected readonly configService: ConfigService,
  ) {
    super(i18n, configService);
  }

  public async getList(
    request: GetListActionCategoryRequestDto,
  ): Promise<ResponsePayload<GetListActionCategoryResponseDto | any>> {
    const { isExport, page } = request;
    const { result, count } = await this.actionCategoryRepository.getList(
      request,
    );

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
      csvWriter.name = FILE_EXPORT_ACTION_CATEGORY_NAME;
      csvWriter.mapHeader = FILE_EXPORT_ACTION_CATEGORY_HEADER;
      csvWriter.i18n = this.i18n;

      return new ResponseBuilder<any>({
        file: await csvWriter.writeCsv(dataExport),
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();
    }

    const response = plainToClass(ActionCategoryResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder<PagingResponse>({
      items: response,
      meta: { total: count, page: page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async getDetail(
    id: number,
  ): Promise<ResponsePayload<ActionCategoryResponseDto | any>> {
    const result = await this.actionCategoryRepository.findOneById(id);

    if (!result) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const response = plainToClass(ActionCategoryResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async create(
    actionCategoryDto: ActionCategoryRequestDto,
  ): Promise<ResponsePayload<ActionCategoryResponseDto | any>> {
    const checkUnique = await this.checkUnique(null, actionCategoryDto);

    if (checkUnique) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(checkUnique)
        .build();
    }

    const actionCategoryEntity =
      await this.actionCategoryRepository.createEntity(actionCategoryDto);

    return await this.save(actionCategoryEntity);
  }

  public async save(
    actionCategory: ActionCategory,
  ): Promise<ResponsePayload<ActionCategoryResponseDto> | any> {
    try {
      const result = await this.actionCategoryRepository.create(actionCategory);
      const response = plainToClass(ActionCategoryResponseDto, result, {
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

  public async updateById(
    actionCategoryDto: UpdateActionCategoryRequestDto,
  ): Promise<ResponsePayload<ActionCategoryResponseDto | any>> {
    const { user } = actionCategoryDto;
    const actionCategory = await this.actionCategoryRepository.findOneById(
      actionCategoryDto.id,
    );

    if (!actionCategory) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    // check owner permission
    const isOwnerPermitted =
      await this.checkOwnerPermissionService.checkOwnerPermission({
        user: user,
        record: actionCategory,
        roleCodes: BASE_OWNER_ROLES_CODES,
        departmentIds: BASE_OWNER_DEPARTMENT_IDS,
      });

    if (!isOwnerPermitted) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.ACTION_CATEGORY_NOT_OWNER'),
        )
        .build();
    }
    const checkUnique = await this.checkUnique(
      actionCategoryDto.id,
      actionCategoryDto,
    );

    if (checkUnique) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(checkUnique)
        .build();
    }

    actionCategory.code = actionCategoryDto.code.trim();
    actionCategory.name = actionCategoryDto.name.trim();
    actionCategory.description = actionCategoryDto.description.trim();

    return await this.save(actionCategory);
  }

  public async delete(
    request: DeleteActionCategoryRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { user, id } = request;
    const actionCategory =
      await this.actionCategoryRepository.findOneByCondition({
        id: id,
        deletedAt: null,
      });

    if (!actionCategory) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    // check owner permission
    const isOwnerPermitted =
      await this.checkOwnerPermissionService.checkOwnerPermission({
        user: user,
        record: actionCategory,
        roleCodes: BASE_OWNER_ROLES_CODES,
        departmentIds: BASE_OWNER_DEPARTMENT_IDS,
      });

    if (!isOwnerPermitted) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.ACTION_CATEGORY_NOT_OWNER'),
        )
        .build();
    }

    try {
      await this.actionCategoryRepository.softDelete(id);
      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(ErrorMessageEnum.CAN_NOT_DELETE)
        .build();
    }
  }

  private async checkUnique(
    id: number,
    actionCategoryDto: ActionCategoryRequestDto,
  ): Promise<string> {
    const [existedRecordByCode, existedRecordByName] =
      await this.actionCategoryRepository.getExistedRecord(
        id,
        actionCategoryDto,
      );

    const msg = await this.i18n.translate('error.DB_RECORD_EXISTED');

    if (existedRecordByCode && existedRecordByName) {
      return stringFormat(
        msg,
        `${ACTION_CATEGORY_CONST.CODE.COL_NAME}, ${ACTION_CATEGORY_CONST.NAME.COL_NAME}`,
      );
    } else if (existedRecordByCode) {
      return stringFormat(msg, ACTION_CATEGORY_CONST.CODE.COL_NAME);
    } else if (existedRecordByName) {
      return stringFormat(msg, ACTION_CATEGORY_CONST.NAME.COL_NAME);
    }

    return null;
  }

  public async getListAll(): Promise<any> {
    const result = await this.actionCategoryRepository.getListAll();

    const response = plainToClass(ActionCategoryResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  protected async createTemplateFile(templateFilePath: string): Promise<void> {
    const colIndexes = ACTION_CATEGORY_CONST.IMPORT.COL_INDEX;
    const workbook = new Workbook();

    const { actionColIndex, headers, headerRow, worksheet } =
      await this.initializeWorksheet(
        templateFilePath,
        ACTION_CATEGORY_CONST.IMPORT.HEADERS,
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

  protected getRowData(
    dataRowValues: string[] | CellValue[] | { [p: string]: CellValue },
  ) {
    const colIndexes = ACTION_CATEGORY_CONST.IMPORT.COL_INDEX;

    const actionCategoryRequestDto: ActionCategoryRequestDto = {
      code: toStringTrim(dataRowValues[colIndexes.CODE]),
      name: toStringTrim(dataRowValues[colIndexes.NAME]),
      description: toStringTrim(dataRowValues[colIndexes.DESCRIPTION]),
      request: null,
      responseError: null,
      userId: null,
    };

    const inputAction = toStringTrim(dataRowValues[IMPORT_ACTION.COL_INDEX]);

    const result: ActionCategoryImportResultDto = {
      log: null,
      action: inputAction,
      id: null,
      code: actionCategoryRequestDto.code,
      name: actionCategoryRequestDto.name,
      description: actionCategoryRequestDto.description,
    };

    return { actionCategoryRequestDto, inputAction, importResult: result };
  }

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

      const { actionCategoryRequestDto, inputAction, importResult } =
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

      let saveDbResult: ResponsePayload<ActionCategoryResponseDto>;

      switch (inputAction) {
        case actionCreate:
          saveDbResult = await this.create(actionCategoryRequestDto);
          break;

        case actionUpdate:
          saveDbResult = await this.updateByCode(actionCategoryRequestDto);
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

  protected async validateRowData(
    dataRowValues: string[] | CellValue[] | { [key: string]: CellValue },
    colOffset: number,
  ): Promise<string[]> {
    const logs = await this.getActionValidationMessages(dataRowValues);

    const colIndexes = ACTION_CATEGORY_CONST.IMPORT.COL_INDEX;

    // iterate every cell of the row
    for (
      let colIndex = colOffset;
      colIndex < dataRowValues.length;
      colIndex++
    ) {
      const cellValue = toStringTrim(dataRowValues[colIndex]);

      switch (colIndex) {
        case colIndexes.CODE:
          const actionCategoryCodeConst = ACTION_CATEGORY_CONST.CODE;

          await this.validateRequiredField(
            logs,
            actionCategoryCodeConst.COL_NAME,
            cellValue,
            actionCategoryCodeConst.MAX_LENGTH,
          );

          break;

        case colIndexes.NAME:
          const actionCategoryNameConst = ACTION_CATEGORY_CONST.NAME;

          await this.validateRequiredField(
            logs,
            actionCategoryNameConst.COL_NAME,
            cellValue,
            actionCategoryNameConst.MAX_LENGTH,
          );

          break;

        case colIndexes.DESCRIPTION:
          const actionCategoryDescriptionConst = ERROR_GROUP_CONST.DESCRIPTION;

          await this.validateMaxLength(
            logs,
            actionCategoryDescriptionConst.COL_NAME,
            cellValue,
            actionCategoryDescriptionConst.MAX_LENGTH,
          );

          break;

        default:
          break;
      }
    }

    return logs;
  }

  public async updateByCode(
    request: ActionCategoryRequestDto,
  ): Promise<ResponsePayload<ActionCategoryResponseDto>> {
    const actionCategory = await this.actionCategoryRepository.findOneByCode(
      request.code,
    );

    const requestWithId = plainToClass(UpdateActionCategoryRequestDto, request);

    requestWithId.id = actionCategory?.id;

    return await this.update(actionCategory, requestWithId);
  }

  private async update(
    actionCategory: ActionCategory,
    request: UpdateActionCategoryRequestDto,
  ) {
    if (!actionCategory) {
      return new ResponseBuilder<ActionCategoryResponseDto>()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const checkUniqueActionCategoryMsg = await this.checkUnique(
      request.id,
      request,
    );

    if (checkUniqueActionCategoryMsg) {
      return new ResponseBuilder<ActionCategoryResponseDto>()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(checkUniqueActionCategoryMsg)
        .build();
    }

    actionCategory.code = request.code.trim();
    actionCategory.name = request.name.trim();
    actionCategory.description = request.description?.trim();

    return await this.save(actionCategory);
  }
}
