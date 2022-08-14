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

class ErrorGroup {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

class ItemQCCheckListDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  qcPassQuantity: number;

  @ApiProperty()
  @Expose()
  qcRejectQuantity: number;

  @ApiProperty()
  @Expose()
  @Type(() => ErrorGroup)
  errorGroup: ErrorGroup;
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

export class TransactionHistoryForWebResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  errorReportCode: string;

  @ApiProperty()
  @Expose()
  errorReportName: string;

  @ApiProperty()
  @Expose()
  orderCode: string;

  @ApiProperty()
  @Expose()
  orderName: string;

  @ApiProperty()
  @Expose()
  itemCode: string;

  @ApiProperty()
  @Expose()
  itemName: string;

  @ApiProperty({ description: 'Sản phẩm', type: [ItemDto], isArray: true })
  @Expose()
  @Type(() => ItemDto)
  item: ItemDto;

  @ApiProperty({ description: 'Ngày s/x' })
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  numberOfTime: number;

  @ApiProperty()
  @Expose()
  numberOfTimeQc: number;

  @ApiProperty()
  @Expose()
  numberOfTimeSearch: string;
}

export class DetailTransactionHistoryForWebResponseDto {
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
  wareHouse: string;

  @ApiProperty({ description: 'Sản phẩm', type: [ItemDto], isArray: true })
  @Expose()
  @Type(() => ItemDto)
  item: ItemDto;

  @ApiProperty({
    description: 'Thông tin item dto',
    type: [ItemQCDto],
    isArray: true,
  })
  @Expose()
  @Type(() => ItemQCDto)
  itemQC: ItemQCDto;

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
}
