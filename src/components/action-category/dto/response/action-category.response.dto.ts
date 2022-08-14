import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ActionCategoryResponseDto {
  @ApiProperty({ example: 1, description: 'Id đối sách' })
  @Expose()
  id: number;

  @ApiProperty({ example: '00001', description: 'Mã đối sách' })
  @Expose()
  code: string;

  @ApiProperty({
    example: 'Đối sách 1',
    description: 'Tên đối sách',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'Mô tả',
    description: 'Mô tả',
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