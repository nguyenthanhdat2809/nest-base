import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsString,
  IsOptional,
 } from 'class-validator';

class QualityPlanBomQualityPointUser {
  @ApiProperty({ example: 1, description: "ID Người QC" })
  @IsInt()
  @IsNotEmpty()
  userId: number;
}

export class QualityPlanBomRequestDto {
  @ApiProperty({ example: 1, description: "ID WO" })
  @IsInt()
  @IsNotEmpty()
  workOrderId: number;

  @ApiProperty({ example: 1, description: "ID BOM" })
  @IsInt()
  @IsNotEmpty()
  bomId: number;

  @ApiProperty({ example: 1, description: "ID Công Đoạn" })
  @IsInt()
  @IsNotEmpty()
  producingStepId: number;

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

  @ApiProperty({ example: '1_1_1_...', description: "Id BOM Cha" })
  @IsString()
  @IsNotEmpty()
  keyBomTree: string;

  @ApiProperty({ example: [{ userId: 1 }, {userId: 2}], description: "Người QC Lần 1" })
  @ValidateNested()
  @IsArray()
  @IsNotEmpty()
  @Type(() => QualityPlanBomQualityPointUser)
  qualityPlanBomQualityPointUser1s: QualityPlanBomQualityPointUser[];

  @ApiProperty({ example: [{ userId: 1 }, {userId: 2}], description: "Người QC Lần 2" })
  @ValidateNested()
  @IsArray()
  @IsOptional()
  @Type(() => QualityPlanBomQualityPointUser)
  qualityPlanBomQualityPointUser2s: QualityPlanBomQualityPointUser[];
}
