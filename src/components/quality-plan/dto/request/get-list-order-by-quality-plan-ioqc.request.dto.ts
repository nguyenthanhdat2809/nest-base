import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { STAGES_OPTION } from '@constant/qc-stage.constant';

export class GetListOrderByQualityPlanIOqcRequestDto extends BaseDto {
  @ApiProperty({ description: "type 0, 2, 3, 5" })
  @IsNotEmpty()
  @IsEnum([
    STAGES_OPTION.PO_IMPORT,
    STAGES_OPTION.PRO_IMPORT,
    STAGES_OPTION.PRO_EXPORT,
    STAGES_OPTION.SO_EXPORT,
  ])
  type: number;

  @ApiProperty({ description: "Người dùng" })
  @IsNotEmpty()
  user: any;
}
