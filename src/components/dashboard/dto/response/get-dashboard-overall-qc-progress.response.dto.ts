import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetDashboardOverallQcProgressResponseDto {
  @ApiProperty({ example: '01/01/2021', description: 'Ngày' })
  @Expose()
  date: Date;
  @ApiProperty({ example: 1, description: 'SL đã QC' })
  @Expose()
  qcQuantity: number;
  @ApiProperty({ example: 1, description: 'SL đạt' })
  @Expose()
  qcPassQuantity: number;
  @ApiProperty({ example: 1, description: 'SL cần QC' })
  @Expose()
  qcNeedQuantity: number;
  @ApiProperty({ example: 1, description: 'SL kế hoạch QC' })
  @Expose()
  qcPlanQuantity: number;
}
