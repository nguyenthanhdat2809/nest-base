import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { BaseDto } from '@core/dto/base.dto';
import { ACTION_CATEGORY_CONST } from '@components/action-category/action-category.constant';

export class ActionCategoryRequestDto extends BaseDto {
  @ApiProperty({
    example: '00001',
    description: 'Mã đối sách',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(ACTION_CATEGORY_CONST.CODE.MAX_LENGTH)
  code: string;

  @ApiProperty({
    example: 'Đối sách 1',
    description: 'Tên đối sách',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(ACTION_CATEGORY_CONST.NAME.MAX_LENGTH)
  name: string;

  @ApiProperty({
    example: 'Mô tả',
    description: 'Mô tả',
  })
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(ACTION_CATEGORY_CONST.DESCRIPTION.MAX_LENGTH)
  description: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
