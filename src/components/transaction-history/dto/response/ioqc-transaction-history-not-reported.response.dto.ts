import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ErrorReportResponseDto } from '@components/error-report/dto/response/error-report.response.dto';

export class IOqcTransactionHistoryNotReportedResponseDto {
  @ApiProperty({ example: 1, description: 'Id giao dịch' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'GD123', description: 'code giao dịch' })
  @Expose()
  code: string;

  @ApiProperty({ example: 1, description: 'Id của lệnh' })
  @Expose()
  orderId: number;

  @ApiProperty({ example: 1, description: 'Id của kho' })
  @Expose()
  warehouseId: number;

  @ApiProperty({ example: 1, description: 'Id của sản phẩm' })
  @Expose()
  itemId: number;

  @ApiProperty({ example: '00001', description: 'Mã của sản phẩm' })
  @Expose()
  itemCode: string;

  @ApiProperty({ example: 'ABC', description: 'Tên của sản phẩm' })
  @Expose()
  itemName: string;

  @ApiProperty({ example: 1, description: 'Id của người tạo' })
  @Expose()
  createdByUserId: number;

  @ApiProperty({ example: 1, description: 'SL qc' })
  @Expose()
  qcQuantity: number;

  @ApiProperty({ example: 1, description: 'SL pass' })
  @Expose()
  qcPassQuantity: number;

  @ApiProperty({ example: 1, description: 'SL ko đạt' })
  @Expose()
  qcRejectQuantity: number;

  @ApiProperty({ example: 'test note', description: 'note giao dịch' })
  @Expose()
  note: string;

  @ApiProperty({ example: 0, description: 'type 0, 2, 3, 5' })
  @Expose()
  type: number;

  @ApiProperty({ example: 2, description: 'QC x Lần' })
  @Expose()
  numberOfTime: number;

  @ApiProperty({ example: 1, description: 'Lần thứ x QC' })
  @Expose()
  numberOfTimeQc: number;

  @ApiProperty({
    example: {
      id: 60,
      code: 'ER60',
      name: 'bh',
    },
    description: 'Thông tin PBCL',
  })
  @Expose()
  @Type(() => ErrorReportResponseDto)
  errorReport: ErrorReportResponseDto;
}
