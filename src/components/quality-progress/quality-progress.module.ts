import { Module } from '@nestjs/common';
import { UserService } from '@components/user/user.service';
import { ProduceService } from '@components/produce/produce.service';
import { UserModule } from '@components/user/user.module';
import { ProduceModule } from '@components/produce/produce.module';
import { QualityProgressController } from '@components/quality-progress/quality-progress.controller';
import { QualityProgressService } from '@components/quality-progress/quality-progress.service';
import { TransactionHistoryModule } from '@components/transaction-history/transaction-history.module';
import { CheckListModule } from '@components/check-list/check-list.module';
import { QualityPlanIOqcRepository } from "@repositories/quality-plan-ioqc.repository";
import { QualityPlanModule } from "@components/quality-plan/quality-plan.module";
import { QualityPointModule } from "@components/quality-point/quality-point.module";

@Module({
  imports: [
    UserModule,
    ProduceModule,
    TransactionHistoryModule,
    CheckListModule,
    QualityPlanModule,
    QualityPointModule,
  ],
  providers: [
    {
      provide: 'QualityProgressServiceInterface',
      useClass: QualityProgressService,
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
  controllers: [QualityProgressController],
  exports: [
    {
      provide: 'QualityProgressServiceInterface',
      useClass: QualityProgressService,
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
export class QualityProgressModule {}
