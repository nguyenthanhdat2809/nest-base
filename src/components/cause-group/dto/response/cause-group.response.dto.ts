import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CauseGroupResponseDto {
  @ApiProperty({ example: 1, description: 'ID of the error group' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'ERgroup1', description: 'Code of the error group' })
  @Expose()
  code: string;

  @ApiProperty({
    example: 'Error type 1',
    description: 'Name of the error group',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'Error group of NVL',
    description: 'Description of the error group',
  })
  @Expose()
  description: string;

  @ApiProperty({ example: '2021-07-13 09:13:15.562609+00', description: '' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2021-07-13 09:13:15.562609+00', description: '' })
  @Expose()
  updatedAt: Date;
}
