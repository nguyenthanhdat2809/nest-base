import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { TransactionHistory } from '@entities/transaction-history/transaction-history.entity';
import { TransactionHistoryRepositoryInterface } from '@components/transaction-history/interface/transaction-history.repository.interface';
import { TransactionHistoryLogTime } from '@entities/transaction-history/transaction-history-log-time.entity';
import { TransactionHistoryLogTimeRepositoryInterface } from '@components/transaction-history/interface/transaction-history-log-time.repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Brackets, Connection, Repository } from 'typeorm';
import { TransactionHistoryLogTimeStatusEnum } from '@components/transaction-history/transaction-history.constant';
import { escapeCharForSearch } from '@utils/common';

@Injectable()
export class TransactionHistoryLogTimeRepository
  extends BaseAbstractRepository<TransactionHistoryLogTime>
  implements TransactionHistoryLogTimeRepositoryInterface
{
  constructor(
    @InjectRepository(TransactionHistoryLogTime)
    private readonly transactionHistoryLogTimeRepository: Repository<TransactionHistoryLogTime>,

    @InjectConnection()
    private readonly connection: Connection,
  ) {
    super(transactionHistoryLogTimeRepository);
  }

  createEntity(request: any): TransactionHistoryLogTime {
    const entity = new TransactionHistoryLogTime();
    entity.startTime = request.startTime;
    entity.endTime = request.endTime;
    entity.duration = request.duration;
    entity.type = request.type;
    entity.status = request.status;
    return entity;
  }

  public async getProduceStepQcLogTimeDetail(id: number): Promise<any> {
    const query = this.transactionHistoryLogTimeRepository
      .createQueryBuilder('lt')
      .select([
        'lt.id as "id"',
        'lt.startTime as "startTime"',
        'lt.endTime as "endTime"',
        'lt.playTime as "playTime"',
        'lt.duration as "currentDuration"',
        'lt.transactionHistoryId as "transactionHistoryId"',
        'lt.status as "status"',
        'lt.type as "type"',
        `CASE WHEN sum(lta.duration) IS NOT NULL AND lt.duration IS NOT NULL THEN sum(lta.duration) + lt.duration ELSE lt.duration END AS "totalDuration"`,
        `CASE WHEN count("lta") = 0 THEN '[]' ELSE JSON_AGG(JSONB_BUILD_OBJECT(
        'id', lta.id, 'startTime', lta.start_time, 'endTime', lta.end_time, 'duration', lta.duration)) END AS "logTimeAdditions"`,
      ])
      .leftJoin('lt.transactionHistoryLogTimeAddition', 'lta')
      .groupBy('lt.id')
      .where('lt.id = :id', { id: id });
    return await query.getRawOne();
  }
  public async getNotFinishedQcLogTime(): Promise<any> {
    let result;
    // query log time with transaction history with error reports
    const query1 = this.transactionHistoryLogTimeRepository
      .createQueryBuilder('lt')
      .select(['lt.id as "id"', 'lt.status as "status"'])
      .innerJoin('lt.transactionHistory', 'ltth')
      .innerJoin('ltth.errorReport', 'lter')
      .where('lt.status != :status', {
        status: TransactionHistoryLogTimeStatusEnum.COMPLETED,
      })
      .orderBy('lt.createdAt', 'DESC');

    // query log time with transaction history with 0 error reports and qc reject quantity = 0
    const query2 = this.transactionHistoryLogTimeRepository
      .createQueryBuilder('lt')
      .select(['lt.id as "id"', 'lt.status as "status"'])
      .innerJoin('lt.transactionHistory', 'ltth')
      .leftJoin('ltth.errorReport', 'lter')
      .having(`COUNT(lter) = 0`)
      .where('lt.status != :status', {
        status: TransactionHistoryLogTimeStatusEnum.COMPLETED,
      })
      .andWhere('ltth.qc_reject_quantity = 0')
      .groupBy('lt.id')
      .addGroupBy('lter.id')
      .orderBy('lt.createdAt', 'DESC');
    if ((await query1.getCount()) > 0) {
      result = await query1.getRawOne();
    } else if ((await query2.getCount()) > 0) {
      result = await query2.getRawOne();
    }
    return result;
  }
}
