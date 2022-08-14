import { IsInt, Min } from 'class-validator';

export class ErrorReportIoqcDetailRequestDto {
  @IsInt()
  @Min(1)
  errorReportId: number;

  @IsInt()
  @Min(1)
  itemId: number;

  @IsInt()
  @Min(1)
  customerId: number;

  @IsInt()
  @Min(1)
  orderId: number;

  @IsInt()
  @Min(1)
  warehouseId: number;
}
