import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ErrorReportResponseDto } from '@components/error-report/dto/response/error-report.response.dto';

class ITBom {
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
  itemUnitCode: string;

  @ApiProperty()
  @Expose()
  itemUnitName: string;

  @ApiProperty()
  @Expose()
  itemUnit: string;
}

class BomAbstract {
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
  itemId: number;

  @ApiProperty()
  @Expose()
  itemCode: string;

  @ApiProperty()
  @Expose()
  itemName: string;

  @ApiProperty()
  @Expose()
  itemUnitId: number;

  @ApiProperty()
  @Expose()
  @Type(() => ITBom)
  item: ITBom;
}

class ProducingStep {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;
}

class Mo {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;
}

class ParentBom extends BomAbstract {}

class Bom extends BomAbstract {
  @ApiProperty()
  @Expose()
  @Type(() => ParentBom)
  parentBom: ParentBom;
}

class WorkCenter {
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

export class TransactionHistoryWorkOrderResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  @Type(() => Mo)
  mo: Mo;

  @ApiProperty()
  @Expose()
  @Type(() => Bom)
  bom: Bom;

  @ApiProperty()
  @Expose()
  @Type(() => ProducingStep)
  producingStep: ProducingStep;

  @ApiProperty()
  @Expose()
  @Type(() => WorkCenter)
  workCenters: WorkCenter[];
}

export class MaterialItem {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;
}

export class PreviousBomItem {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;
}

export class ProducingStepsTransactionHistoryResponseDto {
  @ApiProperty({ example: 1, description: 'Id giao d???ch' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'GD1234', description: 'M?? giao d???ch' })
  @Expose()
  code: string;

  @ApiProperty({
    example: '2021-10-13T04:25:58.692Z',
    description: 'Ng??y t???o giao d???ch',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: {
      id: 1799,
      code: 'WO1799',
      name: 'KH01_116_1_c8c4d6',
      mo: {
        id: 39,
        name: 'L???nh s???n xu???t h??ng gia d???ng',
        code: 'MO1111',
      },
      bom: {
        id: 115,
        name: '03- BOM ch??n gh???',
        code: 'BOM12',
        itemId: 47,
        itemCode: '0266565',
        itemName: 'Ch??n gh???',
        itemUnitId: 11,
        parentBom: {
          id: 116,
          name: '03- bom SP gH??? ',
          code: 'BOMp',
          itemId: 49,
          itemName: 'Gh???',
          itemUnitId: 11,
        },
      },
      producingStep: {
        id: 105,
        name: 'C??ng ??o???n 1 ph???n',
      },
    },
    description: 'Chi ti???t l???nh l??m vi???c',
  })
  @Expose()
  @Type(() => TransactionHistoryWorkOrderResponse)
  workOrder: TransactionHistoryWorkOrderResponse;

  @ApiProperty({
    example: {
      id: 29,
      code: 'ER29',
      name: '171121',
    },
    description: 'Phi???u BCL',
  })
  @Expose()
  @Type(() => ErrorReportResponseDto)
  errorReport: ErrorReportResponseDto;

  @ApiProperty()
  @Expose()
  type: number;

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
  consignmentName: string;

  @ApiProperty()
  @Expose()
  moName: string;

  @ApiProperty()
  @Expose()
  bomName: string;

  @ApiProperty()
  @Expose()
  parentBomName: string;

  @ApiProperty()
  @Expose()
  producingStepName: string;

  @ApiProperty()
  @Expose()
  errorReportName: string;

  @ApiProperty()
  @Expose()
  errorReportCode: string;

  @ApiProperty()
  @Expose()
  numberOfTime: number;

  @ApiProperty()
  @Expose()
  numberOfTimeQc: number;

  @ApiProperty()
  @Expose()
  numberOfTimeSearch: string;
}
