import { Inject, Injectable } from '@nestjs/common';
import { ResponsePayload } from '@utils/response-payload';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { plainToClass } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';
import { stringFormat } from '@utils/object.util';
import { PagingResponse } from '@utils/paging.response';
import { isEmpty } from 'lodash';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SuccessResponse } from '@utils/success.response.dto';
import { ApiError } from '@utils/api.error';
import { WorkCenterPlanQcShiftServiceInterface } from '@components/work-center-plan-qc-shift/interface/work-center-plan-qc-shift.service.interface';
import { WorkCenterPlanQcShiftRepositoryInterface } from '@components/work-center-plan-qc-shift/interface/work-center-plan-qc-shift.repository.interface';
import { WorkCenterPlanQcShiftResponseDto } from '@components/work-center-plan-qc-shift/dto/response/work-center-plan-qc-shift.response.dto';
import { CreateWorkCenterPlanQcShiftRequestDto } from '@components/work-center-plan-qc-shift/dto/request/create-work-center-plan-qc-shift.request.dto';
import { CreateWorkCenterPlanQcShiftResponseDto } from '@components/work-center-plan-qc-shift/dto/response/create-work-center-plan-qc-shift.response.dto';
import { WorkCenterPlanQcShift } from '@entities/work-center-plan-qc-shift/work-center-plan-qc-shift.entity';
import { ProduceServiceInterface } from '@components/produce/interface/produce.service.interface';
import { DeleteWorkCenterPlanQcShiftByWoIdAndWcIdRequestDto } from '@components/work-center-plan-qc-shift/dto/request/delete-work-center-plan-qc-shift-by-wo-id-and-wc-id.request.dto';
import { enumerateDaysBetweenDates } from '@utils/common';
import { QualityPlanBomRepositoryInterface } from '@components/quality-plan/interface/quality-plan-bom.repository.interface';
import { TIME_ZONE_VN } from '@constant/common';
import { extendMoment } from 'moment-range';
import * as MomentTimezone from 'moment-timezone';
import {
  BASE_OWNER_DEPARTMENT_IDS,
  BASE_OWNER_ROLES_CODES,
} from '@components/check-owner-permission/check-owner-permission.constant';

const moment = extendMoment(MomentTimezone);

