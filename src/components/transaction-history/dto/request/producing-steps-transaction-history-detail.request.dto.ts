import { IsInt, IsNotEmpty } from 'class-validator';

export class ProducingStepsTransactionHistoryDetailRequestDto {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
