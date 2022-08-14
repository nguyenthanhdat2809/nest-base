import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { ActualQuantityImportHistory } from '@entities/actual-quantity-import-history/actual-quantity-import-history.entity';
import { ActualQuantityImportHistoryRepositoryInterface } from '@components/actual-quantity-import-history/interface/actual-quantity-import-history.repository.interface';
import { ActualQuantityImportHistoryRequestDto } from '@components/actual-quantity-import-history/dto/request/actual-quantity-import-history.request.dto';
import {
  DashBoardDateTimeFormat,
  TransactionHistoryInputQcTypes,
  TransactionHistoryIOqcTypeEnum,
  TransactionHistoryOutputQcTypes,
  TransactionHistoryProduceStepTypeEnum,
  TransactionHistoryProducingStepsQcTypes,
  TransactionHistoryTypeEnum
} from "@components/transaction-history/transaction-history.constant";
import { GetDashboardIoQcProgressRequestDto } from '@components/dashboard/dto/request/get-dashboard-io-qc-progress-request.dto';
import { GetDashboardFinishedItemProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-finished-item-progress.request.dto";

@Injectable()
export class ActualQuantityImportHistoryRepository
  extends BaseAbstractRepository<ActualQuantityImportHistory>
  implements ActualQuantityImportHistoryRepositoryInterface
{
  constructor(
    @InjectRepository(ActualQuantityImportHistory)
    private readonly actualQuantityImportHistoryRepository: Repository<ActualQuantityImportHistory>,
  ) {
    super(actualQuantityImportHistoryRepository);
  }

  public createEntity(
    request: any,
  ): ActualQuantityImportHistory {
    const actualQuantityImportHistory = new ActualQuantityImportHistory();

    actualQuantityImportHistory.qcStageId = request?.qcStageId;
    actualQuantityImportHistory.orderId = request?.orderId;
    actualQuantityImportHistory.warehouseId = request?.warehouseId;
    actualQuantityImportHistory.itemId = request?.itemId;
    actualQuantityImportHistory.actualQuantity = request?.actualQuantity;
    actualQuantityImportHistory.moId = request?.moId;
    actualQuantityImportHistory.producingStepId = request?.producingStepId;
    return actualQuantityImportHistory;
  }

  public async getImportQuantityHistoriesByCreatedDate(
    request: GetDashboardIoQcProgressRequestDto,
    type: TransactionHistoryIOqcTypeEnum,
  ): Promise<any> {
    const { qcStageId, itemId, orderId } = request;
    let qcTypeFilter;
    switch (type) {
      case TransactionHistoryIOqcTypeEnum.input:
        qcTypeFilter =
          !qcStageId && qcStageId !== 0
            ? TransactionHistoryInputQcTypes
            : [qcStageId];
        break;
      case TransactionHistoryIOqcTypeEnum.output:
        qcTypeFilter =
          !qcStageId && qcStageId !== 0
            ? TransactionHistoryOutputQcTypes
            : [qcStageId];
        break;
      default:
        break;
    }
    const query = this.actualQuantityImportHistoryRepository
      .createQueryBuilder('a')
      .select([
        `TO_CHAR(a.created_at, '${DashBoardDateTimeFormat}') as "date"`,
        `SUM(a.actual_quantity) as "importQuantity"`,
      ])
      .innerJoin(
        (qb) => {
          qb.select([
            `MAX(asb.id) as maxId`,
            'asb.qc_stage_id as "qcStageId"',
            `TO_CHAR(asb.created_at, '${DashBoardDateTimeFormat}') as createdAt`,
          ])
            .from('actual_quantity_import_histories', 'asb')
            .where('asb.qc_stage_id IN (:...types)', {
              types: qcTypeFilter,
            })
            .groupBy('createdAt')
            .addGroupBy('asb.qc_stage_id')
            .addGroupBy('asb.order_id')
            .addGroupBy('asb.warehouse_id')
            .addGroupBy('asb.item_id');

          if (itemId) {
            qb.andWhere('asb.item_id = :itemId', { itemId: itemId });
          }

          if (orderId) {
            qb.andWhere('asb.order_id = :orderId', { orderId: orderId });
          }
          return qb;
        },
        'tas',
        ' a.id = tas.maxId',
      )
      .orderBy('date', 'ASC')
      .addGroupBy('date');
    return await query.getRawMany();
  }

  async getImportQuantityHistoriesByCreatedDateForProducingSteps(
    request: GetDashboardFinishedItemProgressRequestDto,
  ): Promise<any> {
    const { producingStepId, itemId, moId } = request;
    const qcTypeFilter = [TransactionHistoryTypeEnum.OutputProducingStep];
    const query = this.actualQuantityImportHistoryRepository
      .createQueryBuilder('a')
      .select([
        `TO_CHAR(a.created_at, '${DashBoardDateTimeFormat}') as "date"`,
        `SUM(a.actual_quantity) as "producedQuantity"`,
      ])
      .innerJoin(
        (qb) => {
          qb.select([
            `MAX(asb.id) as maxId`,
            'asb.qc_stage_id as "qcStageId"',
            `TO_CHAR(asb.created_at, '${DashBoardDateTimeFormat}') as createdAt`,
          ])
            .from('actual_quantity_import_histories', 'asb')
            .where('asb.qc_stage_id IN (:...types)', {
              types: qcTypeFilter,
            })
            .groupBy('createdAt')
            .addGroupBy('asb.qc_stage_id')
            .addGroupBy('asb.order_id')
            .addGroupBy('asb.mo_id')
            .addGroupBy('asb.item_id')
            .addGroupBy('asb.producing_step_id');

          if (itemId) {
            qb.andWhere('asb.item_id = :itemId', { itemId: itemId });
          }

          if (moId) {
            qb.andWhere('asb.mo_id = :moId', { moId: moId });
          }

          if (producingStepId) {
            qb.andWhere('asb.producing_step_id = :producingStepId', {
              producingStepId: producingStepId,
            });
          }
          return qb;
        },
        'tas',
        ' a.id = tas.maxId',
      )
      .orderBy('date', 'ASC')
      .addGroupBy('date');
    return await query.getRawMany();
  }
}
