import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';

export class ErrorReportByCommandItemWarehouseRequestDto extends BaseDto {
  @ApiProperty({
    example: 2,
    description: 'Id Công Đoạn',
  })
  @IsNotEmpty()
  @IsNumber()
  qcStageId: number;

  @ApiProperty({
    example: 1,
    description: 'Id Mã Lệnh',
  })
  @IsNotEmpty()
  @IsNumber()
  commandId: number;

  @ApiProperty({
    example: 1,
    description: 'Id Tên Sản Phẩm',
  })
  @IsNotEmpty()
  @IsNumber()
  itemId: number;

  @ApiProperty({
    example: 1,
    description: 'Id Tên Kho',
  })
  @IsNotEmpty()
  @IsNumber()
  warehouseId: number;
}
