import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  TransactionHistoryItemTypeEnum,
  TransactionHistoryTypeEnum,
} from '@components/transaction-history/transaction-history.constant';
import { BaseCheckListDetailRequestDto } from '@components/transaction-history/dto/request/base-check-list-detail.request.dto';

class CheckListDetail extends BaseCheckListDetailRequestDto {}

export class CreateProducingStepsTransactionHistoryRequestDto extends BaseDto {
  @ApiProperty({ example: 2, description: 'QC 2 lần or 1 lần' })
  @IsNotEmpty()
  @IsInt()
  numberOfTime: number;

  @ApiProperty({ example: 1, description: 'Lần QC thứ 1 or 2' })
  @IsNotEmpty()
  @IsInt()
  numberOfTimeQc: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  orderId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  createdByUserId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  qcPassQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  qcRejectQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  qcQuantity: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  note: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  itemId: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  warehouseId: number;

  @ApiProperty()
  @Type(() => CheckListDetail)
  @IsArray()
  @ValidateNested()
  checkListDetails: CheckListDetail[];

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  workCenterId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  logTimeId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TransactionHistoryTypeEnum)
  type: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  totalPlanQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  producedQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  totalUnQcQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  totalQcRejectQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  totalQcPassQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  totalQcQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  lotNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  qcQuantityRule: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  qualityPointId: number;

  @IsNotEmpty()
  user: any;
}
