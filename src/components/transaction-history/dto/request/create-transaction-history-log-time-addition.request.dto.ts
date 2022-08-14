import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateTransactionHistoryLogTimeAdditionRequestDto extends BaseDto {
  @ApiProperty({
    example: 1,
    description: 'Id của transaction history log time',
  })
  @IsInt()
  @IsNotEmpty()
  logTimeId: number;

  @ApiProperty({ example: '2021-10-30T17:11:02.755Z', description: 'Bắt đầu' })
  @Expose()
  @IsOptional()
  start: Date;

  @ApiProperty({ example: '2021-10-30T17:11:02.755Z', description: 'Kết thúc' })
  @Expose()
  @IsOptional()
  end: Date;
}
