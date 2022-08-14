import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@core/dto/base.dto';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class DeleteQualityPointRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  id: number;
  @IsNotEmpty()
  user: any;
}
