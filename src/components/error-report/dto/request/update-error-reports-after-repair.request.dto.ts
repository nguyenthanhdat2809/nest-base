import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BaseDto } from '@core/dto/base.dto';
import { IsInt, IsNotEmpty, validate, ValidateNested } from 'class-validator';

export class ErrorRepairDetails {
  @ApiProperty({ example: '1', description: 'Số lượng đã sửa lỗi' })
  @Expose()
  @IsNotEmpty()
  repairItemQuantity: number;
  @ApiProperty({ example: '1', description: 'Id của Details PBCL' })
  @Expose()
  errorReportDetailsId: number;
  @ApiProperty({ example: '1', description: 'Id của đối sách' })
  @Expose()
  actionCategoryId: number;
}

class ErrorReport {
  @ApiProperty({ example: '1', description: 'Id của PBCL' })
  @Expose()
  id: number;
  @ApiProperty({
    example: [
      {
        errorReportDetailsId: 1,
        repairItemQuantity: 1,
        actionCategoryId: 1,
      },
      {
        errorReportDetailsId: 2,
        repairItemQuantity: 2,
        actionCategoryId: 2,
      },
    ],
    description: 'Chi tiết của việc sửa lỗi từ PBCL',
  })
  @Expose()
  @Type(() => ErrorRepairDetails)
  @ValidateNested()
  errorRepairDetails: ErrorRepairDetails[];
}

export class UpdateErrorReportsAfterRepairRequestDto extends BaseDto {
  @ApiProperty({
    description: 'Thông tin các PBCL cần update',
    example: [
      {
        id: 174,
        errorRepairDetails: [
          {
            errorReportDetailsId: 3,
            repairItemQuantity: 1,
            actionCategoryId: 1,
          },
          {
            errorReportDetailsId: 4,
            repairItemQuantity: 1,
            actionCategoryId: 1,
          },
        ],
      },
      {
        id: 177,
        errorRepairDetails: [
          {
            errorReportDetailsId: 5,
            repairItemQuantity: 1,
            actionCategoryId: 1,
          },
          {
            errorReportDetailsId: 6,
            repairItemQuantity: 1,
            actionCategoryId: 1,
          },
        ],
      },
    ],
  })
  @Expose()
  @Type(() => ErrorReport)
  @ValidateNested()
  errorReports: ErrorReport[];
}
