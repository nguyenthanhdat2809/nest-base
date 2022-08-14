import { CreateProducingStepsTransactionHistoryRequestDto } from "@components/transaction-history/dto/request/create-producing-steps-transaction-history-request.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { TransactionHistoryItemTypeEnum } from "@components/transaction-history/transaction-history.constant";

export class CreateInputProducingStepsTransactionHistoryRequestDto extends CreateProducingStepsTransactionHistoryRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  totalImportQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  itemId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TransactionHistoryItemTypeEnum)
  itemType: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  previousBomId: number;
}
