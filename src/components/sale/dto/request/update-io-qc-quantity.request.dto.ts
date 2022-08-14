import { BaseDto } from '@core/dto/base.dto';
import { IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateIOQcQuantityRequestDto extends BaseDto {
  @IsOptional()
  @IsInt()
  id: number;

  @IsOptional()
  @IsInt()
  saleOrderExportId: number;

  @IsOptional()
  @IsInt()
  purchasedOrderId: number;

  @IsOptional()
  @IsInt()
  productionOrderId: number;

  @IsOptional()
  @IsNumber()
  warehouseId: number;

  @IsOptional()
  @IsNumber()
  itemId: number;

  @IsOptional()
  @IsNumber()
  qcPassQuantity: number;

  @IsOptional()
  @IsNumber()
  qcRejectQuantity: number;

  @IsOptional()
  @IsNumber()
  lotNumber: string;

  @IsOptional()
  lotDate: Date;

  @IsOptional()
  @IsNumber()
  userId: number;
}
