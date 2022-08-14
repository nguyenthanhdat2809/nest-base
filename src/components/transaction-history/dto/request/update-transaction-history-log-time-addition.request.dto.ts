import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { Expose } from "class-transformer";
import { BaseDto } from "@core/dto/base.dto";

export class UpdateTransactionHistoryLogTimeAdditionRequestDto extends BaseDto {
  @ApiProperty({
    example: 1,
    description: 'Id của log time',
  })
  @IsInt()
  @IsNotEmpty()
  logTimeId: number;

  @ApiProperty({
    example: 1,
    description: 'Id của log time addition',
  })
  @IsInt()
  @IsNotEmpty()
  logTimeAdditionId: number;

  @ApiProperty({ example: '2021-10-30T17:11:02.755Z', description: 'Bắt đầu' })
  @Expose()
  @IsOptional()
  start: Date;

  @ApiProperty({ example: '2021-10-30T17:11:02.755Z', description: 'Kết thúc' })
  @Expose()
  @IsOptional()
  end: Date;
}