import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { QualityPlanBomRequestDto } from '@components/quality-plan/dto/request/quality-plan-bom-request.dto';
import { UpdateQualityPlanBomRequestDto } from '@components/quality-plan/dto/request/update-quality-plan-bom.request.dto';
import { TypeQualityPlan } from '@entities/quality-plan/quality-plan.entity';
import { STAGES_OPTION } from '@constant/qc-stage.constant';

export class QualityPlanRequestDto extends BaseDto {
  @ApiProperty({ example: "0001", description: "Mã Kế Hoạch QC Công Đoạn" })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: "ABC", description: "Tên Kế Hoạch QC Công Đoạn" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "ABC", description: "Mô Tả Kế Hoạch QC Công Đoạn" })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: 1, description: 'Type 1, 2, 3' })
  @IsOptional()
  @IsEnum(TypeQualityPlan)
  type: number;

  @ApiProperty({ example: 1, description: "ID Lệnh Sản Xuất" })
  @IsInt()
  @IsNotEmpty()
  moId: number;

  @ApiProperty({ example: 1, description: "ID Kế Hoạch Sản Xuất" })
  @IsInt()
  @IsNotEmpty()
  moPlanId: number;

  @ApiProperty({ type: [QualityPlanBomRequestDto], description: "ID Kế Hoạch Sản Xuất" })
  @IsArray()
  @IsNotEmpty()
  moPlanBoms: QualityPlanBomRequestDto[] | UpdateQualityPlanBomRequestDto[];

  @ApiProperty({ example: 0, description: 'Type 0, 2, 3, 5, 8' })
  @IsOptional()
  @IsEnum([
    STAGES_OPTION.PO_IMPORT,
    STAGES_OPTION.PRO_IMPORT,
    STAGES_OPTION.PRO_EXPORT,
    STAGES_OPTION.SO_EXPORT,
    STAGES_OPTION.OUTPUT_PRODUCTION,
  ])
  qcStageId: number;

  @ApiProperty({ description: "Người tạo" })
  @IsNotEmpty()
  user: any;
}
