import { TypeOrmModule } from '@nestjs/typeorm';
import { QmsxModule } from '@components/qmsx/qmsx.module';
import { QualityPointModule } from '@components/quality-point/quality-point.module';
import { ValidationPipe } from '@core/pipe/validation.pipe';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from '@core/core.module';
import * as connectionOptions from '@config/database.config';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ErrorGroupModule } from '@components/error-group/error-group.module';
import { ItemService } from '@components/item/item.service';
import { ItemController } from '@components/item/item.controller';
import { ItemModule } from '@components/item/item.module';
import { CauseGroupModule } from '@components/cause-group/cause-group.module';
import { CheckListModule } from '@components/check-list/check-list.module';
import { ActionCategoryModule } from '@components/action-category/action-category.module';
import { ErrorReportModule } from '@components/error-report/error-report.module';
import { TransactionHistoryModule } from '@components/transaction-history/transaction-history.module';
import { AlertModule } from '@components/alert/alert.module';
import { SaleModule } from '@components/sale/sale.module';
import { QualityPlanModule } from '@components/quality-plan/quality-plan.module';
import { ReportModule } from '@components/report/report.module';
import { QualityProgressModule } from '@components/quality-progress/quality-progress.module';
import { WorkOrderModule } from '@components/work-order/work-order.module';
import { DashboardModule } from '@components/dashboard/dashboard.module';
import { WorkCenterPlanQcShiftModule } from '@components/work-center-plan-qc-shift/work-center-plan-qc-shift.module';
import { ConfigService } from '@config/config.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AuthorizationGuard } from '@core/guards/authorization.guard';
import { CheckOwnerPermissionModule } from '@components/check-owner-permission/check-owner-permission.module';
import { QueryResolver } from './i18n/query-resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [{ use: QueryResolver, options: ['lang', 'locale', 'l'] }],
    }),
    TypeOrmModule.forRoot(connectionOptions),
    CoreModule,
    ErrorGroupModule,
    QmsxModule,
    QualityPointModule,
    ItemModule,
    CauseGroupModule,
    CheckListModule,
    ActionCategoryModule,
    ErrorReportModule,
    TransactionHistoryModule,
    AlertModule,
    SaleModule,
    QualityPlanModule,
    ReportModule,
    QualityProgressModule,
    WorkOrderModule,
    DashboardModule,
    ItemController,
    WorkCenterPlanQcShiftModule,
    CheckOwnerPermissionModule,
  ],
  controllers: [AppController, ItemController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    ConfigService,
    {
      provide: 'USER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const userServiceOptions = configService.get('userService');
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigService],
    },
    AppService,
    ItemService,
  ],
})
export class AppModule {}
