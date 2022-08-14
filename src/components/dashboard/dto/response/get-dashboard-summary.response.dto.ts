import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetDashboardSummaryResponseDto {
  @ApiProperty({ example: 1, description: 'Tổng SL KH QC đầu vào' })
  @Expose()
  totalInputQcPlanQuantity: number;
  @ApiProperty({ example: 1, description: 'Tổng SL KH QC đầu ra' })
  @Expose()
  totalOutputQcPlanQuantity: number;
  @ApiProperty({ example: 1, description: 'Tổng SL KH QC công đoạn' })
  @Expose()
  totalProduceQcPlanQuantity: number;
}
