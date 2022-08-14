import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckList } from '@entities/check-list/check-list.entity';
import { CheckListService } from '@components/check-list/check-list.service';
import { CheckListController } from '@components/check-list/check-list.controller';
import { CheckListRepository } from '@repositories/check-list.repository';
import { ErrorGroupModule } from '@components/error-group/error-group.module';
import { CheckListDetailRepository } from '@repositories/check-list-detail.repository';
import { CheckListDetail } from '@entities/check-list/check-list-detail.entity';
import { ItemService } from '@components/item/item.service';
import { CheckOwnerPermissionModule } from "@components/check-owner-permission/check-owner-permission.module";

@Module({
  imports: [TypeOrmModule.forFeature([
      CheckList,
      CheckListDetail,
    ]),
    ErrorGroupModule,
    CheckOwnerPermissionModule,
  ],
  providers: [
    {
      provide: 'CheckListRepositoryInterface',
      useClass: CheckListRepository,
    },
    {
      provide: 'CheckListServiceInterface',
      useClass: CheckListService,
    },
    {
      provide: 'CheckListDetailRepositoryInterface',
      useClass: CheckListDetailRepository,
    },
    {
      provide: 'ItemServiceInterface',
      useClass: ItemService,
    },
  ],
  controllers: [CheckListController],
  exports: [
    {
      provide: 'CheckListServiceInterface',
      useClass: CheckListService,
    },
    {
      provide: 'CheckListRepositoryInterface',
      useClass: CheckListRepository,
    },
    {
      provide: 'CheckListDetailRepositoryInterface',
      useClass: CheckListDetailRepository,
    },
    {
      provide: 'ItemServiceInterface',
      useClass: ItemService,
    },
  ],
})
export class CheckListModule {};
