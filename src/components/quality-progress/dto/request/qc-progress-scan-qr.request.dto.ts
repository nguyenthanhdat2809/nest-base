import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString, Min, IsOptional } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { ItemBarcodeTypeEnum } from '@components/item/item.constant';
import { Type } from 'class-transformer';
import { STAGES_OPTION } from '@constant/qc-stage.constant';

export class QcProgressScanQrRequestDto extends BaseDto {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  orderId: number;

  @ApiProperty({
    example: 'I600',
    description: 'Mã QR code của item',
  })
  @IsNotEmpty()
  @IsString()
  qrCode: string;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  warehouseId: number;

  @ApiProperty()
  @IsOptional()
  user: any;

  type: ItemBarcodeTypeEnum;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  qcStageId: number;
  
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
