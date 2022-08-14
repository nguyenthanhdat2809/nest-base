import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray
} from 'class-validator';
import { STAGES_OPTION } from '@constant/qc-stage.constant';

export class ActualQuantityImportHistoryRequestDto {
  @ApiProperty({ example: 0, description: 'Type 0, 2, 3, 5' })
  @IsNotEmpty()
  @IsEnum([
    STAGES_OPTION.PO_IMPORT,
    STAGES_OPTION.PRO_IMPORT,
    STAGES_OPTION.PRO_EXPORT,
    STAGES_OPTION.SO_EXPORT,
  ])
  qcStageId: number;

  @ApiProperty({ example: 1, description: "ID Lệnh" })
  @IsInt()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty({ example: 1, description: "ID Kho" })
  @IsInt()
  @IsNotEmpty()
  warehouseId: number;

  @ApiProperty({ example: 1, description: "ID Sản Phẩm" })
  @IsInt()
  @IsNotEmpty()
  itemId: number;

  @ApiProperty({ example: 1, description: "Số lượng sản phẩm nhập" })
  @IsNumber()
  @IsNotEmpty()
  actualQuantity: number;
}
