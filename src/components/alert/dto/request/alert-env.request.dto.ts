import { IsNotEmpty } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';

export class AlertEnvItemByBoqResponseDto extends BaseDto{
  @IsNotEmpty()
  id: number;
}
