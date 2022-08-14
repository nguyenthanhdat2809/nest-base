import { Inject, Injectable } from '@nestjs/common';
import { ResponsePayload } from '@utils/response-payload';
import { InjectConnection } from '@nestjs/typeorm';
import { PagingResponse } from '@utils/paging.response';
import { Connection, Not } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { isEmpty, map, uniq } from 'lodash';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { ApiError } from '@utils/api.error';
import { ConfigService } from '@config/config.service';
import { I18nRequestScopeService, I18nService } from 'nestjs-i18n';
import { SuccessResponse } from '@utils/success.response.dto';
import {
  QualityPoint,
  Formality,
  NumberOfTime,
} from '@entities/quality-point/quality-point.entity';
import { QualityPointRepositoryInterface } from '@components/quality-point/interface/quality-point.repository.interface';
import { QualityPointServiceInterface } from '@components/quality-point/interface/quality-point.service.interface';
import { GetListQualityPointRequestDto } from '@components/quality-point/dto/request/get-list-quality-point.request.dto';
import { QualityPointResponseDto } from '@components/quality-point/dto/response/quality-point.response.dto';
import { GetListQualityPointResponseDto } from '@components/quality-point/dto/response/get-list-quality-point.response.dto';
import { QualityPointRequestDto } from '@components/quality-point/dto/request/quality-point.request.dto';
import { UpdateQualityPointRequestDto } from '@components/quality-point/dto/request/update-quality-point.request.dto';
import { UserService } from '@components/user/user.service';
import { ItemService } from '@components/item/item.service';
import { ProduceService } from '@components/produce/produce.service';
import { QualityPointUser1 } from '@entities/quality-point-user/quality-point-user1.entity';
import { QualityPointUser2 } from '@entities/quality-point-user/quality-point-user2.entity';
import { GetItemListResponseDto } from '@components/item/dto/response/get-item-list.response.dto';
import { GetUserListResponseDto } from '@components/user/dto/response/get-user-list.response.dto';
import { CheckListRepositoryInterface } from '@components/check-list/interface/check-list.repository.interface';
import {
  QualityPointStatusEnum,
  STATUS_TO_CONFIRM_QUALITY_POINT_STATUS,
  QUALITY_POINT_CONST,
  STAGES_OPTION,
  STAGE_VALUE,
  STAGE_MAP,
  FILE_EXPORT_QUALITY_POINT_NAME,
  FILE_EXPORT_QUALITY_POINT_HEADER,
  QUALITY_POINT_STATUS_VALUE,
} from '@components/quality-point/quality-point.constant';
import { DetailQualityPointResponseDto } from '@components/quality-point/dto/response/detail-quality-point.response.dto';
import { sortService, paginationService } from '@utils/common';
import { CsvWriter } from '@core/csv/csv.write';
import { ImportDataAbstract } from '@core/abstracts/import-data.abstract';
import { ImportResponseDto } from '@core/dto/import/response/import.response.dto';
import { toStringTrim } from '@utils/object.util';
import {
  FILE_TYPE,
  IMPORT_ACTION,
  IMPORT_CONST,
} from '@constant/import.constant';
import {
  QualityPointImportResultDto,
  QualityPointUserResponseDto,
} from '@components/quality-point/dto/response/quality-point.import.result.dto';
import { CheckListServiceInterface } from '@components/check-list/interface/check-list.service.interface';
import { CellValue, Row } from 'exceljs';
import { ErrorGroupResponseDto } from '@components/error-group/dto/response/error-group.response.dto';
import { DeleteQualityPointRequestDto } from '@components/quality-point/dto/request/delete-quality-point.request.dto';
import {
  BASE_OWNER_DEPARTMENT_IDS,
  BASE_OWNER_ROLES_CODES,
} from '@components/check-owner-permission/check-owner-permission.constant';
import { CheckOwnerPermissionServiceInterface } from '@components/check-owner-permission/interface/check-owner-permission.service.interface';

