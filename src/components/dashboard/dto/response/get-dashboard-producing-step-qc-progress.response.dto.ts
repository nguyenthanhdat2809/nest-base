import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class GetDashboardProducingStepQcProgressResponseDto {
  @ApiProperty({ example: '30/10', description: 'Ngày' })
  @Expose()
  date: string;
  @ApiProperty({ example: 100, description: 'Số lượng KH QC' })
  @Expose()
  planQuantity: number;
  @ApiProperty({ example: 100, description: 'Số lượng đã SX' })
  @Expose()
  producedQuantity: number;
  @ApiProperty({ example: 100, description: 'Số lượng đã QC' })
  @Expose()
  totalQcQuantity: number;
  @ApiProperty({ example: 100, description: 'Số lượng lỗi' })
  @Expose()
  qcRejectQuantity: number;
  @ApiProperty({ example: 100, description: 'Số lượng đạt' })
  @Expose()
  qcPassQuantity: number;
  @ApiProperty({ example: 100, description: 'Số lượng cần QC' })
  @Expose()
  qcQuantity: number;
  @ApiProperty({ example: 100, description: 'Số lượng lỗi còn lại' })
  @Expose()
  needToBeRepair: number;
}
