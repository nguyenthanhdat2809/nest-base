import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ListReportIOqcResponseDto {
  @ApiProperty({ example: 1, description: 'Id Lệnh' })
  @Expose()
  id: number;

  @ApiProperty({ example: 0, description: 'Id Công đoạn QC' })
  @Expose()
  qcStageId: number;

  @ApiProperty({ example: 'PO SO PRO', description: 'Công đoạn QC' })
  @Expose()
  stageName: string;

  @ApiProperty({ example: '0001', description: 'Mã lệnh' })
  @Expose()
  orderCode: string;

  @ApiProperty({ example: 'ABC', description: 'Tên lệnh' })
  @Expose()
  orderName: string;

  @ApiProperty({ example: '0001', description: 'Mã Sản Phẩm' })
  @Expose()
  itemCode: string;

  @ApiProperty({ example: 'Cái ghế', description: 'Tên Sản Phẩm' })
  @Expose()
  itemName: string;

  @ApiProperty({ example: 100, description: 'Số Lượng Sản Phẩm Theo Kế Hoạch' })
  @Expose()
  planQuantity: number;

  @ApiProperty({ example: 80, description: 'Số Lượng Sản Phẩm Đã Sản Xuất | Nhập' })
  @Expose()
  actualQuantity: number;

  @ApiProperty({ example: 80, description: 'Số Lượng Cần QC' })
  @Expose()
  needQCQuantity: number;

  @ApiProperty({ example: 80, description: 'Số Lượng Cần QC' })
  @Expose()
  doneQCQuantity: number;

  @ApiProperty({ example: 50, description: 'Tổng Số Lượng Lỗi' })
  @Expose()
  errorQuantity: number;

  @ApiProperty({ example: 10, description: 'Id Phiếu Báo Cáo Lỗi' })
  @Expose()
  errorReportId: any;
}
