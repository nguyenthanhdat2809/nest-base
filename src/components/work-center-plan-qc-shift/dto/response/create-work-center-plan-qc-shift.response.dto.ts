import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsDateString } from 'class-validator';

class WorkInShift {
  @ApiProperty({ example: "2021-11-30T00:00:00.000Z", description: "Ngày làm việc" })
  @Expose()
  executionDay: Date;

  @ApiProperty({ example: 1, description: "Ca số 1" })
  @Expose()
  numberOfShift: number;

  @ApiProperty({ example: 100, description: "Số Lượng Kế Hoạch" })
  @Expose()
  planQuantity: number;

  @ApiProperty({ example: 100, description: "Số Lượng Sản Xuất" })
  @Expose()
  actualQuantity: number;

  @ApiProperty({ example: 100, description: "Số Lượng Điều Độ" })
  @Expose()
  moderationQuantity: number;
}

export class CreateWorkCenterPlanQcShiftResponseDto {
  @ApiProperty({ example: 1, description: "ID word order" })
  @Expose()
  workOrderId: number;

  @ApiProperty({ example: 1, description: "ID word center" })
  @Expose()
  workCenterId: number;

  @ApiProperty({ type: [WorkInShift], description: "Dữ liệu làm việc từng ngày theo ca" })
  @Expose()
  workInShifts: WorkInShift[];
}
