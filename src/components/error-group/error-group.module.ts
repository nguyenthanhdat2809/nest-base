import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorGroup } from '@entities/error-group/error-group.entity';
import { ErrorGroupController } from '@components/error-group/error-group.controller';
import { ErrorGroupRepository } from '@repositories/error-group.repository';
import { ErrorGroupService } from '@components/error-group/error-group.service';
import { ConfigService } from '@config/config.service';
import { CheckListDetail } from '@entities/check-list/check-list-detail.entity';
import { CheckListDetailRepository } from '@repositories/check-list-detail.repository';
import { CheckOwnerPermissionModule } from '@components/check-owner-permission/check-owner-permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ErrorGroup, CheckListDetail]),
    CheckOwnerPermissionModule,
  ],
  providers: [
    ConfigService,
    {
      provide: 'ErrorGroupRepositoryInterface',
      useClass: ErrorGroupRepository,
    },
    {
      provide: 'ErrorGroupServiceInterface',
      useClass: ErrorGroupService,
    },
    {
      provide: 'CheckListDetailRepositoryInterface',
      useClass: CheckListDetailRepository,
    },
  ],
  controllers: [ErrorGroupController],
  exports: [
    {
      provide: 'ErrorGroupRepositoryInterface',
      useClass: ErrorGroupRepository,
    },
    {
      provide: 'ErrorGroupServiceInterface',
      useClass: ErrorGroupService,
    },
    {
      provide: 'CheckListDetailRepositoryInterface',
      useClass: CheckListDetailRepository,
    },
  ],
})
export class ErrorGroupModule {}
