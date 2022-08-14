import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ErrorReportIoqcDetailResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  itemName: string;

  @ApiProperty()
  @Expose()
  itemCode: string;

  @ApiProperty()
  @Expose()
  orderCode: string;

  @ApiProperty()
  @Expose()
  orderName: string;

  @ApiProperty()
  @Expose()
  customerName: string;

  @ApiProperty()
  @Expose()
  warehouseName: string;

  @ApiProperty()
  @Expose()
  deliveredAt: Date;
}
