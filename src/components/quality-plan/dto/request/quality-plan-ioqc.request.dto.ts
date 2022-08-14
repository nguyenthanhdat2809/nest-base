import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { STAGES_OPTION } from '@constant/qc-stage.constant';
import { TypeQualityPlan } from '@entities/quality-plan/quality-plan.entity';
import { QcCheck } from '@entities/quality-plan/quality-plan-ioqc.entity';

class QualityPlanIOqcQualityPointUser {
  @ApiProperty({ example: 1, description: "ID Người QC" })
  @IsInt()
  @IsNotEmpty()
  userId: number;
}

export class UpdateQualityPlanIOqcQualityPointUser extends QualityPlanIOqcQualityPointUser {
  @ApiProperty()
  @IsInt()
  id: number;
}

class QualityPlanIOqcDetailRequestDto {
  @ApiProperty({ example: 1, description: "Số thứ tự tạo QC cho sản phẩm" })
  @IsInt()
  @IsNotEmpty()
  ordinalNumber: number;

  @ApiProperty({ example: "2021-11-07T06:21:45.382Z", description: "Ngày Bắt Đầu Kế Hoạch QC" })
  @IsDateString()
  @IsNotEmpty()
  planFrom: Date;

  @ApiProperty({ example: "2021-11-07T06:21:45.382Z", description: "Ngày Kết Thúc Kế Hoạch QC" })
  @IsDateString()
  @IsNotEmpty()
  planTo: Date;

  @ApiProperty({ example: 10, description: "Kế Hoạch Lỗi" })
  @IsInt()
  @IsNotEmpty()
  planErrorRate: number;

  @ApiProperty({ example: 10, description: "Số Lượng Kế Hoạch QC" })
  @IsInt()
  @IsNotEmpty()
  planQcQuantity: number;

  @ApiProperty({ type: [QualityPlanIOqcQualityPointUser], description: "Người QC Lần 1" })
  @IsArray()
  @IsNotEmpty()
  qualityPlanIOqcQualityPointUser1s: QualityPlanIOqcQualityPointUser[] | UpdateQualityPlanIOqcQualityPointUser[];

  @ApiProperty({ type: [QualityPlanIOqcQualityPointUser], description: "Người QC Lần 2" })
  @IsArray()
  @IsOptional()
  qualityPlanIOqcQualityPointUser2s: QualityPlanIOqcQualityPointUser[] | UpdateQualityPlanIOqcQualityPointUser[];
}

export class UpdateQualityPlanIOqcDetailRequestDto extends QualityPlanIOqcDetailRequestDto {
  @ApiProperty({ example: 1, description: "" })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ example: 10, description: "Số lượng lỗi của 1 lần Qc" })
  @IsInt()
  @IsOptional()
  qcDoneQuantity: number;

  @ApiProperty({ example: 10, description: "Số lượng đạt của 1 lần Qc" })
  @IsInt()
  @IsOptional()
  qcPassQuantity: number;
}

class QualityPlanIOqcRequestDto {
  @ApiProperty({ example: 1, description: "ID Lệnh" })
  @IsInt()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty({ example: 1, description: "ID Kho" })
  @IsInt()
  @IsNotEmpty()
  warehouseId: number;

  @ApiProperty({ example: 1, description: "ID Sản Phẩm" })
  @IsInt()
  @IsNotEmpty()
  itemId: number;

  @ApiProperty({ example: 1, description: "ID Tiêu Chí" })
  @IsInt()
  @IsNotEmpty()
  qualityPointId: number;

  @ApiProperty({ example: 10, description: "Số lượng đã nhập" })
  @IsInt()
  @IsOptional()
  actualQuantity: number;

  @ApiProperty({ example: 10, description: "Số lượng kế hoạch" })
  @IsInt()
  @IsOptional()
  quantity: number;

  @ApiProperty({ example: 10, description: "Số lượng lỗi của 1 lần Qc" })
  @IsInt()
  @IsOptional()
  qcRejectQuantity: number;

  @ApiProperty({ example: 10, description: "Số lượng đạt của 1 lần Qc" })
  @IsInt()
  @IsOptional()
  qcPassQuantity: number;

  @ApiProperty({ example: 10, description: "Tổng số lượng lỗi sau tất cả các lần Qc" })
  @IsInt()
  @IsOptional()
  errorQuantity: number;

  @ApiProperty({ example: 0, description: "Trạng thái của lệnh 0 (unChecked) hoặc 1 (checked)" })
  @IsEnum(QcCheck)
  @IsOptional()
  qcCheck: number;

  @ApiProperty({ type: [QualityPlanIOqcDetailRequestDto], description: "" })
  @IsArray()
  @IsNotEmpty()
  qualityPlanIOqcDetails: QualityPlanIOqcDetailRequestDto[] | UpdateQualityPlanIOqcDetailRequestDto[];
}

export class UpdateQualityPlanIOqcRequestDto extends QualityPlanIOqcRequestDto {
  @ApiProperty()
  @IsInt()
  id: number;
}

export class QualityPlanOrderRequestDto extends BaseDto{
  @ApiProperty({ example: "0001", description: "Mã Kế Hoạch QC Đầu Vào Hoặc Ra" })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: "ABC", description: "Tên Kế Hoạch QC Đầu Vào Hoặc Ra" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "ABC", description: "Mô Tả Kế Hoạch QC Đầu Vào Hoặc Ra" })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: 1, description: 'Type 1(OP), 2(INPUT), 3(OUTPUT)' })
  @IsOptional()
  @IsEnum(TypeQualityPlan)
  type: number;

  @ApiProperty({ example: 0, description: 'Type 0, 2, 3, 5' })
  @IsNotEmpty()
  @IsEnum([
    STAGES_OPTION.PO_IMPORT,
    STAGES_OPTION.PRO_IMPORT,
    STAGES_OPTION.PRO_EXPORT,
    STAGES_OPTION.SO_EXPORT,
  ])
  qcStageId: number;

  @ApiProperty({ type: [QualityPlanIOqcRequestDto], description: "" })
  @IsArray()
  @IsNotEmpty()
  qualityPlanIOqcs: QualityPlanIOqcRequestDto[] | UpdateQualityPlanIOqcRequestDto[];

  @ApiProperty({ description: "Người tạo" })
  @IsNotEmpty()
  user: any;
}
