import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DashboardService } from "@components/dashboard/dashboard.service";
import { DashboardController } from "@components/dashboard/dashboard.controller";
import { TransactionHistoryModule } from "@components/transaction-history/transaction-history.module";
import { QualityPlanModule } from "@components/quality-plan/quality-plan.module";
import { ActualQuantityImportHistoryModule } from "@components/actual-quantity-import-history/actual-quantity-import-history.module";
import { ErrorReportModule } from '@components/error-report/error-report.module';
import { ErrorGroupModule } from '@components/error-group/error-group.module';
import { CauseGroupModule } from '@components/cause-group/cause-group.module';
import { ActionCategoryModule } from '@components/action-category/action-category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(),
    TransactionHistoryModule,
    QualityPlanModule,
    ActualQuantityImportHistoryModule,
    ErrorReportModule,
    ErrorGroupModule,
    CauseGroupModule,
    ActionCategoryModule,
  ],
  providers: [
    {
      provide: 'DashboardServiceInterface',
      useClass: DashboardService,
    },
  ],
  controllers: [DashboardController],
  exports: [
    {
      provide: 'DashboardServiceInterface',
      useClass: DashboardService,
    },
  ],
})
export class DashboardModule {}
