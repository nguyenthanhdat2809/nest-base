import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorReport } from '@entities/error-report/error-report.entity';
import { ErrorReportController } from '@components/error-report/error-report.controller';
import { ErrorReportService } from '@components/error-report/error-report.service';
import { ConfigService } from '@config/config.service';
import { ErrorReportRepository } from '@repositories/error-report.repository';
import { ErrorGroupService } from '@components/error-group/error-group.service';
import { ErrorGroupModule } from '@components/error-group/error-group.module';
import { CauseGroupModule } from '@components/cause-group/cause-group.module';
import { CauseGroupService } from '@components/cause-group/cause-group.service';
import { CheckListService } from '@components/check-list/check-list.service';
import { CheckListModule } from '@components/check-list/check-list.module';
import { QualityPointModule } from '@components/quality-point/quality-point.module';
import { QualityPointService } from '@components/quality-point/quality-point.service';
import { ActionCategoryServiceInterface } from '@components/action-category/interface/action-category.service.interface';
import { ActionCategoryService } from '@components/action-category/action-category.service';
import { ActionCategoryModule } from '@components/action-category/action-category.module';
import { ErrorReportErrorDetailRepositoryInterface } from '@components/error-report/interface/error-report-error-detail.repository.interface';
import { ErrorReportErrorDetailRepository } from '@repositories/error-report-error-detail.repository';
import { ErrorReportErrorDetail } from '@entities/error-report/error-report-error-detail.entity';
import { TransactionHistoryService } from '@components/transaction-history/transaction-history.service';
import { TransactionHistoryModule } from '@components/transaction-history/transaction-history.module';
import { ProduceModule } from '@components/produce/produce.module';
import { ProduceService } from '@components/produce/produce.service';
import { QualityPlanModule } from '@components/quality-plan/quality-plan.module';
import { QualityPlanIOqcRepository } from '@repositories/quality-plan-ioqc.repository';
import { QualityPlanIOqc } from '@entities/quality-plan/quality-plan-ioqc.entity';
import { WorkCenterPlanQcShiftModule } from '@components/work-center-plan-qc-shift/work-center-plan-qc-shift.module';
import { CheckOwnerPermissionModule } from '@components/check-owner-permission/check-owner-permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ErrorReport,
      ErrorReportErrorDetail,
      QualityPlanIOqc,
    ]),
    ErrorGroupModule,
    CauseGroupModule,
    CheckListModule,
    QualityPointModule,
    ActionCategoryModule,
    TransactionHistoryModule,
    ProduceModule,
    WorkCenterPlanQcShiftModule,
    QualityPlanModule,
    CheckOwnerPermissionModule,
  ],
  providers: [
    ConfigService,
    {
      provide: 'ErrorReportRepositoryInterface',
      useClass: ErrorReportRepository,
    },
    {
      provide: 'ErrorReportServiceInterface',
      useClass: ErrorReportService,
    },
    {
      provide: 'ErrorGroupServiceInterface',
      useClass: ErrorGroupService,
    },
    {
      provide: 'CauseGroupServiceInterface',
      useClass: CauseGroupService,
    },
    {
      provide: 'CheckListServiceInterface',
      useClass: CheckListService,
    },
    {
      provide: 'QualityPointServiceInterface',
      useClass: QualityPointService,
    },
    {
      provide: 'ActionCategoryServiceInterface',
      useClass: ActionCategoryService,
    },
    {
      provide: 'ErrorReportErrorDetailRepositoryInterface',
      useClass: ErrorReportErrorDetailRepository,
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
      provide: 'QualityPlanIOqcRepositoryInterface',
      useClass: QualityPlanIOqcRepository,
    },
  ],
  controllers: [ErrorReportController],
  exports: [
    {
      provide: 'ErrorReportRepositoryInterface',
      useClass: ErrorReportRepository,
    },
    {
      provide: 'ErrorReportServiceInterface',
      useClass: ErrorReportService,
    },
    {
      provide: 'ErrorGroupServiceInterface',
      useClass: ErrorGroupService,
    },
    {
      provide: 'CauseGroupServiceInterface',
      useClass: CauseGroupService,
    },
    {
      provide: 'CheckListServiceInterface',
      useClass: CheckListService,
    },
    {
      provide: 'QualityPointServiceInterface',
      useClass: QualityPointService,
    },
    {
      provide: 'ActionCategoryServiceInterface',
      useClass: ActionCategoryService,
    },
    {
      provide: 'ErrorReportErrorDetailRepositoryInterface',
      useClass: ErrorReportErrorDetailRepository,
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
      provide: 'QualityPlanIOqcRepositoryInterface',
      useClass: QualityPlanIOqcRepository,
    },
  ],
})
export class ErrorReportModule {}
