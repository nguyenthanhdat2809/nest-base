import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

class ProduceStepQcLogTimeAddition {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  startTime: Date;
  @ApiProperty()
  @Expose()
  endTime: Date;
  @ApiProperty()
  @Expose()
  duration: number;
}
export class GetProduceStepQcLogTimeDetailResponseDto {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  startTime: Date;
  @ApiProperty()
  @Expose()
  endTime: Date;
  @ApiProperty()
  @Expose()
  playTime: Date;
  @ApiProperty()
  @Expose()
  currentDuration: number;
  @ApiProperty()
  @Expose()
  totalDuration: number;
  @ApiProperty()
  @Expose()
  transactionHistoryId: number;
  @ApiProperty()
  @Expose()
  status: number;
  @ApiProperty()
  @Expose()
  type: number;
  @ApiProperty()
  @Expose()
  @Type(() => ProduceStepQcLogTimeAddition)
  logTimeAdditions: ProduceStepQcLogTimeAddition;
}
