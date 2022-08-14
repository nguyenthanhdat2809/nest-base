import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Buffer } from 'buffer';

export class GetLogRequestDto extends BaseDto {
  @ApiProperty({
    description: 'Name of the log file',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
