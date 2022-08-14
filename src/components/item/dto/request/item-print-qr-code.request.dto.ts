import {
  ArrayNotEmpty,
  ArrayUnique,
  IsEnum,
  IsInt,
  IsNotEmpty,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { QrcCodeType } from '@components/item/item.constant';
import { BaseDto } from '@core/dto/base.dto';

class Item {
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

export class ItemPrintQrcodeRequestDto extends BaseDto {
  @ApiProperty({ description: 'Kiểu của tem cần tem: item, block, package' })
  @IsNotEmpty()
  @IsEnum(QrcCodeType)
  type: string;

  @ApiProperty({
    description: 'Danh sách item cần in',
    type: Item,
    isArray: true,
  })
  @ArrayNotEmpty()
  @ValidateNested()
  @ArrayUnique<Item>((i) => i.id)
  @Type(() => Item)
  items: Item[];
}
