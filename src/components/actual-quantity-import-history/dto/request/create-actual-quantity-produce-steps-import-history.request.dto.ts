import { IS_NOT_EMPTY, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseDto } from '@core/dto/base.dto';
import { STAGES_OPTION } from '@constant/qc-stage.constant';

export class CreateActualQuantityProduceStepsImportHistoryRequestDto extends BaseDto {
  @ApiProperty({ example: 0, description: 'Type 8,9' })
  @Expose()
  @IsNotEmpty()
  @IsEnum([STAGES_OPTION.OUTPUT_PRODUCTION, STAGES_OPTION.INPUT_PRODUCTION])
  qcStageId: number;

  @ApiProperty({ example: 1, description: 'Work order id' })
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @ApiProperty({ example: 1, description: 'SL đã sản xuất' })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  actualQuantity: number;

  @ApiProperty({ example: 1, description: 'Mã lệnh sản xuất' })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  moId: number;

  @ApiProperty({ example: 1, description: 'Item Id' })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  itemId: number;

  @ApiProperty({ example: 1, description: 'Mã công đoạn' })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  producingStepId: number;
}
