import {ApiProperty} from '@nestjs/swagger';
import {Expose, Type} from 'class-transformer';
import {ErrorReportErrorDetailResponseDto} from "@components/error-report/dto/response/error-report-error-detail.response.dto";

class ErrorDetailResponseDto {
  @ApiProperty({ example: '1', description: 'Mã phiếu' })
  @Expose()
  code: string;

  @ApiProperty({ example: 'abc123', description: 'Tên phiếu' })
  @Expose()
  name: string;

  @ApiProperty({ example: 1, description: 'Độ ưu tiên' })
  @Expose()
  priority: number;

  @ApiProperty({ example: 'User2', description: 'Người nhận' })
  @Expose()
  receiverUser: any;

  @ApiProperty({ example: 'User2', description: 'Người nhận' })
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  errorReportErrorDetails: ErrorReportErrorDetailResponseDto[]
}


export class DetailErrorReportResponseDto {
  @ApiProperty({ example: 'ER0001', description: 'ID' })
  @Expose()
  id: string;

  @ApiProperty({ example: 0, description: 'Trạng thái' })
  @Expose()
  status: number;

  @ApiProperty({ example: 'ER0001', description: 'Mã phiếu' })
  @Expose()
  codeErrorReport: string;

  @ApiProperty({ example: 'P00001', description: 'Mã lệnh' })
  @Expose()
  orderCode: string;

  @ApiProperty({ example: 'Qc toàn phần', description: 'Hình thức Qc' })
  @Expose()
  formality: string;

  @ApiProperty({ example: '0001', description: 'Số lô' })
  @Expose()
  consignmentName: string;

  @ApiProperty({ example: 'Kho AAA', description: 'Tên kho' })
  @Expose()
  wareHouseName: string;

  @ApiProperty({ example: '020001', description: 'Mã sản phẩm' })
  @Expose()
  productCode: string;

  @ApiProperty({ example: 'CaFe G7', description: 'Tên sản phẩm' })
  @Expose()
  productName: string;

  @ApiProperty({ example: '15/12/1992', description: 'Ngày thực hiện' })
  @Expose()
  datetimeCreate: Date;

  @ApiProperty({ example: '15/12/1992', description: 'Kỳ hạn sửa' })
  @Expose()
  repairDeadline: Date;

  @ApiProperty({ example: 'Mr A', description: 'Người thực hiện' })
  @Expose()
  userCreate: string;

  @ApiProperty({ example: 'Mr A', description: 'Khách hàng hoặc Nhà cung cấp' })
  @Expose()
  customerOrvendor: string;

  @ApiProperty({
    example: [
    {
      id: 213,
      name: 'Nhóm lỗi 1',
      errorReportDetailsId: 52,
      errorItemQuantityRemained: 99,
    },
    {
      id: 221,
      name: 'Nhóm lỗi 9',
      errorReportDetailsId: 53,
      errorItemQuantityRemained: 99,
    },
    ],
    description: 'Chi tiết các nhóm lỗi',
  })
  @Expose()
  detail: ErrorDetailResponseDto

  @ApiProperty({ example: 2, description: 'Số lần cần QC' })
  @Expose()
  numberOfTime: number;

  @ApiProperty({ example: 1, description: 'Lần QC thứ mấy' })
  @Expose()
  numberOfTimeQc: number;
}
