import { Module } from '@nestjs/common';
import { QualityPointController } from '@components/quality-point/quality-point.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QualityPoint } from '@entities/quality-point/quality-point.entity';
import { QualityPointRepository } from '@repositories/quality-point.repository';
import { QualityPointService } from '@components/quality-point/quality-point.service';
import { UserService } from '@components/user/user.service';
import { ProduceService } from '@components/produce/produce.service';
import { UserModule } from '@components/user/user.module';
import { ProduceModule } from '@components/produce/produce.module';
import { CheckListModule } from '@components/check-list/check-list.module';
import { CheckOwnerPermissionModule } from '@components/check-owner-permission/check-owner-permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QualityPoint]),
    UserModule,
    ProduceModule,
    CheckListModule,
    CheckOwnerPermissionModule,
  ],
  providers: [
    {
      provide: 'QualityPointRepositoryInterface',
      useClass: QualityPointRepository,
    },
    {
      provide: 'QualityPointServiceInterface',
      useClass: QualityPointService,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'ProduceServiceInterface',
      useClass: ProduceService,
    },
  ],
  controllers: [QualityPointController],
  exports: [
    {
      provide: 'QualityPointServiceInterface',
      useClass: QualityPointService,
    },
    {
      provide: 'QualityPointRepositoryInterface',
      useClass: QualityPointRepository,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'ProduceServiceInterface',
      useClass: ProduceService,
    },
  ],
})
export class QualityPointModule {}
