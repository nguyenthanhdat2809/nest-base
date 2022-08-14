import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsInt,
  IsArray,
  IsOptional,
  ValidateNested,
  ArrayUnique,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from '@core/dto/base.dto';

export class QualityPointRequestDto extends BaseDto {
  @ApiProperty({ example: 'Tiêu chí 1', description: 'Tên tiêu chí' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'ABCDE', description: 'Mã tiêu chí' })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 1, description: 'Id sản phẩm' })
  @IsInt()
  @IsOptional()
  itemId: number;

  @ApiProperty({ example: 1, description: 'Value Công đoạn QC' })
  @IsInt()
  @IsNotEmpty()
  stage: number;

  @ApiProperty({ example: 1, description: 'Id danh sách kiểm tra' })
  @IsInt()
  @IsNotEmpty()
  checkListId: number;

  @ApiProperty({ example: 1, description: 'Hình thức QC' })
  @IsInt()
  @IsNotEmpty()
  formality: number;

  @ApiProperty({ example: 1, description: 'Số Lần QC' })
  @IsInt()
  @IsNotEmpty()
  numberOfTime: number;

  @ApiProperty({ description: 'Số lượng QC' })
  @IsInt()
  @IsOptional()
  quantity: number;

  @ApiProperty({ example: 1, description: '% Lỗi chấp nhận' })
  @IsInt()
  @IsOptional()
  errorAcceptanceRate: number;

  @ApiProperty({ example: 'Mô tả', description: 'Mô tả tiêu chí' })
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiProperty({ example: [{ id: 1 }], description: 'Id người thực hiện 1' })
  @IsOptional()
  @IsArray()
  @ArrayUnique((e: QualityPointUser1) => e.id)
  @ValidateNested()
  @Type(() => QualityPointUser1)
  qualityPointUser1s: QualityPointUser1[];

  @ApiProperty({ example: [{ id: 1 }], description: 'Id người thực hiện 2' })
  @IsOptional()
  @IsArray()
  @ArrayUnique((e: QualityPointUser2) => e.id)
  @ValidateNested()
  @Type(() => QualityPointUser2)
  qualityPointUser2s: QualityPointUser2[];

  @IsNotEmpty()
  @IsInt()
  userId: number;
}

class QualityPointUser1 {
  @IsInt()
  @IsNotEmpty()
  id: number;
}

class QualityPointUser2 {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
