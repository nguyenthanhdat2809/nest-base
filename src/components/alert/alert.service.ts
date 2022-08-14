import { Inject, Injectable } from '@nestjs/common';
import { ResponsePayload } from '@utils/response-payload';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { plainToClass } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';
import { stringFormat } from '@utils/object.util';
import { PagingResponse } from '@utils/paging.response';
import { isEmpty, uniq } from 'lodash';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SuccessResponse } from '@utils/success.response.dto';
import { ApiError } from '@utils/api.error';
import {
  ALERT_DB,
  ALERT_NAME_RECORD,
  STATUS_TO_CONFIRM_ALERT,
  AlertStatusEnum,
  ALERT_WORK_ORDER_QUALITY_CONTROL_ENUM,
} from '@components/alert/alert.constant';
import { Alert, ProductTypeAlert } from '@entities/alert/alert.entity';
import { AlertServiceInterface } from '@components/alert/interface/alert.service.interface';
import { AlertRepositoryInterface } from '@components/alert/interface/alert.repository.interface';
import { ErrorReportRepositoryInterface } from '@components/error-report/interface/error-report.repository.interface';
import { AlertRequestDto } from '@components/alert/dto/request/alert.request.dto';
import { AlertResponseDto } from '@components/alert/dto/response/alert.response.dto';
import { AlertOpResponseDto } from '@components/alert/dto/response/alert-op.response.dto';
import { AlertInputOutputResponseDto } from '@components/alert/dto/response/alert-input-output.response.dto';
import { AlertRelatedUser } from '@entities/alert/alert-related-user.entity';
import { CreateAlertRequestDto } from '@components/alert/dto/request/create-alert.request.dto';
import { UpdateAlertRequestDto } from '@components/alert/dto/request/update-alert.request.dto';
import { GetListAlertRequestDto } from '@components/alert/dto/request/get-list-alert.request.dto';
import { GetListAlertResponseDto } from '@components/alert/dto/response/get-list-alert.response.dto';
import { STAGE_VALUE } from '@components/quality-point/quality-point.constant';
import { UpdateAlertStatusRequestDto } from '@components/alert/dto/request/update-alert-status.request.dto';
import { ProduceService } from '@components/produce/produce.service';
import { UserService } from '@components/user/user.service';
import { ItemService } from '@components/item/item.service';
import { AlertDetailResponseDto } from '@components/alert/dto/response/alert-detail.response.dto';
import { SaleServiceInterface } from '../sale/interface/sale.service.interface';
import { sortService, paginationService } from '@utils/common';
import { STAGES_OPTION } from '@constant/qc-stage.constant';
import { CheckOwnerPermissionServiceInterface } from '@components/check-owner-permission/interface/check-owner-permission.service.interface';
import {
  BASE_OWNER_DEPARTMENT_IDS,
  BASE_OWNER_ROLES_CODES,
} from '@components/check-owner-permission/check-owner-permission.constant';
import { DeleteAlertRequestDto } from '@components/alert/dto/request/delete-alert.request.dto';

@Injectable()
export class AlertService implements AlertServiceInterface {
  constructor(
    @Inject('AlertRepositoryInterface')
    private readonly alertRepository: AlertRepositoryInterface,

    @Inject('ErrorReportRepositoryInterface')
    private readonly errorReportRepository: ErrorReportRepositoryInterface,

    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceService,

    @Inject('UserServiceInterface')
    private readonly userService: UserService,

    @Inject('SaleServiceInterface')
    private readonly saleService: SaleServiceInterface,

    @Inject('ItemServiceInterface')
    private readonly itemService: ItemService,

    @Inject('CheckOwnerPermissionServiceInterface')
    private readonly checkOwnerPermissionService: CheckOwnerPermissionServiceInterface,

    @InjectConnection()
    private readonly connection: Connection,

    private readonly i18n: I18nService,
  ) {}

