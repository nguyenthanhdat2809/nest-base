import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

class WarehouseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

class OrderDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;
}

class CustomerDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

class VendorDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

class UserDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  userName: string;
}

class ItemDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  unitName: string;

  @ApiProperty({
    description: 'Số lượng kế hoạch trong mã lệnh',
  })
  @Expose()
  planQuantity: number;

  @ApiProperty({
    description: 'SL cần QC trong mã lệnh',
  })
  @Expose()
  qcNeedTotalQuantity: number;

  @ApiProperty({
    description: 'SL đã QC trong mã lệnh',
  })
  @Expose()
  qcDoneTotalQuantity: number;

  @ApiProperty({
    description: 'SL đạt QC trong mã lệnh',
  })
  @Expose()
  qcPassTotalQuantity: number;

  @ApiProperty({
    description: 'SL lỗi QC trong mã lệnh',
  })
  @Expose()
  qcRejectTotalQuantity: number;

  @ApiProperty({
    description: 'SL cần để validate',
  })
  @Expose()
  validateQcNeedQuantity: number;
}

class TransactionHistoryDetailDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  transactionHistoryId: number;

  @ApiProperty({
    description: 'SL đạt của từng check list detail',
  })
  @Expose()
  qcPassQuantity: number;

  @ApiProperty({
    description: 'SL lỗi của từng check list detail',
  })
  @Expose()
  qcRejectQuantity: number;
}

class CheckListDetailDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Tiêu đề',
    example: 'Check 1',
  })
  @Expose()
  title: string;
}

export class QualityProgressDto {
  @ApiProperty()
  @Expose()
  item: ItemDto;

  @ApiProperty({
    description: 'Mảng chi tiết danh sách kiểm tra',
    type: [CheckListDetailDto],
  })
  @Expose()
  checkListDetails: CheckListDetailDto[];
}

export class InputQcProgressScanQrResponseDto {
  @ApiProperty({
    description: 'Kho',
  })
  @Expose()
  warehouse: WarehouseDto;

  @ApiProperty({
    description: 'Lệnh PO',
  })
  @Expose()
  order: OrderDto;

  @ApiProperty({
    description: 'Nhà cung cấp',
  })
  @Expose()
  vendor: VendorDto;

  @ApiProperty({
    description: 'Khách hàng',
  })
  @Expose()
  customer: CustomerDto;

  @ApiProperty({
    description: 'Ngày thực hiện',
  })
  @Expose()
  deadline: Date;

  @ApiProperty({
    description: 'Tiêu chí',
  })
  @Expose()
  qcCriteriaId: number;

  @ApiProperty({
    description: 'Người thực hiện',
  })
  @Expose()
  createdBy: UserDto;

  @ApiProperty({
    description: 'Hình thức QC',
  })
  @Expose()
  formality: string;

  @ApiProperty({
    description: 'Số lô',
  })
  @Expose()
  consignmentName: string;

  @ApiProperty({
    description: 'Số Lần QC',
  })
  @Expose()
  numberOfTime: number;

  @ApiProperty({
    description: 'Lần QC thứ mấy',
  })
  @Expose()
  numberOfTimeQc: number;

  @ApiProperty({
    description: 'Tiến độ QC',
  })
  @Expose()
  qcProgress: QualityProgressDto;
}

