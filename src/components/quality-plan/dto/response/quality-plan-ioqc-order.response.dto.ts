import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { QcCheck } from '@entities/quality-plan/quality-plan-ioqc.entity';

class CodeNameObj {
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

class User {
  @ApiProperty()
  @Expose()
  userId:number;

  @ApiProperty()
  @Expose()
  username: string;
}

class QualityPoint {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  formalityRate: number;

  @ApiProperty()
  @Expose()
  numberOfTime: number;

  @ApiProperty()
  @Expose()
  users: User[];
}

export class QualityPlanIOqc {
  @ApiProperty()
  @Expose()
  orderId: number;

  @ApiProperty()
  @Expose()
  warehouseId: number;

  @ApiProperty()
  @Expose()
  warehouse: CodeNameObj;

  @ApiProperty()
  @Expose()
  itemId: number;

  @ApiProperty()
  @Expose()
  item: CodeNameObj;

  @ApiProperty()
  @Expose()
  qualityPointId: number;

  @ApiProperty()
  @Expose()
  qualityPoint: QualityPoint;

  @ApiProperty()
  @Expose()
  actualQuantity: number;

  @ApiProperty()
  @Expose()
  quantity: number;

  @ApiProperty()
  @Expose()
  qcRejectQuantity: number;

  @ApiProperty()
  @Expose()
  qcPassQuantity: number;

  @ApiProperty()
  @Expose()
  errorQuantity: number;

  @ApiProperty()
  @Expose()
  @IsEnum(QcCheck)
  qcCheck: number;

  @ApiProperty()
  @Expose()
  itemLists: any;
}

export class QualityPlanIOqcOrderResponseDto {
  @ApiProperty()
  @Expose()
  order: CodeNameObj;

  @ApiProperty()
  @Expose()
  qualityPlanIOqcs: QualityPlanIOqc[];
}


