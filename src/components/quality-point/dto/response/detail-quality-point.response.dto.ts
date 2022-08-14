import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class QualityPointUserResponseDto {
  @Expose()
  userId: number;
}

class Item {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;
}

export class DetailQualityPointResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty({
    type: Item,
    example: { id: 1, code: '00001' },
    description: '',
  })
  @Expose()
  @Type(() => Item)
  item: Item[];

  @ApiProperty()
  @Expose()
  stage: number;

  @ApiProperty()
  @Expose()
  checkListId: number;

  @ApiProperty()
  @Expose()
  formality: number;

  @ApiProperty()
  @Expose()
  numberOfTime: number;

  @ApiProperty()
  @Expose()
  quantity: number;

  @ApiProperty()
  @Expose()
  errorAcceptanceRate: number;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  material: number;

  @ApiProperty()
  @Expose()
  productPrevious: number;

  @ApiProperty({
    type: QualityPointUserResponseDto,
    example: [{ id: 1, }],
    description: '',
  })
  @Expose()
  @Type(() => QualityPointUserResponseDto)
  qualityPointUser1s: QualityPointUserResponseDto[];

  @ApiProperty({
    type: QualityPointUserResponseDto,
    example: [{ id: 1, }],
    description: '',
  })
  @Expose()
  @Type(() => QualityPointUserResponseDto)
  qualityPointUser2s: QualityPointUserResponseDto[];
}