@Injectable()
export class WorkCenterPlanQcShiftService
  implements WorkCenterPlanQcShiftServiceInterface
{
  constructor(
    @Inject('WorkCenterPlanQcShiftRepositoryInterface')
    private readonly workCenterPlanQcShiftRepository: WorkCenterPlanQcShiftRepositoryInterface,

    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceServiceInterface,

    @Inject('QualityPlanBomRepositoryInterface')
    private readonly qualityPlanBomRepository: QualityPlanBomRepositoryInterface,

    @InjectConnection()
    private readonly connection: Connection,

    private readonly i18n: I18nService,
  ) {}

  // Tạo wc plan
  public async createWorkCenterPlanQcShift(
    request: CreateWorkCenterPlanQcShiftRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { workOrderId, workCenterId, user } = request;
    const workOrder = await this.produceService.workOrderDetail(workOrderId);

    if (isEmpty(workOrder)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.WORK_ORDER_NOT_FOUND'))
        .build();
    }

    const workCenter = await this.produceService.workCenterDetail(workCenterId);

    if (isEmpty(workCenter)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.WORK_CENTER_NOT_FOUND'))
        .build();
    }

    const createWorkCenterPlanQcShiftEntity =
      this.workCenterPlanQcShiftRepository.createWorkCenterPlanQcShiftEntity(
        request,
      );

    const planQuantityTotal = createWorkCenterPlanQcShiftEntity.reduce(
      (x, y) => x + y?.planQuantity,
      0,
    );
    const qualityPlanBom =
      await this.qualityPlanBomRepository.findOneByCondition({
        workOrderId: workOrderId,
      });

    if (isEmpty(qualityPlanBom)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.QUALITY_PLAN_NOT_FOUND'))
        .build();
    }

    const planQcQuantityBom = qualityPlanBom?.planQcQuantity
      ? Number(qualityPlanBom?.planQcQuantity)
      : 0;

    const msg = await this.i18n.translate('error.QC_PLAN_QUANTITY_FAIL');
    const msg1 = msg.replace('COUNT_WC', planQuantityTotal);
    const msg2 = msg1.replace('COUNT_PLAN', planQcQuantityBom);

    if (planQcQuantityBom < planQuantityTotal) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(msg2)
        .build();
    }

    // check if current user is allowed to update/create WC plan qc shifts by work order ID
    const assignedUserByWo =
      await this.workCenterPlanQcShiftRepository.getQualityPlanBomUsers(
        workOrderId,
      );
    const checkOwnerPermission = this.checkOwnerPermissionForWcQcPlan({
      user: user,
      assignedUserByWo: assignedUserByWo,
      departmentIds: BASE_OWNER_DEPARTMENT_IDS,
      roleCodes: BASE_OWNER_ROLES_CODES,
    });
    if (!checkOwnerPermission) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('WORK_CENTER_PLAN_QC_SHIFTS_USER_NOT_ALLOW_CREATE_EDIT'))
        .build();
    }
    return await this.save(createWorkCenterPlanQcShiftEntity, request);
  }

  public async save(
    workCenterPlanQcShift: WorkCenterPlanQcShift[],
    request: any,
  ): Promise<ResponsePayload<CreateWorkCenterPlanQcShiftResponseDto> | any> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(WorkCenterPlanQcShift, {
        workOrderId: request?.workOrderId,
        workCenterId: request?.workCenterId,
      });
      const result = await queryRunner.manager.save(workCenterPlanQcShift);

      await queryRunner.commitTransaction();
      const dataworkInShifts = result?.map((item) => {
        return {
          executionDay: item?.executionDay,
          numberOfShift: item?.numberOfShift,
          planQuantity: item?.planQuantity,
          actualQuantity: item?.actualQuantity,
          moderationQuantity: item?.moderationQuantity,
        };
      });

      const dataResponse = {
        workOrderId: request.workOrderId,
        workCenterId: request.workCenterId,
        workInShifts: dataworkInShifts,
      };

      const response = plainToClass(
        CreateWorkCenterPlanQcShiftResponseDto,
        dataResponse,
        {
          excludeExtraneousValues: true,
        },
      );

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

  // Xóa WC PLAN QC BY WO ID + WC ID
  public async deleteWorkCenterPlanQcShift(
    request: DeleteWorkCenterPlanQcShiftByWoIdAndWcIdRequestDto,
  ): Promise<ResponsePayload<SuccessResponse | any>> {
    const workCenterPlanQcShift =
      await this.workCenterPlanQcShiftRepository.findByCondition({
        workOrderId: request?.workOrderId,
        workCenterId: request?.workCenterId,
      });

    if (isEmpty(workCenterPlanQcShift)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    const queryRunner = this.connection.createQueryRunner();
    queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(WorkCenterPlanQcShift, {
        workOrderId: request?.workOrderId,
        workCenterId: request?.workCenterId,
      });

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

  // Lây danh sách wc plan theo id wc và id wo
  public async workCenterPlanQcShiftByWoIdAndWcId(request: any): Promise<any> {
    const workCenterPlanQcShift =
      await this.workCenterPlanQcShiftRepository.workCenterPlanQcShiftByWoIdAndWcId(
        request,
      );

    if (isEmpty(workCenterPlanQcShift)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    const response = new WorkCenterPlanQcShiftResponseDto();

    response.workOrderId = request.workOrderId;
    response.workCenterId = request.workCenterId;

    const dates = workCenterPlanQcShift.map((item) =>
      moment(item?.executionDay).tz(TIME_ZONE_VN),
    );
    const maxDate = moment(new Date(Math.max.apply(null, dates))).tz(
      TIME_ZONE_VN,
    );
    const minDate = moment(new Date(Math.min.apply(null, dates))).tz(
      TIME_ZONE_VN,
    );

    const timeLines = enumerateDaysBetweenDates(minDate, maxDate);

    if (isEmpty(timeLines)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const workInShifts = [];
    for (let i = 0; i < timeLines.length; i++) {
      const timeLine = timeLines[i];
      for (let j = 0; j < workCenterPlanQcShift.length; j++) {
        const wcPlanQc = workCenterPlanQcShift[j];
        const timeLineQc = moment(wcPlanQc?.executionDay)
          .tz(TIME_ZONE_VN)
          .format();

        if (timeLine == timeLineQc) {
          const workInShiftFilters = workInShifts.filter(
            (woIn) =>
              moment(woIn?.executionDay).tz(TIME_ZONE_VN).format() ==
              timeLineQc,
          );

          if (workInShiftFilters.length > 0) {
            // Kiểm tra ngày đó đã có dữ liệu chưa
            const workInShiftFilter = workInShiftFilters[0];
            const shiftOfWorkInShiftFilter =
              workInShiftFilter?.scheduleShiftDetails?.map(
                (item) => item.numberOfShift,
              ); // Lấy tất cả các ca đã tồn tại trong obj

            if (shiftOfWorkInShiftFilter.includes(wcPlanQc?.numberOfShift)) {
              // nếu ca thứ N có trong dữ liệu thì update dữ liệu đó
              for (const workInShift of workInShifts) {
                if (
                  moment(workInShift?.executionDay).tz(TIME_ZONE_VN).format() ==
                  timeLineQc
                ) {
                  const index = wcPlanQc?.numberOfShift - 1;
                  workInShift.scheduleShiftDetails[index].planQuantity =
                    Number(
                      workInShift.scheduleShiftDetails[index].planQuantity,
                    ) + Number(wcPlanQc?.planQuantity);
                  workInShift.scheduleShiftDetails[index].actualQuantity =
                    Number(
                      workInShift.scheduleShiftDetails[index].actualQuantity,
                    ) + Number(wcPlanQc?.actualQuantity);
                  workInShift.scheduleShiftDetails[index].moderationQuantity =
                    Number(
                      workInShift.scheduleShiftDetails[index]
                        .moderationQuantity,
                    ) + Number(wcPlanQc?.moderationQuantity);
                }
              }
            } else {
              // nếu ca đó ko tồn tại trong dữ liệu. loop xem đã có những ca nào.
              for (const workInShift of workInShifts) {
                if (
                  moment(workInShift?.executionDay).tz(TIME_ZONE_VN).format() ==
                  timeLineQc
                ) {
                  for (let k = 1; k <= wcPlanQc?.numberOfShift; k++) {
                    if (k != wcPlanQc?.numberOfShift) {
                      if (isEmpty(workInShift.scheduleShiftDetails[k - 1])) {
                        workInShift.scheduleShiftDetails[k - 1] = {
                          numberOfShift: k,
                          planQuantity: 0,
                          actualQuantity: 0,
                          moderationQuantity: 0,
                        };
                      }
                    } else {
                      workInShift.scheduleShiftDetails[k - 1] = {
                        numberOfShift: k,
                        planQuantity: Number(wcPlanQc?.planQuantity),
                        actualQuantity: Number(wcPlanQc?.actualQuantity),
                        moderationQuantity: Number(
                          wcPlanQc?.moderationQuantity,
                        ),
                      };
                    }
                  }
                }
              }
            }
          } else {
            // nếu ko có thì kiểm tra ca thứ mấy để tạo đủ obj cho từng ca sắp xếp từ 0 - max
            const scheduleShiftDetails = [];
            for (let i = 1; i <= Number(wcPlanQc.numberOfShift); i++) {
              if (i == Number(wcPlanQc.numberOfShift)) {
                scheduleShiftDetails.push({
                  numberOfShift: wcPlanQc.numberOfShift,
                  planQuantity: Number(wcPlanQc.planQuantity),
                  actualQuantity: Number(wcPlanQc.actualQuantity),
                  moderationQuantity: Number(wcPlanQc.moderationQuantity),
                });
              } else {
                scheduleShiftDetails.push({
                  numberOfShift: i,
                  planQuantity: 0,
                  actualQuantity: 0,
                  moderationQuantity: 0,
                });
              }
            }

            scheduleShiftDetails.sort((a, b) =>
              a.numberOfShift > b.numberOfShift
                ? 1
                : b.numberOfShift > a.numberOfShift
                ? -1
                : 0,
            );

            workInShifts.push({
              executionDay: moment(wcPlanQc?.executionDay)
                .tz(TIME_ZONE_VN)
                .format(),
              scheduleShiftDetails: scheduleShiftDetails,
            });
          }
        }
      }
    }

    response.workInShifts = workInShifts;

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  private async mapDataWcPlanQc(transactionHistory: any): Promise<any> {
    const executionDayQc = moment(transactionHistory?.createdAt)
      .tz(TIME_ZONE_VN)
      .format();
    let executionDayQcStart = moment(transactionHistory?.createdAt)
      .tz(TIME_ZONE_VN)
      .startOf('day')
      .format();
    const executionHoursQc = moment(transactionHistory?.createdAt)
      .tz(TIME_ZONE_VN)
      .format('HH:mm:ss');

    const workOrderId = transactionHistory?.orderId;
    const workCenterId = transactionHistory?.workCenterId;

    const workOrder = await this.produceService.workOrderDetail(workOrderId);

    if (isEmpty(workOrder)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.WORK_ORDER_NOT_FOUND'))
        .build();
    }

    const workCenter = await this.produceService.workCenterDetail(workCenterId);

    if (isEmpty(workCenter)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.WORK_CENTER_NOT_FOUND'))
        .build();
    }

    const qualityPlanBom =
      await this.qualityPlanBomRepository.findOneByCondition({
        workOrderId: workOrderId,
      });

    if (isEmpty(qualityPlanBom)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.QUALITY_PLAN_NOT_FOUND'))
        .build();
    }

    // Tim ca
    let numberOfShift: number;
    const workCenterShifts = workCenter?.data?.workCenterShifts;
    const workCenterShiftRelaxTimes =
      workCenter?.data?.workCenterShiftRelaxTimes;

    const planFromDay = moment(qualityPlanBom?.planFrom)
      .tz(TIME_ZONE_VN)
      .startOf('day')
      .format();
    const planToDay = moment(qualityPlanBom?.planTo)
      .tz(TIME_ZONE_VN)
      .endOf('day')
      .format();
    const beginningPlanTo = moment(qualityPlanBom?.planTo)
      .tz(TIME_ZONE_VN)
      .startOf('day')
      .format();

    if (planFromDay <= executionDayQc && planToDay >= executionDayQc) {
      for (let i = 0; i < workCenterShifts.length; i++) {
        const workCenterShift = workCenterShifts[i];
        const workCenterShiftRelaxTime = workCenterShiftRelaxTimes[i];

        if (!isEmpty(workCenterShift) && !isEmpty(workCenterShiftRelaxTime)) {
          if (
            (workCenterShift.startAt <= executionHoursQc &&
              executionHoursQc <= workCenterShiftRelaxTime.startAt) ||
            (workCenterShiftRelaxTime.endAt <= executionHoursQc &&
              executionHoursQc <= workCenterShift.endAt)
          ) {
            numberOfShift = i + 1;
          }
        } else if (
          !isEmpty(workCenterShift) &&
          isEmpty(workCenterShiftRelaxTime)
        ) {
          if (
            workCenterShift.startAt <= executionHoursQc &&
            executionHoursQc <= workCenterShift.endAt
          ) {
            numberOfShift = i + 1;
          }
        }
      }
    } else {
      numberOfShift = workCenterShifts?.length;
      executionDayQcStart = beginningPlanTo;
    }

    if (!numberOfShift) {
      numberOfShift = workCenterShifts?.length;
      executionDayQcStart = beginningPlanTo;
    }

    const actualQuantity =
      Number(transactionHistory?.qcPassQuantity) +
      +Number(transactionHistory?.qcRejectQuantity);

    return {
      workOrderId,
      workCenterId,
      executionDayQcStart,
      numberOfShift,
      actualQuantity,
    };
  }

  public async updateWcPlanQc(transactionHistoryEntity: any): Promise<any> {
    const mapDataWcResult = await this.mapDataWcPlanQc(
      transactionHistoryEntity,
    );

    const workCenterPlanQcShifts =
      await this.workCenterPlanQcShiftRepository.findByCondition({
        workOrderId: mapDataWcResult.workOrderId,
        workCenterId: mapDataWcResult.workCenterId,
        numberOfShift: mapDataWcResult.numberOfShift,
      });

    if (isEmpty(workCenterPlanQcShifts)) {
      return {};
    }

    const workCenterPlanQcShift = workCenterPlanQcShifts.filter(
      (x) =>
        moment(x?.executionDay).tz(TIME_ZONE_VN).format() ==
        mapDataWcResult?.executionDayQcStart,
    )[0];

    if (isEmpty(workCenterPlanQcShift)) {
      return {};
    }
    const actualQuantityMap = mapDataWcResult?.actualQuantity
      ? Number(mapDataWcResult.actualQuantity)
      : 0;

    const actualQuantityObj = workCenterPlanQcShift?.actualQuantity
      ? Number(workCenterPlanQcShift.actualQuantity)
      : 0;

    workCenterPlanQcShift.actualQuantity =
      actualQuantityMap + actualQuantityObj;
    return workCenterPlanQcShift;
  }

  private checkOwnerPermissionForWcQcPlan(param: {
    assignedUserByWo: any;
    roleCodes: string[];
    departmentIds: number[];
    user: any;
  }): boolean {
    let assignedUser;
    if (!isEmpty(param.assignedUserByWo)) {
      assignedUser = param.assignedUserByWo.filter(
        (x) => x == param.user.id,
      );
    }
    const userRoles = param.user.userRoleSettings.filter((x) =>
      param.roleCodes.includes(x.code),
    );
    const userDepartments = param.user.departmentSettings.filter((x) =>
      param.departmentIds.includes(x.id),
    );

    if (!isEmpty(userRoles) && !isEmpty(userDepartments)) {
      if (!isEmpty(assignedUser)) {
        return true;
      } else return false;
    }
    return true;
  }
}