  public async confirm(request: UpdateAlertStatusRequestDto): Promise<any> {
    const { id } = request;

    const alert = await this.alertRepository.findOneById(id);

    if (isEmpty(alert)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    let type: number;

    const typeAlert = alert?.typeAlert;
    const stage = alert?.stage;

    const message = alert?.description ? alert.description : '';
    const manufacturingOrderId = alert?.manufacturingOrderId;

    if (typeAlert == ALERT_NAME_RECORD.OP) {
      if (stage == STAGES_OPTION.INPUT_PRODUCTION) {
        const productType = alert?.productType; // Loại sản phẩm

        if (productType == ProductTypeAlert.material) {
          type == ALERT_WORK_ORDER_QUALITY_CONTROL_ENUM.MATERIAL_INPUT_ALERT;
        } else if (productType == ProductTypeAlert.productPrevious) {
          type == ALERT_WORK_ORDER_QUALITY_CONTROL_ENUM.PREVIOUS_BOM_ALERT;
        }
      } else if (stage == STAGES_OPTION.OUTPUT_PRODUCTION) {
        type = ALERT_WORK_ORDER_QUALITY_CONTROL_ENUM.PROGRESS_ALERT;
      }

      // Gửi thông báo sang bên mes
      const updateAletForMes = await this.produceService.updateAlertForMes(
        type,
        message,
        manufacturingOrderId,
      );

      if (updateAletForMes?.statusCode !== ResponseCodeEnum.SUCCESS) {
        return new ResponseBuilder()
          .withCode(updateAletForMes?.statusCode)
          .withMessage(
            `${await this.i18n.translate('error.ERROR_MESx')}${
              updateAletForMes?.message
            }`,
          )
          .build();
      }
    } else if (typeAlert == ALERT_NAME_RECORD.INPUT) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_ACCEPTABLE)
        .withMessage(
          'Mes chưa update được dữ liệu công đoạn đầu vào, khỏi confirm !',
        )
        .build();
    } else if (typeAlert == ALERT_NAME_RECORD.OUTPUT) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_ACCEPTABLE)
        .withMessage(
          'Mes chưa update được dữ liệu công đoạn đầu ra, khỏi confirm !',
        )
        .build();
    }

    if (!STATUS_TO_CONFIRM_ALERT.includes(alert.status)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_ACCEPTABLE)
        .withMessage(await this.i18n.translate('error.NOT_ACCEPTABLE'))
        .build();
    }

    return await this.updateAlertStatus(alert, AlertStatusEnum.ACTIVE);
  }

  private async updateAlertStatus(
    alertEntity: Alert,
    status: number,
  ): Promise<any> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      alertEntity.status = status;
      await queryRunner.manager.save(alertEntity);
      await queryRunner.commitTransaction();

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_CONFIRM'))
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  public async getList(
    request: GetListAlertRequestDto,
  ): Promise<ResponsePayload<GetListAlertResponseDto | any>> {
    const { filter, sort, limit, page } = request;
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
    let paramUserIds = {};
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

    let { result, count } = await this.alertRepository.getList(
      request,
      filterStageSearch,
      filterUserSearch,
    );

    // MAP tên user
    const userIds = uniq(result.map((x) => x.userId)) as Array<any>;
    const users = await this.userService.getUserMapByIds(userIds);

    result = result.reduce((x, y) => {
      x.push({
        username: users.get(y?.userId),
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
    result = sortService(result, sort, ['username']);

    // PAGINATE
    if (page && limit) {
      result = paginationService(result, Number(page), Number(limit));
    }

    const response = plainToClass(AlertResponseDto, result, {
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
    request: any,
  ): Promise<ResponsePayload<AlertRequestDto | any>> {
    const { id, typeAlert } = request;
    const alert = await this.alertRepository.getDetail(id, typeAlert);

    if (!alert) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    const alertResponse = {
      id: alert.id,
      code: alert.code,
      name: alert.name,
      description: alert.description,
      stage: alert.stage,
      status: alert.status,
      typeAlert: alert.typeAlert,
      item: {},
      manufacturingOrder: {},
      routing: {},
      producingStep: {},
      purchasedOrder: {},
      warehouse: {},
      errorReport: {},
      alertRelatedUsers: [],
      productType: alert.productType,
    };

    const userIds = [];
    if (!isEmpty(alert.alertRelatedUsers)) {
      alert.alertRelatedUsers.forEach((user) => {
        userIds.push(user.userId);
      });
    }
    const users = await this.userService.getListByIDs(userIds);
    if (!isEmpty(users)) {
      users.forEach((user) => {
        alertResponse.alertRelatedUsers.push({
          id: user.id,
          username: user.username,
        });
      });
    }

    const errorReport = await this.errorReportRepository.findOneById(
      alert.errorReportId,
    );
    if (!isEmpty(errorReport) && alert.errorReportId !== null) {
      alertResponse.errorReport = {
        id: errorReport.id,
        name: errorReport.name,
      };
    }

    // Mã Lệnh + Kho
    if (alert.typeAlert === 2 && alert.stage === 0) {
      const purchasedOrder = await this.saleService.getPurchasedOrderById(
        alert.purchasedOrderId,
      );
      if (!isEmpty(purchasedOrder)) {
        alertResponse.purchasedOrder = {
          id: purchasedOrder.id,
          code: purchasedOrder.code,
        };

        if (!isEmpty(purchasedOrder.purchasedOrderWarehouseDetails)) {
          purchasedOrder.purchasedOrderWarehouseDetails.forEach((val) => {
            if (val.itemId === alert.itemId) {
              if (!isEmpty(val.warehouse)) {
                alertResponse.warehouse = {
                  id: val.warehouse.id,
                  name: val.warehouse.name,
                };
              }
            }
          });
        }
      }
    }

    if (
      (alert.typeAlert === 2 && alert.stage === 2) ||
      (alert.typeAlert === 3 && alert.stage === 3)
    ) {
      const purchasedOrder = await this.saleService.getProductionOrderById(
        alert.purchasedOrderId,
      );
      if (!isEmpty(purchasedOrder)) {
        alertResponse.purchasedOrder = {
          id: purchasedOrder.id,
          code: purchasedOrder.code,
        };

        if (!isEmpty(purchasedOrder.productionOrderWarehouseDetails)) {
          purchasedOrder.productionOrderWarehouseDetails.forEach((val) => {
            if (val.itemId === alert.itemId) {
              if (!isEmpty(val.warehouse)) {
                alertResponse.warehouse = {
                  id: val.warehouse.id,
                  name: val.warehouse.name,
                };
              }
            }
          });
        }
      }
    }

    if (alert.typeAlert === 3 && alert.stage === 5) {
      const purchasedOrder = await this.saleService.getSaleOrderExportById(
        alert.purchasedOrderId,
      );
      if (!isEmpty(purchasedOrder)) {
        alertResponse.purchasedOrder = {
          id: purchasedOrder.id,
          code: purchasedOrder.code,
        };

        if (!isEmpty(purchasedOrder.saleOrderWarehouseDetails)) {
          purchasedOrder.saleOrderWarehouseDetails.forEach((val) => {
            if (val.itemId === alert.itemId) {
              if (!isEmpty(val.warehouse)) {
                alertResponse.warehouse = {
                  id: val.warehouse.id,
                  name: val.warehouse.name,
                };
              }
            }
          });
        }
      }
    }

    // QC Công Đoạn Sản Xuất
    const manufacturingOrder =
      await this.produceService.getManufacturingOrderDetail(
        alert.manufacturingOrderId,
      );
    if (!isEmpty(manufacturingOrder)) {
      alertResponse.manufacturingOrder = {
        id: manufacturingOrder.id,
        name: manufacturingOrder.name,
      };
    }

    const item = await this.itemService.getItemById(alert.itemId);
    if (!isEmpty(item)) {
      alertResponse.item = {
        id: item.id,
        code: item.code,
      };
    }

    const routing = await this.produceService.getRoutingByID(alert.routingId);
    if (!isEmpty(routing)) {
      alertResponse.routing = {
        id: routing.id,
        name: routing.name,
      };
    }

    const producingStep = await this.produceService.getProduceStepByID(
      alert.producingStepId,
    );
    if (!isEmpty(producingStep)) {
      alertResponse.producingStep = {
        id: producingStep.id,
        name: producingStep.name,
      };
    }

    const alertDetail = plainToClass(AlertDetailResponseDto, alertResponse, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(alertDetail)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(alertDetail)
      .build();
  }

  public async create(
    alertDto: CreateAlertRequestDto,
  ): Promise<ResponsePayload<AlertResponseDto | any>> {
    const checkUnique = await this.checkUnique(null, alertDto);
    if (checkUnique) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(checkUnique)
        .build();
    }

    const validate = await this.validate(alertDto);
    if (validate) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(validate)
        .build();
    }

    const alertEntity = await this.alertRepository.createEntity(alertDto);

    return await this.save(alertEntity, alertDto);
  }

  public async save(
    alert: Alert,
    payload: any,
  ): Promise<ResponsePayload<AlertResponseDto> | any> {
    const { alertRelatedUsers } = payload;
    const isUpdate = alert.id !== null;
    const queryRunner = this.connection.createQueryRunner();
    queryRunner.startTransaction();

    try {
      let response;
      const typeAlert = alert.typeAlert;
      const result = await queryRunner.manager.save(alert);

      if (
        typeAlert === ALERT_NAME_RECORD.INPUT ||
        typeAlert === ALERT_NAME_RECORD.OUTPUT
      ) {
        const alertRelatedUserEntities = alertRelatedUsers.map((obj) =>
          this.alertRepository.createAlertRelatedUserEntity(
            result.id,
            obj.userId,
          ),
        );

        if (isUpdate) {
          await queryRunner.manager.delete(AlertRelatedUser, {
            alertId: result.id,
          });
        }

        result.alertRelatedUsers = await queryRunner.manager.save(
          alertRelatedUserEntities,
        );
      }

      await queryRunner.commitTransaction();

      if (typeAlert === ALERT_NAME_RECORD.OP) {
        response = plainToClass(AlertOpResponseDto, result, {
          excludeExtraneousValues: true,
        });
      }

      if (
        typeAlert === ALERT_NAME_RECORD.INPUT ||
        typeAlert === ALERT_NAME_RECORD.OUTPUT
      ) {
        response = plainToClass(AlertInputOutputResponseDto, result, {
          excludeExtraneousValues: true,
        });
      }

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

  public async update(
    alertDto: UpdateAlertRequestDto,
  ): Promise<ResponsePayload<AlertResponseDto | any>> {
    const { user } = alertDto;
    const alert = await this.alertRepository.findOneByCondition({
      id: alertDto.id,
      typeAlert: alertDto.typeAlert,
    });
    if (!alert) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    // check owner permission
    const isOwnerPermitted =
      await this.checkOwnerPermissionService.checkOwnerPermission({
        user: user,
        record: { ...alert, createdBy: alert.userId },
        departmentIds: BASE_OWNER_DEPARTMENT_IDS,
        roleCodes: BASE_OWNER_ROLES_CODES,
      });

    if (!isOwnerPermitted) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.ALERT_NOT_OWNER'))
        .build();
    }

    if (alert.status === AlertStatusEnum.ACTIVE) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.ALERT_ACTIVE'))
        .build();
    }

    const checkUnique = await this.checkUnique(alertDto.id, alertDto);
    if (checkUnique) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(checkUnique)
        .build();
    }

    const validate = await this.validate(alertDto);

    if (validate) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(validate)
        .build();
    }

    const typeAlert = alert.typeAlert;

    alert.code = alertDto.code.trim();
    alert.name = alertDto.name.trim();
    alert.description = alertDto.description?.trim();
    alert.stage = alertDto.stage;
    alert.itemId = alertDto.itemId;

    if (typeAlert === ALERT_NAME_RECORD.OP) {
      alert.manufacturingOrderId = alertDto.manufacturingOrderId;
      alert.routingId = alertDto.routingId;
      alert.producingStepId = alertDto.producingStepId;
      alert.purchasedOrderId = null;
      alert.warehouseId = null;
      alert.errorReportId = null;

      if (alert?.stage == STAGES_OPTION.INPUT_PRODUCTION) {
        alert.productType = alertDto?.productType;
      }
    }

    if (
      typeAlert === ALERT_NAME_RECORD.INPUT ||
      typeAlert === ALERT_NAME_RECORD.OUTPUT
    ) {
      alert.manufacturingOrderId = null;
      alert.routingId = null;
      alert.producingStepId = null;
      alert.purchasedOrderId = alertDto.purchasedOrderId;
      alert.warehouseId = alertDto.warehouseId;
      alert.errorReportId = alertDto.errorReportId;
    }

    return await this.save(alert, alertDto);
  }

  public async remove(
    request: DeleteAlertRequestDto,
  ): Promise<ResponsePayload<SuccessResponse | any>> {
    const { user, id } = request;
    const alert = await this.alertRepository.findOneById(id);
    if (isEmpty(alert)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    // check owner permission
    const isOwnerPermitted =
      await this.checkOwnerPermissionService.checkOwnerPermission({
        user: user,
        record: { ...alert, createdBy: alert.userId },
        departmentIds: BASE_OWNER_DEPARTMENT_IDS,
        roleCodes: BASE_OWNER_ROLES_CODES,
      });

    if (!isOwnerPermitted) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.ALERT_NOT_OWNER'))
        .build();
    }

    if (alert.status === AlertStatusEnum.ACTIVE) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.ALERT_ACTIVE'))
        .build();
    }

    const queryRunner = this.connection.createQueryRunner();
    queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(AlertRelatedUser, { alertId: id });
      await queryRunner.manager.delete(Alert, { id: id });

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

  private async checkUnique(
    id: number,
    alertDto: AlertRequestDto,
  ): Promise<string> {
    const existedRecordByCode = await this.alertRepository.getExistedRecord(
      id,
      alertDto,
    );
    const msg = await this.i18n.translate('error.DB_RECORD_EXISTED');

    if (existedRecordByCode) {
      return stringFormat(msg, ALERT_DB.CODE.COL_NAME);
    }

    return null;
  }

  private async validate(alertDto: AlertRequestDto): Promise<string> {
    const typeAlert = alertDto.typeAlert;
    const stage = alertDto.stage;

    if (
      typeAlert !== ALERT_NAME_RECORD.OP &&
      typeAlert !== ALERT_NAME_RECORD.INPUT &&
      typeAlert !== ALERT_NAME_RECORD.OUTPUT
    ) {
      return await this.i18n.translate('error.REQUEST_ERROR_DATA');
    }

    const msgIsEmpty = await this.i18n.translate('error.DB_RECORD_EMPTY');
    const msgNotNumber = await this.i18n.translate(
      'error.DB_RECORD_NOT_NUMBER',
    );

    const arrOp = [
      [
        ALERT_DB.MANUFACTURING_ORDER_ID.DB_COL_NAME,
        ALERT_DB.MANUFACTURING_ORDER_ID.COL_NAME,
      ],
      [ ALERT_DB.ROUTING_ID.DB_COL_NAME, ALERT_DB.ROUTING_ID.COL_NAME ],
      [
        ALERT_DB.PRODUCING_STEP_ID.DB_COL_NAME,
        ALERT_DB.PRODUCING_STEP_ID.COL_NAME,
      ],
    ];

    const arrInputOutput = [
      [
        ALERT_DB.PURCHASED_ORDER_ID.DB_COL_NAME,
        ALERT_DB.PURCHASED_ORDER_ID.COL_NAME,
      ],
      [ALERT_DB.WAREHOUSE_ID.DB_COL_NAME, ALERT_DB.WAREHOUSE_ID.COL_NAME],
      [ALERT_DB.ERROR_REPORT_ID.DB_COL_NAME, ALERT_DB.ERROR_REPORT_ID.COL_NAME],
    ];

    if (typeAlert === ALERT_NAME_RECORD.OP) {
      for (let i = 0; i < arrOp.length; i++) {
        if (
          !alertDto[`${arrOp[i][0]}`] ||
          alertDto[`${arrOp[i][0]}`].length < 1
        ) {
          return stringFormat(msgIsEmpty, arrOp[i][1]);
        } else {
          if (/\D/.test(alertDto[`${arrOp[i][0]}`])) {
            return stringFormat(msgNotNumber, arrOp[i][1]);
          }
        }
      }
    }

    if (
      typeAlert === ALERT_NAME_RECORD.INPUT ||
      typeAlert === ALERT_NAME_RECORD.OUTPUT
    ) {
      for (let i = 0; i < arrInputOutput.length; i++) {
        if (
          !alertDto[`${arrInputOutput[i][0]}`] ||
          alertDto[`${arrInputOutput[i][0]}`].length < 1
        ) {
          return stringFormat(msgIsEmpty, arrInputOutput[i][1]);
        } else {
          if (/\D/.test(alertDto[`${arrInputOutput[i][0]}`])) {
            return stringFormat(msgNotNumber, arrInputOutput[i][1]);
          }
        }
      }

      if (isEmpty(alertDto.alertRelatedUsers)) {
        return stringFormat(
          msgIsEmpty,
          ALERT_DB.ALERT_RELATED_USERS.ID.COL_NAME,
        );
      }
    }

    if (
      typeAlert == ALERT_NAME_RECORD.OP &&
      stage == STAGES_OPTION.INPUT_PRODUCTION
    ) {
      const productType = alertDto?.productType;

      if (productType == undefined) {
        return await this.i18n.translate('error.PRODUCT_TYPE_ALERT_EMPTY');
      }
    }

    return null;
  }

  public async getAlertListManufacturingOrder(): Promise<any> {
    const manufacturingOrders =
      await this.produceService.getListManufacturingOrder();

    return new ResponseBuilder(manufacturingOrders)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(manufacturingOrders)
      .build();
  }

  public async envAlertListItemByManufacturingOrderId(
    id: number,
  ): Promise<any> {
    const items = await this.produceService.getItemByManufacturingOrderId(id);

    return new ResponseBuilder(items)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(items)
      .build();
  }

  public async envAlertListRoutingByItemId(id: number): Promise<any> {
    const routings = await this.produceService.getRoutingByItemId(id);

    return new ResponseBuilder(routings)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(routings)
      .build();
  }

  public async envAlertGetProducingStepByRoutingId(id: number): Promise<any> {
    const producingSteps =
      await this.produceService.envAlertGetProducingStepByRoutingId(id);

    return new ResponseBuilder(producingSteps)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(producingSteps)
      .build();
  }

  // purchased order
  public async getAlertPurchasedOrder(): Promise<any> {
    const purchasedOrders =
      await this.saleService.getAlertEnvListPurchasedOrder();

    return new ResponseBuilder(purchasedOrders)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(purchasedOrders)
      .build();
  }

  public async getAlertItemByPurchasedOrder(id: number): Promise<any> {
    const items = await this.saleService.getItemByPurchasedOrder(id);

    return new ResponseBuilder(items)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(items)
      .build();
  }

  public async getAlertWarehouseByPurchasedOrderAndItem(
    purchasedOrderId: number,
    itemId: number,
  ): Promise<any> {
    const warehouses =
      await this.saleService.getWarehouseByPurchasedOrderAndItem(
        purchasedOrderId,
        itemId,
      );

    return new ResponseBuilder(warehouses)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(warehouses)
      .build();
  }

  // sale order export
  public async getAlertSaleOrderExport(): Promise<any> {
    const saleOrderExports = await this.saleService.getListSaleOrderExport();

    return new ResponseBuilder(saleOrderExports)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(saleOrderExports)
      .build();
  }

  public async getAlertItemBySaleOrderExport(id: number): Promise<any> {
    const items = await this.saleService.getItemBySaleOrderExport(id);

    return new ResponseBuilder(items)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(items)
      .build();
  }

  public async getAlertWarehouseBySaleOrderExportAndItem(
    saleOrderId: number,
    itemId: number,
  ): Promise<any> {
    const warehouses =
      await this.saleService.getWarehouseBySaleOrderExportAndItem(
        saleOrderId,
        itemId,
      );

    return new ResponseBuilder(warehouses)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(warehouses)
      .build();
  }

  // production order
  public async getAlertProductionOrder(type: number): Promise<any> {
    const productionOrders = await this.saleService.getListProductionOrder(
      type,
    );

    return new ResponseBuilder(productionOrders)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(productionOrders)
      .build();
  }

  public async getAlertItemByProductionOrder(id: number): Promise<any> {
    const items = await this.saleService.getItemByProductionOrder(id);

    return new ResponseBuilder(items)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(items)
      .build();
  }

  public async getAlertWarehouseByProductionOrderAndItem(
    productionOrderId: number,
    itemId: number,
  ): Promise<any> {
    const warehouses =
      await this.saleService.getWarehouseByProductionOrderAndItem(
        productionOrderId,
        itemId,
      );

    return new ResponseBuilder(warehouses)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(warehouses)
      .build();
  }

  async getAlertQcCheckItemByPurchasedOrder(id: number): Promise<any> {
    const items = await this.saleService.getItemByPurchasedOrder(id, true);

    return new ResponseBuilder(items)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(items)
      .build();
  }

  async getAlertQcCheckItemBySaleOrderExport(id: number): Promise<any> {
    const items = await this.saleService.getItemBySaleOrderExport(id, true);

    return new ResponseBuilder(items)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(items)
      .build();
  }

  async getAlertQcCheckItemByProductionOrder(id: number): Promise<any> {
    const items = await this.saleService.getItemByProductionOrder(id, true);

    return new ResponseBuilder(items)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(items)
      .build();
  }
}
