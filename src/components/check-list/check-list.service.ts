import { Inject, Injectable } from '@nestjs/common';
import { ResponsePayload } from '@utils/response-payload';
import { InjectConnection } from '@nestjs/typeorm';
import { PagingResponse } from '@utils/paging.response';
import { Connection, getRepository, Not } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { isEmpty, uniq } from 'lodash';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { ApiError } from '@utils/api.error';
import { I18nRequestScopeService, I18nService } from 'nestjs-i18n';
import { SuccessResponse } from '@utils/success.response.dto';
import { ItemService } from '@components/item/item.service';
import { CheckList } from '@entities/check-list/check-list.entity';
import { CheckListRepositoryInterface } from '@components/check-list/interface/check-list.repository.interface';
import { CheckListServiceInterface } from '@components/check-list/interface/check-list.service.interface';
import {
  CheckListDetailRequestDto,
  CheckListRequestDto,
} from '@components/check-list/dto/request/check-list.request.dto';
import {
  CheckListDetailResponseDto,
  CheckListResponseDto,
} from '@components/check-list/dto/response/check-list.response.dto';
import { ErrorGroupRepositoryInterface } from '@components/error-group/interface/error-group.repository.interface';
import { CheckListAllRequestDto } from '@components/check-list/dto/request/check-list-all.request.dto';
import { CheckListAllResponseDto } from '@components/check-list/dto/response/check-list-all.response.dto';
import { UpdateCheckListRequestDto } from '@components/check-list/dto/request/update-check-list.request.dto';
import { GetItemUnitListResponseDto } from '@components/item/dto/response/get-item-unit-list.response.dto';
import { GetErrorGroupListResponseDto } from '@components/check-list/dto/response/get-error-group-list.response.dto';
import { CheckListDetailRepositoryInterface } from './interface/check-list-detail.repository.interface';
import { CheckListDetail } from '@entities/check-list/check-list-detail.entity';
import { UpdateCheckListStatusRequestDto } from './dto/request/update-check-list-status-request.dto';
import {
  CHECK_LIST_CONST,
  CHECK_LIST_STATUS_VALUE,
  CheckListStatusEnum,
  FILE_EXPORT_CHECK_LIST_HEADER,
  FILE_EXPORT_CHECK_LIST_NAME,
  STATUS_TO_CONFIRM_CHECK_LIST_STATUS,
} from '@components/check-list/check-list.constant';
import { ImportDataAbstract } from '@core/abstracts/import-data.abstract';
import { ImportResponseDto } from '@core/dto/import/response/import.response.dto';
import {
  FILE_TYPE,
  IMPORT_ACTION,
  IMPORT_CONST,
} from '@constant/import.constant';
import { CheckListImportResultDto } from '@components/check-list/dto/response/check-list.import.result.dto';
import { CellValue } from 'exceljs';
import { toStringTrim } from '@utils/object.util';
import { ErrorGroupServiceInterface } from '@components/error-group/interface/error-group.service.interface';
import { CsvWriter } from '@core/csv/csv.write';
import { extendMoment } from 'moment-range';
import * as MomentTimezone from 'moment-timezone';
import { CheckOwnerPermissionServiceInterface } from '@components/check-owner-permission/interface/check-owner-permission.service.interface';
import {
  BASE_OWNER_DEPARTMENT_IDS,
  BASE_OWNER_ROLES_CODES,
} from '@components/check-owner-permission/check-owner-permission.constant';
import { DeleteCheckListRequestDto } from '@components/check-list/dto/request/delete-check-list.request.dto';
import { ConfigService } from '@config/config.service';

const moment = extendMoment(MomentTimezone);

