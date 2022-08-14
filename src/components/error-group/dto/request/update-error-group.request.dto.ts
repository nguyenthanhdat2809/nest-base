import { ErrorGroupRequestDto } from '@components/error-group/dto/request/error-group.request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateErrorGroupRequestDto extends ErrorGroupRequestDto {
  @ApiProperty({
    example: '1',
    description: 'ID of the error group',
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  user: any;
}
