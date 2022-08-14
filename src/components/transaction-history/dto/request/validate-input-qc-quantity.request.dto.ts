import { IsInt, IsNotEmpty, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { BaseCheckListDetailRequestDto } from "@components/transaction-history/dto/request/base-check-list-detail.request.dto";

export class ValidateInputQcQuantityRequestDto {
  @IsNumber()
  @IsNotEmpty()
  qcQuantity: number;
  @IsNumber()
  @IsNotEmpty()
  totalUnQcQuantity: number;
  @IsNumber()
  @IsNotEmpty()
  qcRejectQuantity: number;
  @IsNumber()
  @IsNotEmpty()
  qcPassQuantity: number;
  @IsNotEmpty()
  @Type(() => BaseCheckListDetailRequestDto)
  checkListDetails: BaseCheckListDetailRequestDto[];
}