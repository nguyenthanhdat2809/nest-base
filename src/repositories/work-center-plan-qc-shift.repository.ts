import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { escapeCharForSearch, handleDataRequest } from '@utils/common';
import { ApiError } from '@utils/api.error';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { I18nService } from 'nestjs-i18n';
import { WorkCenterPlanQcShift } from '@entities/work-center-plan-qc-shift/work-center-plan-qc-shift.entity';
import { WorkCenterPlanQcShiftRepositoryInterface } from '@components/work-center-plan-qc-shift/interface/work-center-plan-qc-shift.repository.interface';
import { CreateWorkCenterPlanQcShiftRequestDto } from '@components/work-center-plan-qc-shift/dto/request/create-work-center-plan-qc-shift.request.dto';

import { isEmpty } from 'lodash';

@Injectable()
export class WorkCenterPlanQcShiftRepository
  extends BaseAbstractRepository<WorkCenterPlanQcShift>
  implements WorkCenterPlanQcShiftRepositoryInterface
{
  constructor(
    @InjectRepository(WorkCenterPlanQcShift)
    private readonly workCenterPlanQcShiftRepository: Repository<WorkCenterPlanQcShift>,

    @InjectConnection()
    private readonly connection: Connection,

    private readonly i18n: I18nService,
  ) {
    super(workCenterPlanQcShiftRepository);
  }

  public createWorkCenterPlanQcShiftEntity(
    request: CreateWorkCenterPlanQcShiftRequestDto,
  ): WorkCenterPlanQcShift[] {
    const entities: WorkCenterPlanQcShift[] = [];
    const dayInShifts = request?.workInShiftQcPlan?.dayInShift;

    for(let i = 0; i < dayInShifts.length; i++){
      const dayInShift = dayInShifts[i];
      const scheduleShiftDetails = dayInShift?.scheduleShiftDetails;

      for(let j = 0; j < scheduleShiftDetails.length; j++){
        const workCenterPlanQcShift = new WorkCenterPlanQcShift();
        const scheduleShiftDetail = scheduleShiftDetails[j];

        workCenterPlanQcShift.workOrderId = request.workOrderId;
        workCenterPlanQcShift.workCenterId = request.workCenterId;
        workCenterPlanQcShift.executionDay = dayInShift.executionDay;
        workCenterPlanQcShift.numberOfShift = scheduleShiftDetail.numberOfShift;
        workCenterPlanQcShift.planQuantity = scheduleShiftDetail.planQuantity;
        workCenterPlanQcShift.actualQuantity = scheduleShiftDetail.actualQuantity;
        workCenterPlanQcShift.moderationQuantity = scheduleShiftDetail.moderationQuantity;
        workCenterPlanQcShift.createdBy = request.userId;
        entities.push(workCenterPlanQcShift)
      }
    }

    return entities;
  }

  public async workCenterPlanQcShiftByWoIdAndWcId(
    request: any,
  ): Promise<any> {
    const { workOrderId, workCenterId } = request;

    const workCenterPlanQcShift = await this.workCenterPlanQcShiftRepository
      .createQueryBuilder('wc')
      .where('wc.work_order_id = :workOrderId', { workOrderId: workOrderId })
      .andWhere('wc.work_center_id = :workCenterId', { workCenterId: workCenterId })
      .getMany();

    return workCenterPlanQcShift;
  }

  public async getQualityPlanBomUsers(workOrderId: number): Promise<any> {
    const query = this.workCenterPlanQcShiftRepository
      .createQueryBuilder('q')
      .select([
        'qpbu.userId as "userId"',
        'qpb.workOrderId as "workOrderId"',
      ])
      .leftJoin(
        'quality_plan_boms',
        'qpb',
        'qpb.work_order_id = q.work_order_id',
      )
      .leftJoin('qpb.qualityPlanBomQualityPointUsers', 'qpbu')
      .where('q.workOrderId = :woId', { woId: workOrderId })
      .groupBy('qpbu.userId')
      .addGroupBy('qpb.workOrderId');
    return await query.getRawMany();
  }

  public async getQualityPlanBomByUserAndWo(
    woIds: number[],
    userId: number,
  ): Promise<any> {
    const query = this.workCenterPlanQcShiftRepository
      .createQueryBuilder('q')
      .select([
        'qpbu.userId as "userId"',
        'qpb.workOrderId as "workOrderId"',
      ])
      .leftJoin(
        'quality_plan_boms',
        'qpb',
        'qpb.work_order_id = q.work_order_id',
      )
      .leftJoin('qpb.qualityPlanBomQualityPointUsers', 'qpbu')
      .where('q.workOrderId IN (:...woIds)', { woIds: woIds })
      .andWhere('qpbu.userId = :uId', { uId: userId })
      .groupBy('qpbu.userId')
      .addGroupBy('qpb.workOrderId');
    return await query.getRawMany();
  }
}
