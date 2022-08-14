import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';

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

class WorkOrderResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
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

  @ApiProperty()
  @Expose()
  qcCheck: number;

  @ApiProperty()
  @Expose()
  inputQcCheck: number;
}

export class GetMoItemDetailResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  bomId: number;

  @ApiProperty()
  @Expose()
  isParent: boolean;
  @ApiProperty({ type: ItemResponseDto })
  @Type(() => ItemResponseDto)
  @Expose()
  item: ItemResponseDto;

  @ApiProperty({ type: ProducingStepResponseDto, isArray: true })
  @Type(() => ProducingStepResponseDto)
  @Expose()
  producingSteps: ProducingStepResponseDto;
}
