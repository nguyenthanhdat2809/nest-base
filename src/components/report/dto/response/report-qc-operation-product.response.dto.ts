import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReportQcOperationProductResponseDto {
  @ApiProperty({ example: 1, description: 'Id Lệnh Làm Việc' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Lệnh Sản Xuất 1', description: 'Lệnh sản xuất' })
  @Expose()
  moName: string;

  @ApiProperty({ example: 'Ghế Văn Phòng', description: 'Tên Sản Phẩm' })
  @Expose()
  itemName: string;

  @ApiProperty({ example: 'Chế Biến Gỗ', description: 'Tên Qui Trình' })
  @Expose()
  routingName: string;

  @ApiProperty({ example: 'Sấy Gỗ', description: 'Tên Công Đoạn' })
  @Expose()
  producingStepName: string;

  @ApiProperty({ example: 100, description: 'Số Lượng Sản Phẩm Theo Kế Hoạch' })
  @Expose()
  quantity: number;

  @ApiProperty({ example: 80, description: 'Số Lượng Sản Phẩm Đã Sản Xuất' })
  @Expose()
  actualQuantity: number;

  @ApiProperty({ example: 50, description: 'Số Lượng Sản Phẩm Cần QC' })
  @Expose()
  totalUnQcQuantity: number;

  @ApiProperty({ example: 30, description: 'Số Lượng Sản Phẩm Đã QC' })
  @Expose()
  totalQcQuantity: number;

  @ApiProperty({ example: 10, description: 'Số Lượng Sản Phẩm Đã QC Mà Bị Lỗi' })
  @Expose()
  errorQuantity: number;

  @ApiProperty({ example: 10, description: 'Số Lượng Sản Phẩm Lỗi Còn Lại' })
  @Expose()
  totalQcRejectQuantity: number;

  @ApiProperty({ example: 10, description: 'Id Phiếu Báo Cáo Lỗi' })
  @Expose()
  errorReportId: any;
}
