import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ErrorReportStatus } from '@entities/error-report/error-report.entity';
import { ErrorRepairDetails } from '@components/error-report/dto/request/update-error-reports-after-repair.request.dto';

class ErrorReport {
  @ApiProperty({ example: '1', description: 'Id của PBCL đã update' })
  @Expose()
  id: number;
  @ApiProperty({ example: 'ER123', description: 'Code của PBCL đã update' })
  @Expose()
  code: string;
  @ApiProperty({ example: '0', description: 'Trạng thái của PBCL' })
  @Expose()
  @IsEnum(ErrorReportStatus)
  status: number;
  @ApiProperty()
  @Expose()
  @Type(() => ErrorRepairDetails)
  errorRepairDetails: ErrorRepairDetails[];
}

export class UpdateErrorReportsAfterRepairResponseDto {
  @ApiProperty({
    example: [
      {
        id: 174,
        code: 'ER174',
        status: 3,
        errorRepairDetails: [
          {
            repairItemQuantity: 1,
            errorReportDetailsId: 3,
            actionCategoryId: 1,
          },
          {
            repairItemQuantity: 1,
            errorReportDetailsId: 4,
            actionCategoryId: 1,
          },
        ],
      },
      {
        id: 177,
        code: 'ER177',
        status: 3,
        errorRepairDetails: [
          {
            repairItemQuantity: 1,
            errorReportDetailsId: 5,
            actionCategoryId: 1,
          },
          {
            repairItemQuantity: 1,
            errorReportDetailsId: 6,
            actionCategoryId: 1,
          },
        ],
      },
    ],
  })
  @Expose()
  @Type(() => ErrorReport)
  errorReports: ErrorReport[];
}
