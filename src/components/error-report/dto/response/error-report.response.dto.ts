import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from "class-transformer";
import {
  MaterialItem,
  PreviousBomItem
} from "@components/transaction-history/dto/response/producing-steps-transaction-history.response.dto";

export class ErrorReportResponseDto {
  @ApiProperty({ example: 1, description: 'ID of the error report' })
  @Expose()
  id: number;

  @ApiProperty({
    example: 'ERreport1',
    description: 'Code of the error report',
  })
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  transactionHistoryCode: string;

  @ApiProperty()
  @Expose()
  orderCode: string;

  @ApiProperty()
  @Expose()
  orderName: string;

  @ApiProperty({
    example: 'Error report 1',
    description: 'Name of the error report',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'Error report',
    description: 'Description of the error report',
  })
  @Expose()
  qcStageId: number;

  @ApiProperty({
    example: 'Error report',
    description: 'Description of the error report',
  })
  @Expose()
  qcStageName: string;

  @ApiProperty({
    example: '2021-07-13 09:13:15.562609+00',
    description: 'Date created the error report',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: '2021-07-13 09:13:15.562609+00',
    description: 'Date updated the error report',
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    example: '2021-07-13 09:13:15.562609+00',
    description: 'Name of the user created the error report',
  })
  @Expose()
  createdBy: string;

  @ApiProperty({
    example: '2021-07-13 09:13:15.562609+00',
    description: 'Status of the error report',
  })
  @Expose()
  status: string;

  @ApiProperty()
  @Expose()
  textStatus: string;

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
}
export class ErrorReportOnlyIdAndNameResponseDto {
  @ApiProperty({ example: 1, description: 'ID of the error report' })
  @Expose()
  id: number;

  @ApiProperty({
    example: 'Error report 1',
    description: 'Name of the error report',
  })
  @Expose()
  name: string;
}
