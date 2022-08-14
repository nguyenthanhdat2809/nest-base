import { AlertRequestDto } from '@components/alert/dto/request/alert.request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateAlertRequestDto extends AlertRequestDto {
  @ApiProperty({ example: 1, description: 'Người người tạo', })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
