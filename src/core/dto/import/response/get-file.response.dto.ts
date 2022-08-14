import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Buffer } from 'buffer';

export class GetFileResponseDto {
  @ApiProperty({ description: 'File name' })
  @Expose()
  fileName: string;

  @ApiProperty({ description: 'File content' })
  @Expose()
  fileContent: string | Buffer;
}
