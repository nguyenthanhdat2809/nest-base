import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsDateString, IsArray, IsObject, IsInt } from "class-validator";
import { BaseDto } from '@core/dto/base.dto';

class ScheduleShiftDetail {
  @ApiProperty({ example: 1, description: "Ca số 1" })
  @Expose()
  @IsNotEmpty()
  numberOfShift: number;

  @ApiProperty({ example: 100, description: "Số Lượng Kế Hoạch" })
  @Expose()
  @IsNotEmpty()
  planQuantity: number;

  @ApiProperty({ example: 100, description: "Số Lượng Sản Xuất" })
  @Expose()
  @IsNotEmpty()
  actualQuantity: number;

  @ApiProperty({ example: 100, description: "Số Lượng Điều Độ" })
  @Expose()
  @IsNotEmpty()
  moderationQuantity: number;
}

class DayInShift {
  @ApiProperty({ example: "2021-11-30T00:00:00.000Z", description: "Ngày làm việc" })
  @IsDateString()
  @IsNotEmpty()
  executionDay: Date;

  @ApiProperty({ type: [ScheduleShiftDetail], description: "Dữ liệu làm việc từng ngày theo ca" })
  @IsArray()
  @IsNotEmpty()
  scheduleShiftDetails: ScheduleShiftDetail[];
}

class WorkInShiftQcPlan {
  @ApiProperty({ type: [DayInShift], description: "Dữ liệu làm việc từng ngày theo ca" })
  @IsArray()
  @IsNotEmpty()
  dayInShift: DayInShift[];
}

export class CreateWorkCenterPlanQcShiftRequestDto extends BaseDto {
  @ApiProperty({ example: 1, description: "ID word order" })
  @Expose()
  @IsNotEmpty()
  workOrderId: number;

  @ApiProperty({ example: 1, description: "ID word center" })
  @Expose()
  @IsNotEmpty()
  workCenterId: number;

  @ApiProperty({ type: WorkInShiftQcPlan, description: "Dữ liệu làm việc từng ngày theo ca" })
  @IsObject()
  @IsNotEmpty()
  workInShiftQcPlan: WorkInShiftQcPlan;

  @IsNotEmpty()
  @IsInt()
  userId: number;
  
  @IsNotEmpty()
  user: any;
}
