import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CauseGroup } from '@entities/cause-group/cause-group.entity';
import { CauseGroupController } from '@components/cause-group/cause-group.controller';
import { CauseGroupService } from '@components/cause-group/cause-group.service';
import { CauseGroupRepository } from '@repositories/cause-group.repository';
import { ErrorReportErrorDetail } from '@entities/error-report/error-report-error-detail.entity';
import { ErrorReportErrorDetailRepository } from '@repositories/error-report-error-detail.repository';
import { CheckOwnerPermissionModule } from "@components/check-owner-permission/check-owner-permission.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([CauseGroup, ErrorReportErrorDetail]),
    CheckOwnerPermissionModule,
  ],
  providers: [
    {
      provide: 'CauseGroupRepositoryInterface',
      useClass: CauseGroupRepository,
    },
    {
      provide: 'CauseGroupServiceInterface',
      useClass: CauseGroupService,
    },
    {
      provide: 'ErrorReportErrorDetailRepositoryInterface',
      useClass: ErrorReportErrorDetailRepository,
    },
  ],
  controllers: [CauseGroupController],
  exports: [
    {
      provide: 'CauseGroupRepositoryInterface',
      useClass: CauseGroupRepository,
    },
    {
      provide: 'CauseGroupServiceInterface',
      useClass: CauseGroupService,
    },
    {
      provide: 'ErrorReportErrorDetailRepositoryInterface',
      useClass: ErrorReportErrorDetailRepository,
    },
  ],
})
export class CauseGroupModule {}
