import { AlertRequestDto } from '@components/alert/dto/request/alert.request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateAlertRequestDto extends AlertRequestDto {
  @ApiProperty({
    example: '1',
    description: 'Id thông báo cải tiến',
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;
  
  @IsNotEmpty()
  user: any;
}
