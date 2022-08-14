import { Expose } from "class-transformer";

export class GetListInProgressProducingStepsPlansResponseDto {
  @Expose()
  id: number;
  @Expose()
  qcStageId: number;
  @Expose()
  moId: number;
  @Expose()
  orderId: number;
  @Expose()
  planFrom: Date;
  @Expose()
  planTo: Date;
  @Expose()
  qcPlanQuantity: number;
}