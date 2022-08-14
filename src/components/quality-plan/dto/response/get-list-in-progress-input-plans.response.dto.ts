import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class GetListInProgressInputPlansResponseDto {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  qcStageId: number;
  @ApiProperty()
  @Expose()
  itemId: number;
  @ApiProperty()
  @Expose()
  orderId: number;
  @ApiProperty()
  @Expose()
  warehouseId: number;
  @ApiProperty()
  @Expose()
  planFrom: Date;
  @ApiProperty()
  @Expose()
  planTo: Date;
  @ApiProperty()
  @Expose()
  qcPlanQuantity: number;
}