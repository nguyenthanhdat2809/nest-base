import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ErrorReportResponseDto } from '@components/error-report/dto/response/error-report.response.dto';

class LogTimeResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  start: Date;

  @ApiProperty()
  @Expose()
  end: Date;

  @ApiProperty()
  @Expose()
  duration: number;

  @ApiProperty()
  @Expose()
  status: number;
}

export class ProducingStepsTransactionHistoryNotReportedResponseDto {
  @ApiProperty({ example: 1, description: 'Id giao dịch' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'GD123', description: 'code giao dịch' })
  @Expose()
  code: string;

  @ApiProperty({ example: 1, description: 'SL pass' })
  @Expose()
  qcPassQuantity: number;

  @ApiProperty({ example: 1, description: 'SL ko đạt' })
  @Expose()
  qcRejectQuantity: number;

  @ApiProperty({ example: 'test note', description: 'note giao dịch' })
  @Expose()
  note: string;

  @ApiProperty({ example: 1, description: 'Id của work order' })
  @Expose()
  orderId: number;

  @ApiProperty({
    example: {
      id: 1183,
      start: '2022-01-05T15:30:21+07:00',
      end: null,
      duration: 0,
      status: '0',
    },
    description: 'Thông tin của log time',
  })
  @Expose()
  @Type(() => LogTimeResponseDto)
  logTime: LogTimeResponseDto;

  @ApiProperty({
    example: {
      id: 60,
      code: 'ER60',
      name: 'bh',
    },
    description: 'Thông tin PBCL',
  })
  @Expose()
  @Type(() => ErrorReportResponseDto)
  errorReport: ErrorReportResponseDto;

  @ApiProperty()
  @Expose()
  numberOfTime: number;

  @ApiProperty()
  @Expose()
  numberOfTimeQc: number;
}
