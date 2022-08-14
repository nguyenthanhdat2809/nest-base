import { BaseDto } from "@core/dto/base.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsNotEmpty, IsString } from "class-validator";
import { Expose } from "class-transformer";

export class UpdateWoMaterialInputQcQuantityRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  workOrderId: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  passQuantity: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  rejectQuantity: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  note: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  itemId: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  createdByUserId: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  workCenterId: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsDateString()
  executionDay: Date;
}
