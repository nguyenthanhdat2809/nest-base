import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class QualityPlanResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  orderId: number;

  @ApiProperty()
  @Expose()
  moId: number;

  @ApiProperty()
  @Expose()
  moPlanId: number;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  qcStageId: number;

  @ApiProperty()
  @Expose()
  qcStageName: string;

  @ApiProperty()
  @Expose()
  createdBy: number;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty()
  @Expose()
  textStatus: string;

  @ApiProperty()
  @Expose()
  type: number;

  @ApiProperty()
  @Expose()
  orderCode: string;

  @ApiProperty()
  @Expose()
  orderName: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
