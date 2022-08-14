import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class ItemDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;
}
class ItemUnit {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  id: number;
}

class ItemQCCheckListDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  value: string;
}

class ItemQCDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  planQuantity: number;

  @ApiProperty()
  @Expose()
  actualQuantity: number;

  @ApiProperty()
  @Expose()
  confirmedQuantity: number;

  @ApiProperty()
  @Expose()
  quantity: number;

  @ApiProperty()
  @Expose()
  qcRejectQuantity: number;

  @ApiProperty()
  @Expose()
  qcPassQuantity: number;

  @ApiProperty({ description: 'Sản phẩm', type: [ItemUnit], isArray: true })
  @Expose()
  @Type(() => ItemUnit)
  itemUnit: ItemUnit;
}

class ItemDetailQCDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty({ description: 'Đơn vị của sản phẩm' })
  @Expose()
  itemUnit: string;

  @ApiProperty({ description: 'Đơn vị của sản phẩm' })
  @Expose()
  itemUnitName: string;

  @ApiProperty({ description: 'Số lượng QC' })
  @Expose()
  qcQuantity: number;

  @ApiProperty({ description: 'Số lượng kế hoạch' })
  @Expose()
  planQuantity: number;

  @ApiProperty({ description: 'Số lượng đạt' })
  @Expose()
  qcPassTotalQuantity: number;

  @ApiProperty({ description: 'Số lượng đã qc' })
  @Expose()
  qcDoneTotalQuantity: number;

  @ApiProperty({ description: 'Số lượng cần' })
  @Expose()
  qcNeedTotalQuantity: number;

  @ApiProperty({ description: 'Số lượng đã qc và bị lỗi' })
  @Expose()
  qcRejectQuantity: number;

  @ApiProperty({ description: 'Số lượng đã qc và đạt' })
  @Expose()
  qcPassQuantity: number;
}

export class TransactionHistoryForAppResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  orderCode: string;

  @ApiProperty({ description: 'Sản phẩm', type: [ItemDto], isArray: true })
  @Expose()
  @Type(() => ItemDto)
  item: ItemDto;

  @ApiProperty({ description: 'Ngày s/x' })
  @Expose()
  createdAt: Date;
}
export class DetailTransactionHistoryForAppResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  note: string;

  @ApiProperty()
  @Expose()
  orderCode: string;

  @ApiProperty()
  @Expose()
  orderName: string;

  @ApiProperty()
  @Expose()
  wareHouse: string;

  @ApiProperty({ description: 'Sản phẩm', type: [ItemDto], isArray: true })
  @Expose()
  @Type(() => ItemDto)
  item: ItemDto;

  @ApiProperty({
    description: 'Thông tin item dto',
    type: [ItemDetailQCDto],
    isArray: true,
  })
  @Expose()
  @Type(() => ItemDetailQCDto)
  itemDetailQC: ItemDetailQCDto;

  @ApiProperty({
    description: 'Thông tin item dto',
    type: [ItemQCDto],
    isArray: true,
  })
  @Expose()
  @Type(() => ItemQCCheckListDto)
  checkList: ItemQCCheckListDto[];

  @ApiProperty({ description: 'Ngày s/x' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Người thực hiện' })
  @Expose()
  userCreate: string;

  @ApiProperty({ description: 'Só lô' })
  @Expose()
  consignmentName: string;

  @ApiProperty({ description: 'Só Hình thức Qc' })
  @Expose()
  formality: string;

  @ApiProperty({ description: 'Mã phiếu báo cáo lỗi' })
  @Expose()
  errorReportCode: string;

  @ApiProperty({ description: 'Tên phiếu báo cáo lỗi' })
  @Expose()
  errorReportName: string;

  @ApiProperty({ description: 'Số lần cần phải QC' })
  @Expose()
  numberOfTime: number;

  @ApiProperty({ description: 'Lần QC thứ Mấy' })
  @Expose()
  numberOfTimeQc: number;
}
