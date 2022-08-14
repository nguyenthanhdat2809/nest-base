import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  ValidateNested,
  IsInt,
  Min,
  ArrayUnique,
  ArrayNotEmpty,
} from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';

class PItem {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @Min(1)
  @IsInt()
  quantity: number;
}

export class WOPrintQrcodeRequestDto extends BaseDto {
  @ApiProperty({
    description: 'Danh sách wo cần in',
    type: () => PItem,
    isArray: true,
  })
  @ArrayNotEmpty()
  @ValidateNested()
  @ArrayUnique<PItem>((i) => i.id)
  @Type(() => PItem)
  items: PItem[];
}
