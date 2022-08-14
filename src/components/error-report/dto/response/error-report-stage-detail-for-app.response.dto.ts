import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ErrorReportWorkOrderResponseForApp } from "@components/error-report/dto/response/error-reports-list-for-app.response.dto";
import {
  MaterialItem, PreviousBomItem,
  TransactionHistoryWorkOrderResponse
} from "@components/transaction-history/dto/response/producing-steps-transaction-history.response.dto";
import { IsEnum } from "class-validator";
import { ErrorReportStatus } from "@entities/error-report/error-report.entity";

class PIC {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  username: string;
}

class CauseGroup {
  @ApiProperty()
  @Expose()
  id: string;
  @ApiProperty()
  @Expose()
  name: string;
  @ApiProperty()
  @Expose()
  code: string;
}

class ErrorGroup {
  @ApiProperty()
  @Expose()
  id: string;
  @ApiProperty()
  @Expose()
  name: string;
  @ApiProperty()
  @Expose()
  code: string;
  @ApiProperty()
  @Expose()
  errorItemQuantity: string;
  @ApiProperty()
  @Expose()
  repairItemQuantity: string;
  @ApiProperty()
  @Expose()
  @Type(() => CauseGroup)
  causeGroup: CauseGroup;
}

export class ErrorReportStageDetailForAppResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  transactionHistoryId: number;

  @ApiProperty()
  @Expose()
  priority: number;

  @ApiProperty()
  @Expose()
  @Type(() => PIC)
  receivedByUser: PIC;

  @ApiProperty()
  @Expose()
  errorDescription: string;

  @ApiProperty()
  @Expose()
  repairDeadline: string;

  @ApiProperty()
  @Expose()
  errorGroups: ErrorGroup[];

  @ApiProperty()
  @Expose()
  @Type(() => ErrorReportWorkOrderResponseForApp)
  workOrder: ErrorReportWorkOrderResponseForApp;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  @IsEnum(ErrorReportStatus)
  status: number;

  @ApiProperty()
  @Expose()
  qcStageId: number;

  @ApiProperty()
  @Expose()
  itemType: number;

  @ApiProperty()
  @Expose()
  @Type(() => MaterialItem)
  materialItem: MaterialItem[];

  @ApiProperty()
  @Expose()
  @Type(() => PreviousBomItem)
  previousBomItem: PreviousBomItem[];

  @ApiProperty()
  @Expose()
  lotNumber: string;

  @ApiProperty()
  @Expose()
  qcQuantityRule: number;

  @ApiProperty()
  @Expose()
  numberOfTime: number;

  @ApiProperty()
  @Expose()
  numberOfTimeQc: number;
}
