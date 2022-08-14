import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { BaseDto } from '@core/dto/base.dto';

export class UpdateTransactionHistoryLogTimeRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  id: number;
  @ApiPropertyOptional({ description: 'Bắt đầu' })
  @Expose()
  @IsOptional()
  start: Date;

  @ApiPropertyOptional({ description: 'Kết thúc' })
  @Expose()
  @IsOptional()
  end: Date;

  @ApiPropertyOptional({ description: 'Pause' })
  @Expose()
  @IsOptional()
  pause: Date;

  @ApiPropertyOptional({ description: 'Play' })
  @Expose()
  @IsOptional()
  play: Date;

  @ApiPropertyOptional({ description: 'Thời gian thực hiện' })
  @Expose()
  @IsOptional()
  @IsNumber()
  duration: number;
}
