import { PaginationQuery } from '@utils/pagination.query';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber } from "class-validator";
import { STAGES_OPTION } from '@constant/qc-stage.constant';

export class GetListIoqcItemByWarehouseAndOrderRequestDto extends PaginationQuery {
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
  orderId: number;

  @ApiPropertyOptional({ example: 1, description: 'ID của Warehouse' })
  @IsNotEmpty()
  @IsNumber()
  warehouseId: number;

  @ApiPropertyOptional({ description: 'Người được Assign' })
  @IsNotEmpty()
  user: any;
  
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
