import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from '@config/config.service';
import { SaleService } from './sale.service';

@Global()
@Module({
  imports: [ConfigModule],
  exports: [
    'SALE_SERVICE_CLIENT',
    {
      provide: 'SaleServiceInterface',
      useClass: SaleService,
    },
  ],
  providers: [
    ConfigService,
    {
      provide: 'SALE_SERVICE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const saleServiceOptions = configService.get('saleService');
        return ClientProxyFactory.create(saleServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'SaleServiceInterface',
      useClass: SaleService,
    },
  ],
  controllers: [],
})
export class SaleModule {}
