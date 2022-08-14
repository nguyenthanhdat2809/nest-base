import { BaseDto } from '@core/dto/base.dto';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class GetWOSummaryScanRequestDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  qrCode: string;
  @IsNotEmpty()
  @IsInt()
  userId: number;
  @IsNotEmpty()
  user: any;
}
