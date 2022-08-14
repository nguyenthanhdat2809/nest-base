import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

class ScheduleShiftDetail{
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

class WorkInShift {
  @ApiProperty({ example: "2021-11-30T00:00:00.000Z", description: "Ngày làm việc" })
  @IsDateString()
  executionDay: Date;

  @ApiProperty({ type: [ScheduleShiftDetail], description: "Chi tiết các ca làm việc trong 1 ngày" })
  @IsArray()
  @IsNotEmpty()
  scheduleShiftDetails: ScheduleShiftDetail[];
}

export class WorkCenterPlanQcShiftResponseDto {
  @ApiProperty({ example: 1, description: "ID word order" })
  @Expose()
  workOrderId: number;

  @ApiProperty({ example: 1, description: "ID word center" })
  @Expose()
  workCenterId: number;

  @ApiProperty({ type: [WorkInShift], description: "Dữ liệu làm việc từng ngày theo ca" })
  @IsArray()
  @IsNotEmpty()
  workInShifts: WorkInShift[];
}
