import { BaseDto } from '@core/dto/base.dto';
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWOQcQuantityRequestDto extends BaseDto {
  @IsNotEmpty()
  @IsInt()
  workOrderId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  passQuantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rejectQuantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  createdByUserId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  note: string;

  @IsNotEmpty()
  @IsInt()
  workCenterId: number;

  @IsNotEmpty()
  @IsDateString()
  executionDay: Date;
}
