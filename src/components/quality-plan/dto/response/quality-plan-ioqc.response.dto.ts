import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

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

  @ApiProperty()
  @Expose()
  unit?: string;
}

export class User {
  @ApiProperty()
  @Expose()
  userId:number;

  @ApiProperty()
  @Expose()
  username: string;
}

export class QualityPlanIOqcQualityPointUser {
  @ApiProperty()
  @Expose()
  id:number;

  @ApiProperty()
  @Expose()
  userId:number;

  @ApiProperty()
  @Expose()
  username: string;
}

export class QualityPoint {
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
  user1s: User[];

  @ApiProperty()
  @Expose()
  user2s: User[];
}

export class QualityPlanIOqcDetail {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  ordinalNumber: number;

  @ApiProperty()
  @Expose()
  planFrom: Date;

  @ApiProperty()
  @Expose()
  planTo: Date;

  @ApiProperty()
  @Expose()
  planErrorRate: number;

  @ApiProperty()
  @Expose()
  planQcQuantity: number;

  @ApiProperty()
  @Expose()
  qcPassQuantity: number;

  @ApiProperty()
  @Expose()
  qcRejectQuantity: number;

  @ApiProperty()
  @Expose()
  qcDoneQuantity: number;

  @ApiProperty()
  @Expose()
  qualityPlanIOqcQualityPointUser1s: QualityPlanIOqcQualityPointUser[];

  @ApiProperty()
  @Expose()
  qualityPlanIOqcQualityPointUser2s: QualityPlanIOqcQualityPointUser[];
}

export class QualityPlanIOqc {
  @ApiProperty()
  @Expose()
  id: number;

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
  qcCheck: number;

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
  planQuantity: number;

  @ApiProperty()
  @Expose()
  needQCQuantity: number;

  @ApiProperty()
  @Expose()
  errorReportId: any;

  @ApiProperty()
  @Expose()
  qualityPlanIOqcDetails: QualityPlanIOqcDetail[];

  @ApiProperty()
  @Expose()
  itemLists: any;
}

export class QualityPlanOrderResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  qcStageId: number;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty()
  @Expose()
  order: CodeNameObj;

  @ApiProperty()
  @Expose()
  qualityPlanIOqcs: QualityPlanIOqc[];
}