@Injectable()
export class QualityPointService
  extends ImportDataAbstract
  implements QualityPointServiceInterface
{
  constructor(
    @Inject('QualityPointRepositoryInterface')
    private readonly qualityPointRepository: QualityPointRepositoryInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserService,

    @Inject('ItemServiceInterface')
    private readonly itemService: ItemService,

    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceService,

    @Inject('CheckListServiceInterface')
    private readonly checkListService: CheckListServiceInterface,

    @Inject('CheckListRepositoryInterface')
    private readonly checkListRepository: CheckListRepositoryInterface,

    protected readonly i18n: I18nRequestScopeService,

    protected readonly configService: ConfigService,

    @Inject('CheckOwnerPermissionServiceInterface')
    private readonly checkOwnerPermissionService: CheckOwnerPermissionServiceInterface,

    @InjectConnection()
    private readonly connection: Connection,
  ) {
    super(i18n, configService);
  }

  public async confirm(id: number): Promise<any> {
    const qualityPoint = await this.qualityPointRepository.findOneById(id);
    if (!qualityPoint) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    if (!STATUS_TO_CONFIRM_QUALITY_POINT_STATUS.includes(qualityPoint.status)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_ACCEPTABLE)
        .withMessage(await this.i18n.translate('error.NOT_ACCEPTABLE'))
        .build();
    }

    return await this.updateQualityPointStatus(
      qualityPoint,
      QualityPointStatusEnum.IN_ACTIVE,
    );
  }

  private async updateQualityPointStatus(
    qualityPointEntity: QualityPoint,
    status: number,
  ): Promise<any> {
    qualityPointEntity.status = status;
    await this.qualityPointRepository.update(qualityPointEntity);

    const response = plainToClass(QualityPointResponseDto, qualityPointEntity, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .withData(response)
      .build();
  }

  public async getList(
    request: GetListQualityPointRequestDto,
  ): Promise<ResponsePayload<GetListQualityPointResponseDto | any>> {
    const { filter, sort, page, limit, isGetAll, isExport } = request;
    const stages = STAGE_VALUE;

    // stage
    let paramNameStage = '';
    const filterStageSearch = {
      checked: false,
      stageValues: [],
    };

    if (!isEmpty(filter)) {
      for (const val of filter) {
        if (
          val.column === 'stage' &&
          (val.text == null || !isEmpty(val.text.trim()))
        ) {
          filterStageSearch.checked = true;
          paramNameStage = val.text.trim();
        }
      }
    }

    for (const stage of stages) {
      if (stage.text.toLowerCase().includes(paramNameStage.toLowerCase())) {
        filterStageSearch.stageValues.push(stage.value);
      }
    }

    // user
    type Param = {
      isGetAll: string;
      filter: any;
    };

    let paramUserIds: Param;

    const filterUserSearch = {
      checked: false,
      userIds: [],
    };

    if (!isEmpty(filter)) {
      for (const val of filter) {
        if (
          val.column === 'username' &&
          (val.text == null || !isEmpty(val.text.trim()))
        ) {
          filterUserSearch.checked = true;
          paramUserIds = {
            isGetAll: '1',
            filter: [{ column: 'username', text: val.text.trim() }],
          };
        }
      }
    }

    const usersResponse = await this.userService.getUserList(paramUserIds);

    for (const userResponse of usersResponse) {
      filterUserSearch.userIds.push(userResponse.id);
    }

    let { result, count } =
      await this.qualityPointRepository.getListQualityPoint(
        request,
        filterStageSearch,
        filterUserSearch,
      );

    if (isEmpty(result)) {
      return new ResponseBuilder<PagingResponse>({
        items: [],
        meta: { total: 0, page: 1 },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    }

    const userIdMaps = [];
    for (let i = 0; i < result.length; i++) {
      const data = result[i];
      const users = data?.qualityPointUser1s;

      for (let j = 0; j < users.length; j++) {
        const user = users[j];
        userIdMaps.push(user?.userId);
      }
    }

    const userIds = uniq(userIdMaps);
    const getUsers = await this.userService.getUserMapByIds(userIds);

    const userMaps = new Map(
      result?.map((x) => {
        const id = x?.id;
        const users = x?.qualityPointUser1s;
        const userName = [];
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          userName.push(getUsers.get(user?.userId));
        }

        return [id, userName.join(', ')];
      }),
    );

    result = result.reduce((x, y) => {
      x.push({
        username: userMaps?.get(y?.id),
        qcStageName: STAGE_MAP[Number(y?.stage)],
        ...y,
      });

      return x;
    }, []);

    if (isEmpty(result)) {
      return new ResponseBuilder<PagingResponse>({
        items: [],
        meta: { total: 0, page: 1 },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    }

    // SORT BY SERVICE
    result = sortService(result, sort, ['stage', 'username']);

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
        const status = QUALITY_POINT_STATUS_VALUE.filter(
          (x) => x.value == y?.status,
        )[0]
          ? QUALITY_POINT_STATUS_VALUE.filter((x) => x.value == y.status)[0]
              ?.text
          : '';

        x.push({
          id: y?.id ? y.id : '',
          code: y?.code ? y.code : '',
          name: y?.name ? y.name : '',
          qcStageName: y?.qcStageName ? y.qcStageName : '',
          username: y?.username ? y.username : '',
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
            qcStageName: '',
            username: '',
            status: '',
          },
        ];
      }

      const csvWriter = new CsvWriter();
      csvWriter.name = FILE_EXPORT_QUALITY_POINT_NAME;
      csvWriter.mapHeader = FILE_EXPORT_QUALITY_POINT_HEADER;
      csvWriter.i18n = this.i18n;

      return new ResponseBuilder<any>({
        file: await csvWriter.writeCsv(dataExport),
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();
    }

    // PAGINATE
    const isGetAllChecked = parseInt(isGetAll) ? true : false;
    if (page && limit && !isGetAllChecked) {
      result = paginationService(result, Number(page), Number(limit));
    }

    const response = plainToClass(QualityPointResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder<PagingResponse>({
      items: response,
      meta: { total: count, page: page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async create(
    payload: QualityPointRequestDto,
  ): Promise<ResponsePayload<QualityPointResponseDto | any>> {
    const { code } = payload;

    const codeCondition = { code: code };
    const checkUniqueCode = await this.checkUniqueQualityPoint(codeCondition);

    if (checkUniqueCode) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CODE_ALREADY_EXISTS'),
      ).toResponse();
    }

    const qualityPointEntity =
      this.qualityPointRepository.createEntity(payload);
    return await this.save(qualityPointEntity, payload);
  }

  public async getDetail(
    id: number,
  ): Promise<ResponsePayload<DetailQualityPointResponseDto | any>> {
    const qualityPoint = await this.qualityPointRepository.getDetail(id);

    if (!qualityPoint) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.QUALITY_POINT_NOT_FOUND'),
      ).toResponse();
    }

    const item = await this.itemService.getItemById(qualityPoint.itemId);
    if (isEmpty(item)) {
      qualityPoint.item = {};
    } else {
      qualityPoint.item = {
        id: item.id,
        code: item.code,
        name: item.name,
      };
    }

    const qualityPointUser1Ids = uniq(
      map(qualityPoint.qualityPointUser1s, 'userId'),
    );
    if (!isEmpty(qualityPointUser1Ids)) {
      const users = await this.userService.getListByIDs(qualityPointUser1Ids);
      if (isEmpty(users) || users.length !== qualityPointUser1Ids.length) {
        qualityPoint.qualityPointUser1s = [];
      }
    } else {
      qualityPoint.qualityPointUser1s = [];
    }

    const qualityPointUser2Ids = uniq(
      map(qualityPoint.qualityPointUser2s, 'userId'),
    );
    if (!isEmpty(qualityPointUser2Ids)) {
      const users = await this.userService.getListByIDs(qualityPointUser2Ids);
      if (isEmpty(users) || users.length !== qualityPointUser2Ids.length) {
        qualityPoint.qualityPointUser2s = [];
      }
    } else {
      qualityPoint.qualityPointUser2s = [];
    }

    qualityPoint.material = qualityPoint?.productType?.material;
    qualityPoint.productPrevious = qualityPoint?.productType?.productPrevious;

    const dataReturn = plainToClass(
      DetailQualityPointResponseDto,
      qualityPoint,
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(dataReturn)
      .build();
  }

  public async updateById(
    payload: UpdateQualityPointRequestDto,
  ): Promise<ResponsePayload<QualityPointResponseDto | any>> {
    const { id, user } = payload;

    const qualityPointEntity = await this.qualityPointRepository.findOneById(
      id,
    );
    if (isEmpty(qualityPointEntity)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.QUALITY_POINT_NOT_FOUND'),
      ).toResponse();
    }

    // check owner permission
    const isOwnerPermitted =
      await this.checkOwnerPermissionService.checkOwnerPermission({
        user: user,
        record: qualityPointEntity,
        departmentIds: BASE_OWNER_DEPARTMENT_IDS,
        roleCodes: BASE_OWNER_ROLES_CODES,
      });

    if (!isOwnerPermitted) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.QUALITY_POINT_NOT_OWNER'))
        .build();
    }

    return await this.update(qualityPointEntity, payload);
  }

  public async save(
    qualityPointEntity: QualityPoint,
    payload: any,
  ): Promise<ResponsePayload<QualityPointResponseDto> | any> {
    const {
      checkListId,
      itemId,
      stage,
      quantity,
      errorAcceptanceRate,
      numberOfTime,
      qualityPointUser1s,
      qualityPointUser2s,
      material,
      productPrevious,
    } = payload;
    const stageParam = qualityPointEntity.stage;
    const formality = qualityPointEntity.formality;

    if (
      stage !== STAGES_OPTION.OUTPUT_PRODUCTION &&
      stage !== STAGES_OPTION.INPUT_PRODUCTION
    ) {
      const item = await this.itemService.getItemById(itemId);
      if (isEmpty(item)) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.ITEM_NOT_FOUND'),
        ).toResponse();
      }

      let qualityPointCheckData;
      if (qualityPointEntity.id !== null) {
        qualityPointCheckData =
          await this.qualityPointRepository.findByCondition({
            id: Not(qualityPointEntity.id),
            stage: stage,
            itemId: itemId,
          });
      } else {
        qualityPointCheckData =
          await this.qualityPointRepository.findByCondition({
            stage: stage,
            itemId: itemId,
          });
      }

      if (!isEmpty(qualityPointCheckData)) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.ITEM_STAGE_ALREADY_EXISTS'),
        ).toResponse();
      }

      qualityPointEntity.itemId = itemId;
    }

    const checkList = await this.checkListRepository.findOneById(checkListId);
    if (isEmpty(checkList)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CHECK_LIST_NOT_FOUND'),
      ).toResponse();
    }

    if (checkList.status === 0) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CHECK_LIST_NOT_ACTIVE'),
      ).toResponse();
    }

    const isStage = STAGE_VALUE.filter((x) => x.value == stage);
    if (isEmpty(isStage)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.QC_STAGE_NOT_FOUND'),
      ).toResponse();
    }

    if (isEmpty(qualityPointUser1s)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_1_IS_EMPTY'),
      ).toResponse();
    }

    const isUpdate = qualityPointEntity.id !== null;
    let user1Ids = [];
    let user2Ids = [];

    user1Ids = uniq(qualityPointUser1s.map((user) => user.id));
    if (qualityPointUser2s && !isEmpty(qualityPointUser2s)) {
      user2Ids = uniq(qualityPointUser2s.map((user) => user.id));
    }

    const user1Entities = await this.userService.getListByIDs(user1Ids);
    const user2Entities = await this.userService.getListByIDs(user2Ids);

    if (isEmpty(user1Entities) || user1Entities.length !== user1Ids.length) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_1_NOT_FOUND'),
      ).toResponse();
    }

    if (numberOfTime == NumberOfTime.TwoTimes) {
      if (isEmpty(qualityPointUser2s)) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.USER_2_IS_EMPTY'),
        ).toResponse();
      }

      if (isEmpty(user2Entities) || user2Entities.length !== user2Ids.length) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.USER_2_NOT_FOUND'),
        ).toResponse();
      }

      const arrayUser1Ids = qualityPointUser1s.map((x) => x.id);
      const arrayUser2Ids = qualityPointUser2s.map((x) => x.id);
      const user1ExistInUser2 = arrayUser1Ids?.filter((x) =>
        arrayUser2Ids.includes(x),
      );

      if (!isEmpty(user1ExistInUser2)) {
        const userExits = await this.userService.getListByIDs(
          user1ExistInUser2,
        );
        const userExitNames = userExits?.map((x) => x.username)?.join(', ');
        const msgUsers = await this.i18n.translate(
          'error.USER_1_EXIST_IN_USER_2',
        );
        const msgUserReplace = msgUsers.replace('USERNAMES', userExitNames);

        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          msgUserReplace,
        ).toResponse();
      }
    }

    qualityPointEntity.quantity = null;
    qualityPointEntity.errorAcceptanceRate = null;

    if (formality === Formality.Partly) {
      if (!quantity || quantity == undefined) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.QC_NEED_QUANTITY'),
        ).toResponse();
      }

      if (quantity <= 0 || quantity > 99) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.QUANTITY_ERROR'),
        ).toResponse();
      }

      if (!errorAcceptanceRate || errorAcceptanceRate == undefined) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.ERROR_ACCEPTANCE_RATE'),
        ).toResponse();
      }

      if (errorAcceptanceRate <= 0 || errorAcceptanceRate > 99) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.QUANTITY_ERROR'),
        ).toResponse();
      }
      qualityPointEntity.quantity = quantity;
      qualityPointEntity.errorAcceptanceRate = errorAcceptanceRate;
    }

    qualityPointEntity.productType = null;
    if (stage == STAGES_OPTION.INPUT_PRODUCTION) {
      if ([0, 1].includes(material) && [0, 1].includes(productPrevious)) {
        if (material == 0 && productPrevious == 0) {
          return new ApiError(
            ResponseCodeEnum.BAD_REQUEST,
            await this.i18n.translate('error.QUALITY_POINT_PRODUCT_TYPE_EMPTY'),
          ).toResponse();
        }
        qualityPointEntity.productType = {
          material: material,
          productPrevious: productPrevious,
        };
      } else {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.QUALITY_POINT_PRODUCT_TYPE_ERROR'),
        ).toResponse();
      }
    }

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const qualityPoint = await queryRunner.manager.save(qualityPointEntity);

      const qualityPointUser1Entities = qualityPointUser1s.map((user) =>
        this.qualityPointRepository.createQualityPointUser1Entity(
          qualityPoint.id,
          user.id,
        ),
      );

      let qualityPointUser2Entities;
      if (qualityPointUser2s && !isEmpty(qualityPointUser2s)) {
        qualityPointUser2Entities = qualityPointUser2s.map((user) =>
          this.qualityPointRepository.createQualityPointUser2Entity(
            qualityPoint.id,
            user.id,
          ),
        );
      }

      if (isUpdate) {
        await queryRunner.manager.delete(QualityPointUser1, {
          qualityPointId: qualityPoint.id,
        });

        await queryRunner.manager.delete(QualityPointUser2, {
          qualityPointId: qualityPoint.id,
        });
      }

      qualityPoint.qualityPointUser1s = await queryRunner.manager.save(
        qualityPointUser1Entities,
      );

      if (qualityPointUser2Entities) {
        qualityPoint.qualityPointUser2s = await queryRunner.manager.save(
          qualityPointUser2Entities,
        );
      }
      await queryRunner.commitTransaction();

      const response = plainToClass(QualityPointResponseDto, qualityPoint, {
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

  public async remove(
    request: DeleteQualityPointRequestDto,
  ): Promise<ResponsePayload<SuccessResponse | any>> {
    const { user, id } = request;
    const qualityPoint = await this.qualityPointRepository.findOneById(id);
    if (isEmpty(qualityPoint)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.QUALITY_POINT_NOT_FOUND'),
      ).toResponse();
    }

    // check owner permission
    const isOwnerPermitted =
      await this.checkOwnerPermissionService.checkOwnerPermission({
        user: user,
        record: qualityPoint,
        departmentIds: BASE_OWNER_DEPARTMENT_IDS,
        roleCodes: BASE_OWNER_ROLES_CODES,
      });

    if (!isOwnerPermitted) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.QUALITY_POINT_NOT_OWNER'))
        .build();
    }

    if (qualityPoint.status === 1) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.QUALITY_POINT_IN_ACTIVE'))
        .build();
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(QualityPointUser1, {
        qualityPointId: id,
      });

      await queryRunner.manager.delete(QualityPointUser2, {
        qualityPointId: id,
      });

      await queryRunner.manager.delete(QualityPoint, { id: id });

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

  private async checkUniqueQualityPoint(condition: any): Promise<boolean> {
    const result = await this.qualityPointRepository.findByCondition(condition);
    return result.length > 0;
  }

  public async getEnvItemInQualityPoint(idQc: number): Promise<any> {
    const items = await this.itemService.getEnvItemInQualityPoint();

    const qualityPoints = await this.qualityPointRepository.findByCondition({
      stage: idQc,
    });

    if (idQc !== 8 && idQc !== 9) {
      items.map((qp) => {
        if (qualityPoints.filter((e) => e.itemId === qp.id).length > 0) {
          qp.isUsed = true;
        }
        return qp;
      });
    }

    const response = plainToClass(GetItemListResponseDto, items, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async getUserList() {
    const request = {
      isGetAll: '1',
    };
    const result = await this.userService.getUserList(request);

    const response = plainToClass(GetUserListResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async getCheckListDetailsByQualityPoint(
    qualityPointId: number,
  ): Promise<any> {
    const result =
      await this.qualityPointRepository.getCheckListDetailsByQualityPoint(
        qualityPointId,
      );
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }

  public async getCheckListDetailsByQualityPointList(
    materialCriteriaIdList: number[],
  ): Promise<any> {
    const result =
      await this.qualityPointRepository.getCheckListDetailsByQualityPointList(
        materialCriteriaIdList,
      );
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }

  public async getQualityPointsByIds(ids: number[]): Promise<any> {
    const result = await this.qualityPointRepository.getListByIds(ids);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }

  protected createTemplateFile(templateFilePath: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  protected async getRowData(
    dataRowValues: string[] | CellValue[] | { [p: string]: CellValue },
  ) {
    const colIndexes = QUALITY_POINT_CONST.IMPORT.COL_INDEX;

    const qualityPointDto: QualityPointRequestDto = {
      code: toStringTrim(dataRowValues[colIndexes.CODE]),
      name: toStringTrim(dataRowValues[colIndexes.NAME]),
      description: toStringTrim(dataRowValues[colIndexes.DESCRIPTION]),
      itemId: null,
      checkListId: null,
      formality: Number.parseInt(
        toStringTrim(dataRowValues[colIndexes.FORMALITY]),
      ),
      quantity: Number.parseInt(
        toStringTrim(dataRowValues[colIndexes.QUANTITY]),
      ),
      errorAcceptanceRate: Number.parseInt(
        toStringTrim(dataRowValues[colIndexes.ERROR_ACCEPTANCE_RATE]),
      ),
      numberOfTime: Number.parseInt(
        toStringTrim(dataRowValues[colIndexes.NUMBER_OF_TIME]),
      ),
      stage: null,
      qualityPointUser1s: null,
      qualityPointUser2s: null,
      responseError: null,
      request: null,
      userId: null,
    };

    async function mapUser(user: any) {
      const items = user?.items;

      return !isEmpty(items)
        ? plainToClass(QualityPointUserResponseDto, items, {
            excludeExtraneousValues: true,
          })[0]
        : null;
    }

    const findItemTask = this.itemService.getItemByConditions({
      filter: [
        { column: 'username', text: dataRowValues[colIndexes.ITEM_CODE] },
      ],
    });

    const findCheckListTask = this.checkListService.getDetailByCode(
      qualityPointDto.code,
    );

    const findQualityPointUser1Tasks = dataRowValues[
      colIndexes.QUALITY_POINT_USER_1S
    ]
      .split(QUALITY_POINT_CONST.IMPORT.USER_SEPARATOR)
      .map((username) =>
        this.userService.getUserByConditions({
          filter: [{ column: 'username', text: username }],
        }),
      );

    const findQualityPointUser2Tasks = dataRowValues[
      colIndexes.QUALITY_POINT_USER_2S
    ]
      .split(QUALITY_POINT_CONST.IMPORT.USER_SEPARATOR)
      .map((username) =>
        this.userService.getUserByConditions({
          filter: [{ column: 'username', text: username }],
        }),
      );

    const [item, checkList, qualityPointUser1s, qualityPointUser2s] =
      await Promise.all([
        findItemTask,
        findCheckListTask,
        findQualityPointUser1Tasks,
        findQualityPointUser2Tasks,
      ]);

    const inputAction = toStringTrim(dataRowValues[IMPORT_ACTION.COL_INDEX]);

    const importResult: QualityPointImportResultDto = {
      log: null,
      action: inputAction,
      id: null,
      code: qualityPointDto.code,
      name: qualityPointDto.name,
      description: qualityPointDto.description,
      itemId: item.id,
      stage: qualityPointDto.stage,
      quantity: qualityPointDto.quantity,
      errorAcceptanceRate: qualityPointDto.errorAcceptanceRate,
      numberOfTime: qualityPointDto.numberOfTime,
      qualityPointUser1s: qualityPointUser1s.map((plainUser) =>
        mapUser(plainUser),
      ),
      qualityPointUser2s: qualityPointUser2s.map((plainUser) =>
        mapUser(plainUser),
      ),
      checkListId: checkList.data?.id,
      qcStageName: null,
      status: null,
      username: null,
      formality: qualityPointDto.formality,
    };

    return { qualityPointDto, inputAction, importResult };
  }

  protected async saveImportData(
    fileName: string,
    fileType: string,
    dataRows: Row[] | Array<Array<string>>,
    colOffset: number,
  ): Promise<ImportResponseDto> {
    const importResults: QualityPointImportResultDto[] = [];

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

      const { qualityPointDto, inputAction, importResult } =
        await this.getRowData(dataRowValues);

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
          saveDbResult = await this.create(qualityPointDto);
          break;

        case actionUpdate:
          saveDbResult = await this.updateByCode(qualityPointDto);
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
    dataRowValues: string[] | [] | { [p: string]: any },
    colOffset: number,
  ): Promise<string[]> {
    return Promise.resolve([]);
  }

  private async update(
    qualityPointEntity: QualityPoint,
    request: UpdateQualityPointRequestDto,
  ) {
    if (isEmpty(qualityPointEntity)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.QUALITY_POINT_NOT_FOUND'),
      ).toResponse();
    }

    if (qualityPointEntity.status === 1) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.QUALITY_POINT_IN_ACTIVE'))
        .build();
    }

    const {
      id,
      code,
      name,
      stage,
      formality,
      checkListId,
      numberOfTime,
      description,
    } = request;

    const codeCondition = { code: code, id: Not(id) };
    const checkUniqueCode = await this.checkUniqueQualityPoint(codeCondition);

    if (checkUniqueCode) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CODE_ALREADY_EXISTS'),
      ).toResponse();
    }

    qualityPointEntity.code = code;
    qualityPointEntity.name = name;
    qualityPointEntity.stage = stage;
    qualityPointEntity.formality = formality;
    qualityPointEntity.checkListId = checkListId;
    qualityPointEntity.numberOfTime = numberOfTime;
    qualityPointEntity.description = description;

    return await this.save(qualityPointEntity, request);
  }

  public async updateByCode(
    request: QualityPointRequestDto,
  ): Promise<ResponsePayload<QualityPointResponseDto | any>> {
    const qualityPointEntity =
      await this.qualityPointRepository.findOneByCondition({
        code: request.code,
      });

    const updateRequest = plainToClass(UpdateQualityPointRequestDto, request);

    updateRequest.id = qualityPointEntity.id;

    return await this.update(qualityPointEntity, updateRequest);
  }
}
