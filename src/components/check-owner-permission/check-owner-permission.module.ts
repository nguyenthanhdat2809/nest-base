import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CheckOwnerPermissionService } from "@components/check-owner-permission/check-owner-permission.service";
import { UserModule } from "@components/user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature(), UserModule],
  providers: [
    {
      provide: 'CheckOwnerPermissionServiceInterface',
      useClass: CheckOwnerPermissionService,
    },
  ],
  controllers: [],
  exports: [
    {
      provide: 'CheckOwnerPermissionServiceInterface',
      useClass: CheckOwnerPermissionService,
    },
  ],
})
export class CheckOwnerPermissionModule {}
