import { PaginationQuery } from '@utils/pagination.query';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { STAGES_OPTION } from '@constant/qc-stage.constant';

export class GetListIoqcWarehouseByOrderRequestDto extends PaginationQuery {
  @ApiPropertyOptional({ example: 3, description: 'Type 0, 2, 3, 5' })
  @IsNotEmpty()
  @IsEnum([
    STAGES_OPTION.PO_IMPORT,
    STAGES_OPTION.PRO_IMPORT,
    STAGES_OPTION.PRO_EXPORT,
    STAGES_OPTION.SO_EXPORT,
  ])
  type: number;

  @ApiPropertyOptional({ example: 1, description: 'ID của Order' })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiPropertyOptional({ description: 'Người được Assign' })
  @IsNotEmpty()
  user: any;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsOptional()
  filterOrderIds: number[];
}
