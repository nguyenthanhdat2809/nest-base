import { WorkOrderService } from '@components/work-order/work-order.service';
import { WorkOrderController } from '@components/work-order/work-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProduceService } from '@components/produce/produce.service';
import { ProduceModule } from '@components/produce/produce.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([]), ProduceModule],
  providers: [
    {
      provide: 'WorkOrderServiceInterface',
      useClass: WorkOrderService,
    },
    {
      provide: 'ProduceServiceInterface',
      useClass: ProduceService,
    },
  ],
  controllers: [WorkOrderController],
})
export class WorkOrderModule {}
