import { ActionCategoryRequestDto } from '@components/action-category/dto/request/action-category.request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateActionCategoryRequestDto extends ActionCategoryRequestDto {
  @ApiProperty({
    example: '1',
    description: 'Id đối sách',
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  user: any;
}
