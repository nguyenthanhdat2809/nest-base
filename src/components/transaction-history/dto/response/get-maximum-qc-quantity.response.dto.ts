import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class GetMaximumQcQuantityResponseDto {
  @ApiProperty()
  @Expose()
  orderId: number;
  @ApiProperty()
  @Expose()
  type: number;
  @ApiProperty()
  @Expose()
  totalUnQcQuantity: number;
  @ApiProperty()
  @Expose()
  maximumQcQuantity: number;
}