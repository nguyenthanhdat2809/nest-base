import {
  ProducingStepsTransactionHistoryResponseDto,
  TransactionHistoryWorkOrderResponse,
} from '@components/transaction-history/dto/response/producing-steps-transaction-history.response.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PIC {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  fullname: string;
  @ApiProperty()
  @Expose()
  username: string;
}

class ErrorGroup {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  name: string;
}
class CheckListDetail {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  title: string;
  @ApiProperty()
  @Expose()
  qcPassQuantity: number;
  @ApiProperty()
  @Expose()
  qcRejectQuantity: number;
  @ApiProperty()
  @Expose()
  @Type(() => ErrorGroup)
  errorGroup: ErrorGroup;
}

export class TransactionHistoryWorkOrderDetailResponse extends TransactionHistoryWorkOrderResponse {
  @ApiProperty()
  @Expose()
  planFrom: Date;

  @ApiProperty()
  @Expose()
  planTo: Date;

  @ApiProperty()
  @Expose()
  totalPlanQuantity: number;

  @ApiProperty()
  @Expose()
  actualQuantity: number;

  @ApiProperty()
  @Expose()
  totalUnQcQuantity: number;

  @ApiProperty()
  @Expose()
  totalQcQuantity: number;

  @ApiProperty()
  @Expose()
  totalQcPassQuantity: number;
}

export class ProducingStepsTransactionHistoryDetailResponseDto extends ProducingStepsTransactionHistoryResponseDto {
  @ApiProperty()
  @Expose()
  qcPassQuantity: number;

  @ApiProperty()
  @Expose()
  qcRejectQuantity: number;

  @ApiProperty()
  @Expose()
  @Type(() => PIC)
  pic: PIC;

  @ApiProperty()
  @Expose()
  @Type(() => CheckListDetail)
  checkListDetails: CheckListDetail[];

  @ApiProperty()
  @Expose()
  @Type(() => TransactionHistoryWorkOrderDetailResponse)
  workOrder: TransactionHistoryWorkOrderDetailResponse;

  @ApiProperty()
  @Expose()
  note: string;

  @ApiProperty()
  @Expose()
  itemType: number;

  @ApiProperty()
  @Expose()
  totalPlanQuantity: number;

  @ApiProperty()
  @Expose()
  producedQuantity: number;

  @ApiProperty()
  @Expose()
  totalUnQcQuantity: number;

  @ApiProperty()
  @Expose()
  totalQcRejectQuantity: number;

  @ApiProperty()
  @Expose()
  totalQcPassQuantity: number;

  @ApiProperty()
  @Expose()
  totalQcQuantity: number;

  @ApiProperty()
  @Expose()
  lotNumber: string;

  @ApiProperty()
  @Expose()
  qcQuantityRule: number;

  @ApiProperty()
  @Expose()
  consignmentNamne: string;

  @ApiProperty()
  @Expose()
  formality: string;

  @ApiProperty()
  @Expose()
  qcStageName: string;

  @ApiProperty()
  @Expose()
  errorReportCode: string;

  @ApiProperty()
  @Expose()
  errorReportName: string;

  @ApiProperty()
  @Expose()
  errorReportId: number;

  @ApiProperty()
  @Expose()
  numberOfTime: number;

  @ApiProperty()
  @Expose()
  numberOfTimeQc: number;
}
