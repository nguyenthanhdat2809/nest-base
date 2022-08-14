import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsNumber,
  ValidateNested,
  IsArray,
  IsInt,
  IsEnum
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from '@core/dto/base.dto';
import { ALERT_DB } from '@components/alert/alert.constant';
import { STAGES_OPTION } from '@constant/qc-stage.constant';
import { ProductTypeAlert } from '@entities/alert/alert.entity';

export class AlertRequestDto extends BaseDto {
  @ApiProperty({ example: '00001', description: 'Mã thông báo', })
  @IsString()
  @IsNotEmpty()
  @MaxLength(ALERT_DB.CODE.MAX_LENGTH)
  code: string;

  @ApiProperty({ example: 'Thông báo 1', description: 'Tên thông báo', })
  @IsString()
  @IsNotEmpty()
  @MaxLength(ALERT_DB.NAME.MAX_LENGTH)
  name: string;

  @ApiProperty({ example: 'Mô tả', description: 'Mô tả', })
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(ALERT_DB.DESCRIPTION.MAX_LENGTH)
  description: string;

  @ApiProperty({ example: 0, description: 'QC công đoạn Type 0, 2, 3, 5, 8, 9' })
  @IsNotEmpty()
  @IsEnum([
    STAGES_OPTION.PO_IMPORT,
    STAGES_OPTION.PRO_IMPORT,
    STAGES_OPTION.PRO_EXPORT,
    STAGES_OPTION.SO_EXPORT,
    STAGES_OPTION.OUTPUT_PRODUCTION,
    STAGES_OPTION.INPUT_PRODUCTION,
  ])
  stage: number;

  @ApiProperty({ example: 1, description: 'Tên sản phẩm', })
  @IsNumber()
  @IsNotEmpty()
  itemId: number;

  @ApiProperty({ example: 1, description: 'QC công đoạn sản xuất', })
  @IsNumber()
  @IsNotEmpty()
  typeAlert: number;

  @ApiProperty({ example: 1, description: 'Lệnh sản xuất', })
  @IsOptional()
  manufacturingOrderId: number;

  @ApiProperty({ example: 1, description: 'Tên quy trình', })
  @IsOptional()
  routingId: number;

  @ApiProperty({ example: 1, description: 'Công đoạn sản xuất', })
  @IsOptional()
  producingStepId: number;

  @ApiProperty({ example: 1, description: 'Mã lênh', })
  @IsOptional()
  purchasedOrderId: number;

  @ApiProperty({ example: 1, description: 'Tên kho', })
  @IsOptional()
  warehouseId: number;

  @ApiProperty({ example: 1, description: 'Phiếu báo cáo lỗi', })
  @IsOptional()
  errorReportId: number;

  @ApiProperty({
    example: [
      {
        userId: 1,
      },
      {
        userId: 2,
      },
    ],
    description: 'Bên liên quan',
  })
  @IsOptional()
  @ValidateNested()
  @IsArray()
  @Type(() => AlertRelatedUser)
  alertRelatedUsers: AlertRelatedUser[];

  @ApiProperty({ example: 1, description: 'Loại sản phẩm' })
  @IsOptional()
  @IsEnum(ProductTypeAlert)
  productType: number;
}

class AlertRelatedUser {
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
