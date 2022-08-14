import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class TransactionHistoryLogTimeAdditionResponseDto {
  @ApiProperty({ example: 1, description: 'Id của bản ghi' })
  @Expose()
  id: number;
  @ApiProperty({ example: '2021-10-30T17:11:02.755Z', description: 'bắt đầu' })
  @Expose()
  startTime: Date;
  @ApiProperty({ example: '2021-10-30T17:11:02.755Z', description: 'kết thúc' })
  @Expose()
  endTime: Date;
  @ApiProperty({
    example: 5000,
    description: 'thời gian thực hiện tính theo giây',
  })
  @Expose()
  duration: number;
  @ApiProperty({
    example: 1,
    description: 'Id của transaction history log time',
  })
  @Expose()
  transactionHistoryLogTimeId: number;
}