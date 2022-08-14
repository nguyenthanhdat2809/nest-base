import { PaginationQuery } from '@utils/pagination.query';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { STAGES_OPTION } from '@constant/qc-stage.constant';

export class GetListQcInputOrderRequestDto extends PaginationQuery {
  @ApiPropertyOptional({ example: 0, description: 'Type 0, 2' })
  @IsNotEmpty()
  @IsEnum([
    STAGES_OPTION.PO_IMPORT,
    STAGES_OPTION.PRO_IMPORT,
  ])
  type: number;

  @ApiPropertyOptional({ example: 0, description: 'Id người thực hiện' })
  @IsNotEmpty()
  @IsNumber()
  createdByUserId: number;

  @ApiPropertyOptional({ description: 'Người được Assign' })
  @IsNotEmpty()
  user: any;
}
