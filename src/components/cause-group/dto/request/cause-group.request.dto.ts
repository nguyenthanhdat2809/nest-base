import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { BaseDto } from '@core/dto/base.dto';
import { CAUSE_GROUP_CONST } from '@components/cause-group/cause-group.constant';

export class CauseGroupRequestDto extends BaseDto {
  @ApiProperty({
    example: 'ERgroup1',
    description: 'Code of the error group',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(CAUSE_GROUP_CONST.CODE.MAX_LENGTH)
  code: string;

  @ApiProperty({
    example: 'Error type 1',
    description: 'Name of the error group',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(CAUSE_GROUP_CONST.NAME.MAX_LENGTH)
  name: string;

  @ApiProperty({
    example: 'Error group of NVL',
    description: 'Description of the error group',
  })
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(CAUSE_GROUP_CONST.DESCRIPTION.MAX_LENGTH)
  description: string;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
