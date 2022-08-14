import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsObject,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  IsDateString,
} from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { BaseCheckListDetailRequestDto } from "@components/transaction-history/dto/request/base-check-list-detail.request.dto";

class TransactionDetailCheckListDto extends BaseCheckListDetailRequestDto {
  @ApiProperty({
    description: 'Id chi tiết danh sách kiểm tra',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  checkListDetailId: number;

  @ApiProperty({
    description: 'SL đạt theo chi tiết danh sách kiểm tra',
    example: 5,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  qcPassQuantity: number;

  @ApiProperty({
    description: 'SL lỗi theo chi tiết danh sách kiểm tra',
    example: 10,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  qcRejectQuantity: number;
}

class TransactionHistoryIOqcDto {
  @ApiProperty({
    description: 'Id Transaction',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  transactionHistoryId: number;

  @ApiProperty({
    description: 'Tổng số lượng kế hoạch cần trong mã lệnh',
    example: 5,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  planQuantity: number;

  @ApiProperty({
    description: 'Tổng số lượng cần trong mã lệnh',
    example: 5,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  qcNeedTotalQuantity: number;

  @ApiProperty({
    description: 'Tổng số lượng đã qc trong mã lệnh',
    example: 5,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  qcDoneTotalQuantity: number;

  @ApiProperty({
    description: 'Tổng số lượng đã đạt trong mã lệnh',
    example: 5,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  qcPassTotalQuantity: number;

  @ApiProperty({
    description: 'Tổng số lượng đã lỗi trong mã lệnh',
    example: 10,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  qcRejectTotalQuantity: number;

  @ApiProperty({
    description: 'Tổng số lượng nhập trong mã lệnh',
    example: 10,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  actualQuantity: number;
}

export class UpdateQcProgressRequestDto extends BaseDto {
  @ApiProperty({
    example: 2,
    description: 'QC 2 lần or 1 lần'
  })
  @IsNotEmpty()
  @IsInt()
  numberOfTime: number;

  @ApiProperty({
    example: 1,
    description: 'Lần QC thứ 1 or 2'
  })
  @IsNotEmpty()
  @IsInt()
  numberOfTimeQc: number;

  @ApiProperty({
    description: 'Id lệnh PO / SO',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  orderId: number;

  @ApiProperty({
    description: 'Id sản phẩm',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  itemId: number;

  @ApiProperty({
    description: 'Id kho',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  warehouseId: number;

  @ApiProperty({
    description: 'Id user tạo',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  createdByUserId: number;

  @ApiProperty({
    description: 'Số lượng QC',
    example: 100,
  })
  @IsInt()
  @IsNotEmpty()
  qcQuantity: number;

  @ApiProperty({
    description: 'SL đạt',
    example: 5,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  qcPassQuantity: number;

  @ApiProperty({
    description: 'SL lỗi',
    example: 10,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  qcRejectQuantity: number;

  @ApiProperty({
    description: 'Chú ý',
    example: 'Lỗi phần gỗ, cần xem lại',
  })
  @IsString()
  @IsOptional()
  note: string;

  @ApiProperty({
    description: 'Số lô',
    example: 'Lô số 1',
  })
  @IsString()
  @IsNotEmpty()
  consignmentName: string;

  @ApiProperty({
    description: 'Id tiêu chí',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  qcCriteriaId: number;

  @ApiProperty({ type: [TransactionDetailCheckListDto] })
  @IsArray()
  @IsNotEmpty()
  transactionHistoryCheckListDetails: TransactionDetailCheckListDto[];

  @ApiProperty({ type: TransactionHistoryIOqcDto })
  @IsObject()
  @IsNotEmpty()
  transactionHistoryIOqc: TransactionHistoryIOqcDto;
  
  @IsNotEmpty()
  user: any;
}
