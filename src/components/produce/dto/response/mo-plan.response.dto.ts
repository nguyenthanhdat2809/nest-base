import { Expose, Type } from 'class-transformer';

class Item {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  itemUnitName: string;

  @Expose()
  itemUnitCode: string;
}

class Bom {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;
}

class Routing {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;
}

class ProducingStepChildren {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  qcCriteriaId: number;

  @Expose()
  stepNumber: number;
}

class WorkOrders {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  planFrom: Date;

  @Expose()
  planTo: Date;

  @Expose()
  qcPassQuantity: number;

  @Expose()
  qcRejectQuantity: number;

  @Expose()
  actualQuantity: number;

  @Expose()
  repairQuantity: number;

  @Expose()
  errorQuantity: number;
}

class ProducingStep {
  @Expose()
  quantity: number;

  @Expose()
  actualQuantity: number;

  @Expose()
  @Type(() => ProducingStepChildren)
  producingStep: ProducingStepChildren;

  @Expose()
  @Type(() => WorkOrders)
  workOrders: WorkOrders[];
}

class PlanBom {
  @Expose()
  id: number;

  @Expose()
  bomId: number;

  @Expose()
  status: string;

  @Expose()
  executeDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  planFrom: Date;

  @Expose()
  planTo: Date;

  @Expose()
  @Type(() => ProducingStep)
  producingStep: ProducingStep[];
}

class PlanBoms {
  @Expose()
  actualQuantity: number;

  @Expose()
  planingQuantity: number;

  @Expose()
  @Type(() => Item)
  item: Item;

  @Expose()
  @Type(() => Bom)
  bom: Bom;

  @Expose()
  @Type(() => Routing)
  routing: Routing;

  @Expose()
  @Type(() => PlanBom)
  planBom: PlanBom;

  @Expose()
  @Type(() => PlanBoms)
  subBom: PlanBoms;
}

class MO {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  planFrom: Date;

  @Expose()
  planTo: Date;
}

export class MoPlanResponseDto {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  @Type(() => MO)
  mo: MO;

  @Expose()
  @Type(() => PlanBoms)
  planBoms: PlanBoms[];
}
