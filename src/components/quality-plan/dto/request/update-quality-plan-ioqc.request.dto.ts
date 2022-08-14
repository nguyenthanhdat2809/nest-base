import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsEnum } from 'class-validator';
import { QualityPlanOrderRequestDto } from '@components/quality-plan/dto/request/quality-plan-ioqc.request.dto';

export class UpdateQualityPlanOrderRequestDto extends QualityPlanOrderRequestDto {
  @ApiProperty()
  @IsInt()
  id: number;
}

export class UpdateQualityPlanIOqcByConfirmErrorReportRequestDto {
  @ApiProperty()
  @IsInt()
  type: number;

  @ApiProperty()
  @IsInt()
  orderId: number;

  @ApiProperty()
  @IsInt()
  warehouseId: number;

  @ApiProperty()
  @IsInt()
  itemId: number;

  @ApiProperty()
  @IsInt()
  qcRejectQuantity: number;

  @ApiProperty()
  @IsInt()
  qcPassQuantity: number;
}
