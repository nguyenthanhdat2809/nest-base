import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QualityPlan } from '@entities/quality-plan/quality-plan.entity';
import { QualityPlanController } from '@components/quality-plan/quality-plan.controller';
import { QualityPlanService } from '@components/quality-plan/quality-plan.service';
import { ConfigService } from '@config/config.service';
import { QualityPlanRepository } from '@repositories/quality-plan.repository';
import { QualityPointModule } from '@components/quality-point/quality-point.module';
import { ErrorReport } from '@entities/error-report/error-report.entity';
import { QualityPlanIOqc } from '@entities/quality-plan/quality-plan-ioqc.entity';
import { QualityPlanIOqcDetail } from '@entities/quality-plan/quality-plan-ioqc-detail.entity';
import { QualityPlanBom } from '@entities/quality-plan/quality-plan-bom.entity';
import { QualityPlanIOqcRepository } from '@repositories/quality-plan-ioqc.repository';
import { QualityPlanIOqcDetailRepository } from '@repositories/quality-plan-ioqc-detail.repository';
import { QualityPlanBomRepository } from '@repositories/quality-plan-bom.repository';
import { ErrorReportRepository } from '@repositories/error-report.repository';
import { WorkCenterPlanQcShiftModule } from '@components/work-center-plan-qc-shift/work-center-plan-qc-shift.module';
import { ActualQuantityImportHistoryModule } from '@components/actual-quantity-import-history/actual-quantity-import-history.module';
import { CheckOwnerPermissionModule } from "@components/check-owner-permission/check-owner-permission.module";

@Module({
  imports: [TypeOrmModule.forFeature([
      QualityPlan,
      QualityPlanIOqc,
      QualityPlanIOqcDetail,
      ErrorReport,
      QualityPlanBom
    ]),
    QualityPointModule,
    WorkCenterPlanQcShiftModule,
    ActualQuantityImportHistoryModule,
    CheckOwnerPermissionModule,
  ],
  providers: [
    ConfigService,
    {
      provide: 'ErrorReportRepositoryInterface',
      useClass: ErrorReportRepository,
    },
    {
      provide: 'QualityPlanIOqcRepositoryInterface',
      useClass: QualityPlanIOqcRepository,
    },
    {
      provide: 'QualityPlanIOqcDetailRepositoryInterface',
      useClass: QualityPlanIOqcDetailRepository,
    },
    {
      provide: 'QualityPlanBomRepositoryInterface',
      useClass: QualityPlanBomRepository,
    },
    {
      provide: 'QualityPlanRepositoryInterface',
      useClass: QualityPlanRepository,
    },
    {
      provide: 'QualityPlanServiceInterface',
      useClass: QualityPlanService,
    }
  ],
  controllers: [QualityPlanController],
  exports: [
    {
      provide: 'ErrorReportRepositoryInterface',
      useClass: ErrorReportRepository,
    },
    {
      provide: 'QualityPlanIOqcRepositoryInterface',
      useClass: QualityPlanIOqcRepository,
    },
    {
      provide: 'QualityPlanIOqcDetailRepositoryInterface',
      useClass: QualityPlanIOqcDetailRepository,
    },
    {
      provide: 'QualityPlanBomRepositoryInterface',
      useClass: QualityPlanBomRepository,
    },
    {
      provide: 'QualityPlanRepositoryInterface',
      useClass: QualityPlanRepository,
    },
    {
      provide: 'QualityPlanServiceInterface',
      useClass: QualityPlanService,
    },
  ],
})
export class QualityPlanModule {}
