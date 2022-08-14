import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';

class WorkOrderResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

class ItemResponseDto {
  @ApiProperty()
  @Expose()
  itemId: number;
  @ApiProperty()
  @Expose()
  name: string;
  @ApiProperty()
  @Expose()
  code: string;
}

class ProducingStepResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty({ type: WorkOrderResponseDto, isArray: true })
  @Expose()
  @IsArray()
  @Type(() => WorkOrderResponseDto)
  workOrders: WorkOrderResponseDto[];
}

class MoPlanBom {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  @Type(() => ItemResponseDto)
  item: ItemResponseDto;
  @ApiProperty()
  @Expose()
  @Type(() => ProducingStepResponseDto)
  producingSteps: ProducingStepResponseDto[];
}

export class GetPlanItemMoListResponseDto {
  @ApiProperty()
  @Expose()
  planId: number;

  @ApiProperty()
  @Expose()
  planCode: string;

  @ApiProperty()
  @Expose()
  planName: string;

  @ApiProperty()
  @Expose()
  @Type(() => MoPlanBom)
  moPlanBoms: MoPlanBom[];
}
