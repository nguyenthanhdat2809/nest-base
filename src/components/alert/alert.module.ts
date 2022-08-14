import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from '@entities/alert/alert.entity';
import { AlertController } from '@components/alert/alert.controller';
import { AlertService } from '@components/alert/alert.service';
import { AlertRepository } from '@repositories/alert.repository';
import { ErrorReportModule } from '@components/error-report/error-report.module';
import { CheckOwnerPermissionModule } from "@components/check-owner-permission/check-owner-permission.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Alert]),
    ErrorReportModule,
    CheckOwnerPermissionModule,
  ],
  providers: [
    {
      provide: 'AlertRepositoryInterface',
      useClass: AlertRepository,
    },
    {
      provide: 'AlertServiceInterface',
      useClass: AlertService,
    },
  ],
  controllers: [AlertController],
  exports: [
    {
      provide: 'AlertRepositoryInterface',
      useClass: AlertRepository,
    },
    {
      provide: 'AlertServiceInterface',
      useClass: AlertService,
    },
  ],
})
export class AlertModule {}
