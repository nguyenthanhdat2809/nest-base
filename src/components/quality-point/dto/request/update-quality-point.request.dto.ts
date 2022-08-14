import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { QualityPointRequestDto } from '@components/quality-point/dto/request/quality-point.request.dto';

export class UpdateQualityPointRequestDto extends QualityPointRequestDto {
  @ApiProperty({ example: 1, description: 'Id Tiêu Chí' })
  @IsNotEmpty()
  @IsInt()
  id: number;
  
  @IsNotEmpty()
  user: any;
}

