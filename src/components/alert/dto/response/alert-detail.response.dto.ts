import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Type } from 'class-transformer';

class ManufacturingOrder {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

class Item {
  @Expose()
  id: number;

  @Expose()
  code: string;
}

class Routing {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

class ProducingStep {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

class PurchasedOrder {
  @Expose()
  id: number;

  @Expose()
  code: string;
}

class Warehouse {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

class ErrorReport {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

class User {
  @Expose()
  id: number;

  @Expose()
  username: string;
}

export class AlertDetailResponseDto {
  @ApiProperty({ example: 1, description: 'Id của thông báo' })
  @Expose()
  id: number;

  @ApiProperty({ example: '00001', description: 'Mã thông báo' })
  @Expose()
  code: string;

  @ApiProperty({ example: 'Thông báo 1', description: 'Tên thông báo', })
  @Expose()
  name: string;

  @ApiProperty({ example: 'Mô tả', description: 'Mô tả', })
  @Expose()
  description: string;

  @ApiProperty({ example: 1, description: 'Công đoạn QC', })
  @Expose()
  stage: number;

  @ApiProperty({ example: 0, description: 'Trạng thái', })
  @Expose()
  status: number;

  @ApiProperty({ example: 1, description: 'QC công đoạn sản xuất', })
  @Expose()
  typeAlert: number;

  @ApiProperty({ example: 1, description: 'Loại sản phẩm', })
  @Expose()
  productType: number;

  @ApiProperty({ type: ManufacturingOrder, isArray: true })
  @Expose()
  @Type(() => ManufacturingOrder)
  manufacturingOrder: ManufacturingOrder;

  @ApiProperty({ type: Item, isArray: true })
  @Expose()
  @Type(() => Item)
  item: Item;

  @ApiProperty({ type: Routing, isArray: true })
  @Expose()
  @Type(() => Routing)
  routing: Routing;

  @ApiProperty({ type: ProducingStep, isArray: true })
  @Expose()
  @Type(() => ProducingStep)
  producingStep: ProducingStep;

  @ApiProperty({ type: PurchasedOrder, isArray: true })
  @Expose()
  @Type(() => PurchasedOrder)
  purchasedOrder: PurchasedOrder;

  @ApiProperty({ type: Warehouse, isArray: true })
  @Expose()
  @Type(() => Warehouse)
  warehouse: Warehouse;

  @ApiProperty({ type: ErrorReport, isArray: true })
  @Expose()
  @Type(() => ErrorReport)
  errorReport: ErrorReport;

  @ApiProperty({ type: User, isArray: true })
  @Expose()
  @Type(() => User)
  alertRelatedUsers: User[];
}
