import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActualQuantityImportHistory } from '@entities/actual-quantity-import-history/actual-quantity-import-history.entity';
import { ActualQuantityImportHistoryController } from '@components/actual-quantity-import-history/actual-quantity-import-history.controller';
import { ActualQuantityImportHistoryService } from '@components/actual-quantity-import-history/actual-quantity-import-history.service';
import { ActualQuantityImportHistoryRepository } from '@repositories/actual-quantity-import-history.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ActualQuantityImportHistory])],
  providers: [
    {
      provide: 'ActualQuantityImportHistoryRepositoryInterface',
      useClass: ActualQuantityImportHistoryRepository,
    },
    {
      provide: 'ActualQuantityImportHistoryServiceInterface',
      useClass: ActualQuantityImportHistoryService,
    },
  ],
  controllers: [ActualQuantityImportHistoryController],
  exports: [
    {
      provide: 'ActualQuantityImportHistoryRepositoryInterface',
      useClass: ActualQuantityImportHistoryRepository,
    },
    {
      provide: 'ActualQuantityImportHistoryServiceInterface',
      useClass: ActualQuantityImportHistoryService,
    },
  ],
})
export class ActualQuantityImportHistoryModule {}
