import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetDashboardIoQcProgressResponseDto {
  @ApiProperty({
    example: '30/12/2021',
    description: 'Ngày thực hiện theo plan',
  })
  @Expose()
  date: Date;
  @ApiProperty({ example: 1000, description: 'Số lượng KH' })
  @Expose()
  qcPlanQuantity: number;
  @ApiProperty({ example: 1000, description: 'Số lượng nhập' })
  @Expose()
  importQuantity: number;
  @ApiProperty({ example: 1000, description: 'Số lượng lỗi' })
  @Expose()
  qcRejectQuantity: number;
  @ApiProperty({ example: 1000, description: 'Số lượng đạt' })
  @Expose()
  qcPassQuantity: number;
  @ApiProperty({ example: 1000, description: 'Số lượng đã QC' })
  @Expose()
  qcQuantity: number;
  @ApiProperty({ example: 1000, description: 'Số lượng cần QC' })
  @Expose()
  qcNeedQuantity: number;
}
