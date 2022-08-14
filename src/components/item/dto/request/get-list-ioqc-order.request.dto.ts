import { PaginationQuery } from '@utils/pagination.query';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { STAGES_OPTION } from '@constant/qc-stage.constant';

export class GetListIoqcOrderRequestDto extends PaginationQuery {
  @ApiPropertyOptional({ example: 3, description: 'Type 0, 2, 3, 5' })
  @IsNotEmpty()
  @IsEnum([
    STAGES_OPTION.PO_IMPORT,
    STAGES_OPTION.PRO_IMPORT,
    STAGES_OPTION.PRO_EXPORT,
    STAGES_OPTION.SO_EXPORT,
  ])
  type: number;

  @ApiPropertyOptional({ example: 0, description: 'Id người thực hiện' })
  @IsNotEmpty()
  @IsNumber()
  createdByUserId: number;
  
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiPropertyOptional({ description: 'Người được Assign' })
  @IsNotEmpty()
  user: any;

  @IsOptional()
  filterOrderIds: number[];
}
