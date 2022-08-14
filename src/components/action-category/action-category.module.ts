import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionCategory } from '@entities/action-category/action-category.entity';
import { ActionCategoryController } from '@components/action-category/action-category.controller';
import { ActionCategoryService } from '@components/action-category/action-category.service';
import { ActionCategoryRepository } from '@repositories/action-category.repository';
import { CheckOwnerPermissionModule } from '@components/check-owner-permission/check-owner-permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActionCategory]),
    CheckOwnerPermissionModule,
  ],
  providers: [
    {
      provide: 'ActionCategoryRepositoryInterface',
      useClass: ActionCategoryRepository,
    },
    {
      provide: 'ActionCategoryServiceInterface',
      useClass: ActionCategoryService,
    },
  ],
  controllers: [ActionCategoryController],
  exports: [
    {
      provide: 'ActionCategoryRepositoryInterface',
      useClass: ActionCategoryRepository,
    },
    {
      provide: 'ActionCategoryServiceInterface',
      useClass: ActionCategoryService,
    },
  ],
})
export class ActionCategoryModule {}
