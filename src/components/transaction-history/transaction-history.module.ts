import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionHistoryController } from '@components/transaction-history/transaction-history.controller';
import { TransactionHistoryService } from '@components/transaction-history/transaction-history.service';
import { ProduceModule } from '@components/produce/produce.module';
import { ProduceService } from '@components/produce/produce.service';
import { TransactionHistoryRepository } from '@repositories/transaction-history.repository';
import { TransactionHistory } from '@entities/transaction-history/transaction-history.entity';
import { UserService } from '@components/user/user.service';
import { QualityPointService } from '@components/quality-point/quality-point.service';
import { QualityPointRepository } from '@repositories/quality-point.repository';
import { QualityPointModule } from '@components/quality-point/quality-point.module';
import { CheckListModule } from '@components/check-list/check-list.module';
import { QualityProgressService } from '@components/quality-progress/quality-progress.service';
import { TransactionHistoryLogTimeRepository } from '@repositories/transaction-history-log-time.repository';
import { TransactionHistoryLogTime } from '@entities/transaction-history/transaction-history-log-time.entity';
import { TransactionHistoryLogTimeAddition } from '@entities/transaction-history/transaction-history-log-time-addition.entity';
import { TransactionHistoryLogTimeAdditionRepository } from '@repositories/transaction-history-log-time-addition.repository';
import { ErrorReport } from '@entities/error-report/error-report.entity';
import { ErrorReportErrorDetail } from '@entities/error-report/error-report-error-detail.entity';
import { ErrorReportRepository } from "@repositories/error-report.repository";
import { ActionCategoryService } from "@components/action-category/action-category.service";
import { ActionCategoryModule } from "@components/action-category/action-category.module";
import { QualityPlanModule } from "@components/quality-plan/quality-plan.module";
import { QualityPlanIOqcRepository } from "@repositories/quality-plan-ioqc.repository";
import { QualityPlanIOqc } from "@entities/quality-plan/quality-plan-ioqc.entity";
import { TransactionHistoryProduceStepRepository } from "@repositories/transaction-history-produce-step.repository";
import { ActualQuantityImportHistoryModule } from "@components/actual-quantity-import-history/actual-quantity-import-history.module";
import { ActualQuantityImportHistory } from "@entities/actual-quantity-import-history/actual-quantity-import-history.entity";
import { WorkCenterPlanQcShiftModule } from "@components/work-center-plan-qc-shift/work-center-plan-qc-shift.module";
import { WorkCenterPlanQcShift } from "@entities/work-center-plan-qc-shift/work-center-plan-qc-shift.entity";
import { CheckOwnerPermissionModule } from "@components/check-owner-permission/check-owner-permission.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionHistory,
      TransactionHistoryLogTime,
      TransactionHistoryLogTimeAddition,
      ErrorReport,
      ErrorReportErrorDetail,
      QualityPlanIOqc,
      ActualQuantityImportHistory,
      WorkCenterPlanQcShift,
    ]),
    ProduceModule,
    QualityPointModule,
    CheckListModule,
    ActionCategoryModule,
    ActualQuantityImportHistoryModule,
    QualityPlanModule,
    WorkCenterPlanQcShiftModule,
    CheckOwnerPermissionModule,
  ],
  providers: [
    {
      provide: 'QualityPlanIOqcRepositoryInterface',
      useClass: QualityPlanIOqcRepository,
    },
    {
      provide: 'TransactionHistoryServiceInterface',
      useClass: TransactionHistoryService,
    },
    {
      provide: 'TransactionHistoryRepositoryInterface',
      useClass: TransactionHistoryRepository,
    },
    {
      provide: 'ProduceServiceInterface',
      useClass: ProduceService,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'QualityPointServiceInterface',
      useClass: QualityPointService,
    },
    {
      provide: 'QualityProgressServiceInterface',
      useClass: QualityProgressService,
    },
    {
      provide: 'TransactionHistoryLogTimeRepositoryInterface',
      useClass: TransactionHistoryLogTimeRepository,
    },
    {
      provide: 'TransactionHistoryLogTimeAdditionRepositoryInterface',
      useClass: TransactionHistoryLogTimeAdditionRepository,
    },
    {
      provide: 'TransactionHistoryProduceStepRepositoryInterface',
      useClass: TransactionHistoryProduceStepRepository,
    },
    {
      provide: 'ErrorReportRepositoryInterface',
      useClass: ErrorReportRepository,
    },
    {
      provide: 'ActionCategoryServiceInterface',
      useClass: ActionCategoryService,
    },
  ],
  controllers: [TransactionHistoryController],
  exports: [
    {
      provide: 'QualityPlanIOqcRepositoryInterface',
      useClass: QualityPlanIOqcRepository,
    },
    {
      provide: 'TransactionHistoryServiceInterface',
      useClass: TransactionHistoryService,
    },
    {
      provide: 'ProduceServiceInterface',
      useClass: ProduceService,
    },
    {
      provide: 'TransactionHistoryRepositoryInterface',
      useClass: TransactionHistoryRepository,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'QualityPointServiceInterface',
      useClass: QualityPointService,
    },
    {
      provide: 'QualityProgressServiceInterface',
      useClass: QualityProgressService,
    },
    {
      provide: 'TransactionHistoryLogTimeRepositoryInterface',
      useClass: TransactionHistoryLogTimeRepository,
    },
    {
      provide: 'TransactionHistoryLogTimeAdditionRepositoryInterface',
      useClass: TransactionHistoryLogTimeAdditionRepository,
    },
    {
      provide: 'ErrorReportRepositoryInterface',
      useClass: ErrorReportRepository,
    },
    {
      provide: 'ActionCategoryServiceInterface',
      useClass: ActionCategoryService,
    },
    {
      provide: 'TransactionHistoryProduceStepRepositoryInterface',
      useClass: TransactionHistoryProduceStepRepository,
    },
  ],
})
export class TransactionHistoryModule {}
