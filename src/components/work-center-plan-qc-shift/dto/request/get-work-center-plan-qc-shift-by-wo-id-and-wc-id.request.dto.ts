import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';

export class GetWorkCenterPlanQcShiftByWoIdAndWcIdRequestDto extends BaseDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  workOrderId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  workCenterId: number;
}
