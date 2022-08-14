import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkCenterPlanQcShift } from '@entities/work-center-plan-qc-shift/work-center-plan-qc-shift.entity';
import { WorkCenterPlanQcShiftController } from '@components/work-center-plan-qc-shift/work-center-plan-qc-shift.controller';
import { WorkCenterPlanQcShiftService } from '@components/work-center-plan-qc-shift/work-center-plan-qc-shift.service';
import { WorkCenterPlanQcShiftRepository } from '@repositories/work-center-plan-qc-shift.repository';
import { QualityPlanBomRepository } from '@repositories/quality-plan-bom.repository';
import { QualityPlanBom } from '@entities/quality-plan/quality-plan-bom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkCenterPlanQcShift, QualityPlanBom])],
  providers: [
    {
      provide: 'WorkCenterPlanQcShiftRepositoryInterface',
      useClass: WorkCenterPlanQcShiftRepository,
    },
    {
      provide: 'WorkCenterPlanQcShiftServiceInterface',
      useClass: WorkCenterPlanQcShiftService,
    },
    {
      provide: 'QualityPlanBomRepositoryInterface',
      useClass: QualityPlanBomRepository,
    },
  ],
  controllers: [WorkCenterPlanQcShiftController],
  exports: [
    {
      provide: 'WorkCenterPlanQcShiftRepositoryInterface',
      useClass: WorkCenterPlanQcShiftRepository,
    },
    {
      provide: 'WorkCenterPlanQcShiftServiceInterface',
      useClass: WorkCenterPlanQcShiftService,
    },
    {
      provide: 'QualityPlanBomRepositoryInterface',
      useClass: QualityPlanBomRepository,
    },
  ],
})
export class WorkCenterPlanQcShiftModule {}
