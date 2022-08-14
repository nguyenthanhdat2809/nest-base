import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class QualityPointUserResponseDto {
  @Expose()
  userId: number;
}

export class QualityPointResponseDto {
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

  @ApiProperty()
  @Expose()
  itemId: number;

  @ApiProperty()
  @Expose()
  stage: number;

  @ApiProperty()
  @Expose()
  qcStageName: string;

  @ApiProperty()
  @Expose()
  username: string;

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

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
