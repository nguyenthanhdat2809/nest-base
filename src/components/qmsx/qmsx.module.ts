import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QmsxController } from '@components/qmsx/qmsx.controller';
import { ErrorGroupModule } from '@components/error-group/error-group.module';
import { QmsxService } from '@components/qmsx/qmsx.service';

@Module({
  imports: [TypeOrmModule.forFeature([]), ErrorGroupModule],
  providers: [
    {
      provide: 'QmsxServiceInterface',
      useClass: QmsxService,
    },
  ],
  controllers: [QmsxController],
  exports: [
    {
      provide: 'QmsxServiceInterface',
      useClass: QmsxService,
    },
  ],
})
export class QmsxModule {}