@Injectable()
export class CheckListService
  extends ImportDataAbstract
  implements CheckListServiceInterface
{
  constructor(
    @Inject('CheckListRepositoryInterface')
    private readonly checkListRepository: CheckListRepositoryInterface,

    @Inject('ItemServiceInterface')
    private readonly itemService: ItemService,

    @Inject('ErrorGroupServiceInterface')
    private readonly errorGroupService: ErrorGroupServiceInterface,

    @Inject('ErrorGroupRepositoryInterface')
    private readonly errorGroupRepository: ErrorGroupRepositoryInterface,

    @Inject('CheckListDetailRepositoryInterface')
    private readonly checkListDetailRepository: CheckListDetailRepositoryInterface,

    protected readonly i18n: I18nRequestScopeService,

    protected readonly configService: ConfigService,

    @Inject('CheckOwnerPermissionServiceInterface')
    private readonly checkOwnerPermissionService: CheckOwnerPermissionServiceInterface,

    @InjectConnection()
    private readonly connection: Connection,
  ) {
    super(i18n, configService);
  }

  public async confirm(payload: UpdateCheckListStatusRequestDto): Promise<any> {
    const { id } = payload;

    const checkList = await this.checkListRepository.findOneById(id);
    if (!checkList) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    if (!STATUS_TO_CONFIRM_CHECK_LIST_STATUS.includes(checkList.status)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_ACCEPTABLE)
        .withMessage(await this.i18n.translate('error.NOT_ACCEPTABLE'))
        .build();
    }

    return await this.updateCheckListStatus(
      checkList,
      CheckListStatusEnum.IN_ACTIVE,
    );
  }

  private async updateCheckListStatus(
    checkListEntity: CheckList,
    status: number,
  ): Promise<any> {
    checkListEntity.status = status;
    await this.checkListRepository.update(checkListEntity);

    const response = plainToClass(CheckListResponseDto, checkListEntity, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .withData(response)
      .build();
  }

  public async create(
    payload: CheckListRequestDto,
  ): Promise<ResponsePayload<CheckListResponseDto | any>> {
    const { code } = payload;
    const codeCondition = { code: code };
    const checkUniqueCode = await this.checkUniqueCheckList(codeCondition);

    if (checkUniqueCode) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CODE_ALREADY_EXISTS'),
      ).toResponse();
    }

    const checkListEntity = this.checkListRepository.createEntity(payload);
    return await this.save(checkListEntity, payload);
  }

  public async updateById(
    request: UpdateCheckListRequestDto,
  ): Promise<ResponsePayload<CheckListResponseDto | any>> {
    const checkList = await this.checkListRepository.findOneById(request.id);

    return await this.update(checkList, request);
  }

  public async updateByCode(
    updateByCodeRequest: CheckListRequestDto,
  ): Promise<ResponsePayload<CheckListResponseDto | any>> {
    const checkList = await this.checkListRepository.findOneByCondition({
      code: updateByCodeRequest.code,
    });

    const request = plainToClass(
      UpdateCheckListRequestDto,
      updateByCodeRequest,
    );

    request.id = checkList?.id;

    return await this.update(checkList, request);
  }

  public async update(
    checkListEntity: CheckList,
    payload: UpdateCheckListRequestDto,
  ): Promise<ResponsePayload<CheckListResponseDto | any>> {
    const { id, code, name, description, user } = payload;

    if (isEmpty(checkListEntity)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CHECK_LIST_NOT_FOUND'),
      ).toResponse();
    }

    const isOwnerPermitted =
      await this.checkOwnerPermissionService.checkOwnerPermission({
        user: user,
        record: checkListEntity,
        departmentIds: BASE_OWNER_DEPARTMENT_IDS,
        roleCodes: BASE_OWNER_ROLES_CODES,
      });

    if (!isOwnerPermitted) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CHECK_LIST_NOT_OWNER'))
        .build();
    }

    if (checkListEntity.status === 1) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.CHECK_LIST_IN_ACTIVE'))
        .build();
    }

    const codeCondition = { code: code, id: Not(id) };
    const checkUniqueCode = await this.checkUniqueCheckList(codeCondition);

    if (checkUniqueCode) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CODE_ALREADY_EXISTS'),
      ).toResponse();
    }

    checkListEntity.name = name;
    checkListEntity.code = code;
    checkListEntity.description = description;

    return await this.save(checkListEntity, payload);
  }

  public async save(
    checkListEntity: CheckList,
    payload: any,
  ): Promise<ResponsePayload<CheckListResponseDto> | any> {
    const { checkListDetails } = payload;
    const isUpdate = checkListEntity.id !== null;

    // Validate errorGroupId
    const errorGroupIdUniques = checkListDetails.map((e) => e.errorGroupId);
    const errorGroupIds = uniq(checkListDetails.map((e) => e.errorGroupId));
    const errorGroupEntities = await this.errorGroupRepository.findAll();
    const errorGroupIdChecks = uniq(errorGroupEntities.map((e) => e.id));
    const errorGroupIdExist = [];
    const errorGroupIdNotExist = [];

    const errorGroupIdMultiple = [];
    const errorGroupIdNotMultiple = [];

    if (errorGroupIdUniques.length !== errorGroupIds.length) {
      for (let i = 0; i < errorGroupIdUniques.length; i++) {
        if (!errorGroupIdNotMultiple.includes(errorGroupIdUniques[i])) {
          errorGroupIdNotMultiple.push(errorGroupIdUniques[i]);
        } else {
          errorGroupIdMultiple.push(errorGroupIdUniques[i]);
        }
      }

      return new ResponseBuilder({
        invalidErrorGroups: checkListDetails.filter((e) =>
          errorGroupIdMultiple.includes(e.errorGroupId),
        ),
      })
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(
          await this.i18n.translate('error.ERROR_GROUP_ALREADY_EXISTS'),
        )
        .build();
    }

    errorGroupIds.forEach((id: any) => {
      errorGroupIdChecks.indexOf(id) !== -1
        ? errorGroupIdExist.push(id)
        : errorGroupIdNotExist.push(id);
    });

    if (errorGroupIdNotExist.length !== 0) {
      return new ResponseBuilder({
        invalidErrorGroups: checkListDetails.filter(
          (e) => !errorGroupIdExist.includes(e.errorGroupId),
        ),
      })
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(
          await this.i18n.translate('error.REQUEST_ERROR_GROUP_NOT_FOUND'),
        )
        .build();
    }

    // Run save nested
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const checkList = await queryRunner.manager.save(checkListEntity);

      const checkListDetailEntities = checkListDetails.map(
        (checkListDetail: any) =>
          this.checkListDetailRepository.createEntity({
            checkListId: checkList.id,
            title: checkListDetail.title,
            descriptionContent: checkListDetail.descriptionContent,
            checkType: checkListDetail.checkType,
            norm: checkListDetail.norm,
            valueTop: checkListDetail.valueTop,
            valueBottom: checkListDetail.valueBottom,
            errorGroupId: checkListDetail.errorGroupId,
            itemUnitId: checkListDetail.itemUnitId,
          }),
      );

      if (isUpdate) {
        await queryRunner.manager.delete(CheckListDetail, {
          checkListId: checkList.id,
        });
      }
      checkList.checkListDetails = await queryRunner.manager.save(
        checkListDetailEntities,
      );

      await queryRunner.commitTransaction();
      const response = plainToClass(CheckListResponseDto, checkList, {
        excludeExtraneousValues: true,
      });

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData(response)
        .build();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  private async checkUniqueCheckList(condition: any): Promise<boolean> {
    const result = await this.checkListRepository.findByCondition(condition);
    return result.length > 0;
  }

  public async getDetail(
    id: number,
  ): Promise<ResponsePayload<CheckListRequestDto | any>> {
    const checkList = await this.checkListRepository.getDetail(id);

    if (!checkList) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    const itemUnitIds = checkList?.checkListDetails
      ?.map((x) => x?.itemUnitId)
      ?.filter((y) => y != undefined);

    let itemUnits: any;
    if(!isEmpty(itemUnitIds)){
      itemUnits = await this.itemService.getItemUnitByIds(itemUnitIds.toString());

      if (itemUnits.statusCode !== ResponseCodeEnum.SUCCESS) {
        return new ApiError(
          itemUnits.statusCode,
          itemUnits.message,
        ).toResponse();
      }

      if (itemUnits?.data?.items?.length != itemUnitIds?.length) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.ERROR_ITEM_UNIT'),
        ).toResponse();
      }
    }

    checkList.checkListDetails = checkList?.checkListDetails?.reduce((x, y) => {
      if(y?.itemUnitId != undefined){
        const itemUnit = itemUnits?.data?.items.find((x) => x?.id == y?.itemUnitId);
        y.itemUnit = {
          id: itemUnit?.id ? itemUnit.id : null,
          code: itemUnit?.code ? itemUnit.code : null,
          name: itemUnit?.name ? itemUnit.name : null
        }
      }else{
        y.itemUnit = {};
      }

      x.push(y);
      return x;
    }, []);

    const dataReturn = plainToClass(CheckListResponseDto, checkList, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(dataReturn)
      .build();
  }

  public async getList(
    request: CheckListAllRequestDto,
  ): Promise<ResponsePayload<CheckListAllResponseDto | any>> {
    const { isExport, page } = request;
    const { result, count } = await this.checkListRepository.getList(request);

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
        const status = CHECK_LIST_STATUS_VALUE.filter(
          (x) => x.value == y?.status,
        )[0]
          ? CHECK_LIST_STATUS_VALUE.filter((x) => x.value == y.status)[0]?.text
          : '';

        x.push({
          id: y?.id ? y.id : '',
          code: y?.code ? y.code : '',
          name: y?.name ? y.name : '',
          description: y?.description ? y.description : '',
          status: status,
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
            status: '',
          },
        ];
      }

      const csvWriter = new CsvWriter();
      csvWriter.name = FILE_EXPORT_CHECK_LIST_NAME;
      csvWriter.mapHeader = FILE_EXPORT_CHECK_LIST_HEADER;
      csvWriter.i18n = this.i18n;

      return new ResponseBuilder<any>({
        file: await csvWriter.writeCsv(dataExport),
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();
    }

    const response = plainToClass(CheckListResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder<PagingResponse>({
      items: response,
      meta: { total: count, page: page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async remove(
    request: DeleteCheckListRequestDto,
  ): Promise<ResponsePayload<SuccessResponse | any>> {
    const { user, id } = request;
    const checkList = await this.checkListRepository.findOneById(id);
    if (isEmpty(checkList)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    // check owner permission
    const isOwnerPermitted =
      await this.checkOwnerPermissionService.checkOwnerPermission({
        user: user,
        record: checkList,
        departmentIds: BASE_OWNER_DEPARTMENT_IDS,
        roleCodes: BASE_OWNER_ROLES_CODES,
      });

    if (!isOwnerPermitted) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CHECK_LIST_NOT_OWNER'))
        .build();
    }

    if (checkList.status === 1) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.CHECK_LIST_IN_ACTIVE'))
        .build();
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(CheckListDetail, { checkListId: id });
      await queryRunner.manager.delete(CheckList, { id: id });

      await queryRunner.commitTransaction();

      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  public async getItemUnitList() {
    const result = await this.itemService.getItemUnitList();

    const response = plainToClass(GetItemUnitListResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async getErrorGroupList() {
    const result = await this.errorGroupRepository.findAll();

    const response = plainToClass(GetErrorGroupListResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async getCheckListConfirm() {
    const result = await getRepository(CheckList)
      .createQueryBuilder('c')
      .where('c.status = :status', { status: 1 })
      .orderBy('c.id', 'DESC')
      .getMany();

    const response = plainToClass(CheckListResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async getDetailByCode(
    code: string,
  ): Promise<ResponsePayload<CheckListResponseDto>> {
    const checkList = await this.checkListRepository.findOneByCondition({
      code: code,
    });
    if (!checkList) {
      return new ResponseBuilder<CheckListResponseDto>()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const dataReturn = plainToClass(CheckListResponseDto, checkList, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(dataReturn)
      .build();
  }

  protected createTemplateFile(templateFilePath: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  protected async getRowData(
    dataRowValues: string[] | CellValue[] | { [p: string]: CellValue },
  ) {
    const colIndexes = CHECK_LIST_CONST.IMPORT.COL_INDEX;

    const checkListDetailDto: CheckListDetailRequestDto = {
      title: toStringTrim(dataRowValues[colIndexes.TITLE]),
      descriptionContent: toStringTrim(
        dataRowValues[colIndexes.DESCRIPTION_CONTENT],
      ),
      checkType: Number.parseInt(
        toStringTrim(dataRowValues[colIndexes.CHECK_TYPE]),
      ),
      norm: Number.parseInt(toStringTrim(dataRowValues[colIndexes.NORM])),
      valueTop: Number.parseInt(
        toStringTrim(dataRowValues[colIndexes.VALUE_TOP]),
      ),
      valueBottom: Number.parseInt(
        toStringTrim(dataRowValues[colIndexes.VALUE_BOTTOM]),
      ),
      errorGroupId: null,
      itemUnitId: 1,
    };

    const errorGroup = await this.errorGroupService.getDetailByCode(
      toStringTrim(dataRowValues[colIndexes.ERROR_GROUP_CODE]),
    );

    checkListDetailDto.errorGroupId = errorGroup.data?.id;

    const checkListDto: CheckListRequestDto = {
      code: toStringTrim(dataRowValues[colIndexes.CODE]),
      name: toStringTrim(dataRowValues[colIndexes.NAME]),
      description: toStringTrim(dataRowValues[colIndexes.DESCRIPTION]),
      checkListDetails: [checkListDetailDto],
      request: null,
      responseError: null,
      userId: null
    };

    const inputAction = toStringTrim(dataRowValues[IMPORT_ACTION.COL_INDEX]);

    const importResult: CheckListImportResultDto = {
      log: null,
      action: inputAction,
      id: null,
      code: checkListDto.code,
      name: checkListDto.name,
      description: checkListDto.description,
      checkListDetails: plainToClass(
        CheckListDetailResponseDto,
        checkListDto.checkListDetails,
      ),
    };

    return { checkListDto, inputAction, importResult };
  }

  protected async saveImportData(
    fileName: string,
    fileType: string,
    dataRows: [] | Array<Array<string>>,
    colOffset: number,
  ): Promise<ImportResponseDto> {
    const importResults: CheckListImportResultDto[] = [];

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

      const { checkListDto, inputAction, importResult } = await this.getRowData(
        dataRowValues,
      );

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

      let saveDbResult: ResponsePayload<CheckListResponseDto>;

      switch (inputAction) {
        case actionCreate:
          saveDbResult = await this.create(checkListDto);
          break;

        case actionUpdate:
          saveDbResult = await this.updateByCode(checkListDto);
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
      logFileName: null,
      mimeType: FILE_TYPE.CSV.MIME_TYPE,
      result: importResults,
      totalCount: totalCount,
      successCount: successCount,
    };
  }

  protected validateRowData(
    dataRowValues: string[] | [] | { [p: string]: CellValue },
    colOffset: number,
  ): Promise<string[]> {
    return Promise.resolve([]);
  }
}
