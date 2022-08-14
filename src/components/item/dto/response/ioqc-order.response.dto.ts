import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class IoqcOrderResponseDto {
  @ApiProperty({ description: 'ID SO' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Tên SO' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Mã SO' })
  @Expose()
  code: string;

  @ApiProperty({ description: 'Ngày thực hiện' })
  @Expose()
  deadline: string;
}
