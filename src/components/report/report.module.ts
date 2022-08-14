import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from '@components/report/report.controller';
import { ReportService } from '@components/report/report.service';
import { ErrorReportModule } from '@components/error-report/error-report.module';
import { QualityPlanModule } from '@components/quality-plan/quality-plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    ErrorReportModule,
    QualityPlanModule,
  ],
  providers: [
    {
      provide: 'ReportServiceInterface',
      useClass: ReportService,
    },
  ],
  controllers: [ReportController],
  exports: [
    {
      provide: 'ReportServiceInterface',
      useClass: ReportService,
    },
  ],
})
export class ReportModule {}
