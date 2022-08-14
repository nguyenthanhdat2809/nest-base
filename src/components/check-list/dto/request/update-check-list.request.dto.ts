import { ApiProperty } from '@nestjs/swagger';
import { CheckListRequestDto } from '@components/check-list/dto/request/check-list.request.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateCheckListRequestDto extends CheckListRequestDto {
  @ApiProperty({ example: 1, description: '' })
  @IsNotEmpty()
  @IsInt()
  id: number;
  
  @IsNotEmpty()
  user: any;
}

