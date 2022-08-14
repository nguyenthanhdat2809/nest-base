import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  MaxLength,
  ValidateNested,
  ArrayUnique,
  IsArray,
  ArrayNotEmpty,
  IsEmpty,
  IsInt,
} from 'class-validator';

export class CheckListDetailRequestDto {
  @ApiProperty({ example: 'Title', description: 'Title' })
  @IsString()
  @MaxLength(50)
  title: string;

  @ApiProperty({
    example: 'Description Content',
    description: 'Description Content',
  })
  @IsString()
  @MaxLength(255)
  descriptionContent: string;

  @ApiProperty({ example: 1, description: 'Check Type' })
  @IsNumber()
  checkType: number;

  @ApiProperty({ example: 1, description: 'Norm' })
  norm: number;

  @ApiProperty({ example: 1, description: 'Value Top' })
  valueTop: number;

  @ApiProperty({ example: 1, description: 'Value Bottom' })
  valueBottom: number;

  @ApiProperty({ example: 1, description: 'Error Group Id' })
  @IsNumber()
  errorGroupId: number;

  @ApiProperty({ example: 1, description: 'Item Unit Id' })
  itemUnitId: number;
}

export class CheckListRequestDto extends BaseDto {
  @ApiProperty({ example: 'Check List', description: 'Name Check List' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'ABCDE', description: 'Code Check List' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({ example: 'Description', description: 'Description' })
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiProperty()
  @ValidateNested()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => CheckListDetailRequestDto)
  checkListDetails: CheckListDetailRequestDto[];

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
