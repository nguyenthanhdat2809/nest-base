import { IsNotEmpty, IsInt } from 'class-validator';
import { BaseDto } from 'src/core/dto/base.dto';
export class UpdateCheckListStatusRequestDto extends BaseDto {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
