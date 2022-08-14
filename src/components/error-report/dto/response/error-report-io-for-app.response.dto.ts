import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ErrorReportIOForAppResponseDto {
  @ApiProperty({ example: 1, description: 'ID of the error report' })
  @Expose()
  id: number;

  @ApiProperty({
    example: '0001',
    description: 'Code of the error report',
  })
  @Expose()
  codeErrorReport: string;

  @ApiProperty({
    example: '0001',
    description: 'Code of the order',
  })
  @Expose()
  codeOrder: string;

  @ApiProperty({
    example: '0001',
    description: 'Code of Item',
  })
  @Expose()
  codeItem: string;

  @ApiProperty({
    example: 'Item1',
    description: 'Name of Item',
  })
  @Expose()
  nameItem: string;

  @ApiProperty({
    example: 1,
    description: 'Status of the error report',
  })
  @Expose()
  status: number;

  @ApiProperty({
    example: '2021-07-13 09:13:15.562609+00',
    description: 'Date created the error report',
  })
  @Expose()
  createdAt: Date;
}
