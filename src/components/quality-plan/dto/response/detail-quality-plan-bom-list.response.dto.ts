import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DetailQualityPlanBomListResponseDto {
  @ApiProperty({ example: "10", description: "% Kế hoạch lỗi" })
  @Expose()
  planErrorRate: number;

  @ApiProperty({ example: 12, description: "ID Work Order" })
  @Expose()
  workOrderId: number;
}
