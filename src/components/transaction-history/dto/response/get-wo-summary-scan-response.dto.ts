import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class ITBom {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  itemUnit: string;
}

class ParentBom {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  @Type(() => ITBom)
  item: ITBom;
}

class Bom {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  @Type(() => ITBom)
  item: ITBom;

  @ApiProperty()
  @Expose()
  @Type(() => ParentBom)
  parentBom: ParentBom;
}

class Routing {
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

class ProducingStep {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  qcQuantityRule: number;

  @ApiProperty()
  @Expose()
  qcCriteriaId: number;

  @ApiProperty()
  @Expose()
  qcCheck: number;

  @ApiProperty()
  @Expose()
  inputQcCheck: number;
}

class PIC {
  @ApiProperty()
  @Expose()
  id: number;

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
  @Type(() => ErrorGroup)
  errorGroup: ErrorGroup;
}

class Mo {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;
}

class WorkCenter {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty({
    example: 100,
    description: 'SL Kế hoạch',
  })
  @Expose()
  totalPlanQuantity: number;

  @ApiProperty({
    example: 100,
    description: 'SL đã sx',
  })
  @Expose()
  actualQuantity: number;

  @ApiProperty({
    example: 100,
    description: 'SL chưa QC',
  })
  @Expose()
  totalUnQcQuantity: number;

  @ApiProperty({
    example: 100,
    description: 'SL đã QC',
  })
  @Expose()
  totalQcQuantity: number;

  @ApiProperty({
    example: 100,
    description: 'SL đã đạt',
  })
  @Expose()
  totalQcPassQuantity: number;

  @ApiProperty({
    example: {
      id: 1,
      username: 'long.nguyenduc',
    },
    description: 'SL chưa QC',
  })
  @ApiProperty()
  @Expose()
  totalQcRejectQuantity: number;

  @ApiProperty()
  @Expose()
  numberOfTime: number;

  @ApiProperty()
  @Expose()
  numberOfTimeQc: number;

  @ApiProperty()
  @Expose()
  @Type(() => Material)
  materials: Material[];

  @ApiProperty()
  @Expose()
  @Type(() => PreviousBom)
  previousBoms: PreviousBom[];
}

class MaterialItem {
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
  itemUnitCode: string;
}

class Material {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  planQuantity: number;

  @ApiProperty()
  @Expose()
  producedQuantity: number;

  @ApiProperty()
  @Expose()
  totalUnQcQuantity: number;

  @ApiProperty()
  @Expose()
  totalImportQuantity: number;

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
  @Type(() => MaterialItem)
  item: MaterialItem[];

  @ApiProperty()
  @Expose()
  @Type(() => CheckListDetail)
  checkListDetails: CheckListDetail[];

  @ApiProperty()
  @Expose()
  qcQuantityRule: number;

  @ApiProperty()
  @Expose()
  criteriaId: number;

  @ApiProperty()
  @Expose()
  numberOfTime: number;

  @ApiProperty()
  @Expose()
  numberOfTimeQc: number;
}

class PreviousBom extends Material {}

export class GetWoSummaryScanResponseDto extends BaseDto {
  @ApiProperty({ example: 1800, description: 'ID lệnh sản xuất' })
  @Expose()
  id: number;

  @ApiProperty({
    example: 'KH01_116_1_3b66ef',
    description: 'Tên lệnh sản xuất',
  })
  @Expose()
  name: string;

  @ApiProperty({ example: 'WO1800', description: 'Mã Lệnh sx' })
  @Expose()
  code: string;

  @ApiProperty({
    example: {
      id: 39,
      code: 'MO1111',
      name: 'Lệnh sản xuất hàng gia dụng',
    },
    description: 'Thông tin lệnh làm việc',
  })
  @Expose()
  @Type(() => Mo)
  mo: Mo;

  @ApiProperty({
    example: {
      id: 116,
      item: {
        id: 49,
        name: 'Ghế',
        itemUnit: 'Cái',
      },
      parentBom: {},
    },
    description: 'Thông tin BOM',
  })
  @Expose()
  @Type(() => Bom)
  bom: Bom;

  @ApiProperty({
    example: {
      id: 1,
      name: 'Quy trình sx số 1',
      code: 'R001',
    },
    description: 'Thông tin quy trình',
  })
  @Expose()
  @Type(() => Routing)
  routing: Routing;

  @ApiProperty({
    example: {
      id: 72,
      name: '0.0.1',
    },
    description: 'Công đoạn',
  })
  @Expose()
  @Type(() => ProducingStep)
  producingStep: ProducingStep;

  @ApiProperty({
    example: '2021-09-25T07:48:48.251Z',
    description: 'Ngày bắt đầu KH',
  })
  @Expose()
  planFrom: Date;

  @ApiProperty({
    example: '2021-09-25T07:48:48.251Z',
    description: 'Ngày kết thúc KH',
  })
  @Expose()
  planTo: Date;

  @ApiProperty({
    example: 100,
    description: 'SL Kế hoạch',
  })
  @Expose()
  totalPlanQuantity: number;

  @ApiProperty({
    example: 100,
    description: 'SL đã sx',
  })
  @Expose()
  actualQuantity: number;

  @ApiProperty({
    example: 100,
    description: 'SL chưa QC',
  })
  @Expose()
  totalUnQcQuantity: number;

  @ApiProperty({
    example: 100,
    description: 'SL đã QC',
  })
  @Expose()
  totalQcQuantity: number;

  @ApiProperty({
    example: 100,
    description: 'SL đã đạt',
  })
  @Expose()
  totalQcPassQuantity: number;

  @ApiProperty({
    example: {
      id: 1,
      username: 'long.nguyenduc',
    },
    description: 'SL chưa QC',
  })
  @ApiProperty()
  @Expose()
  totalQcRejectQuantity: number;

  @Expose()
  @Type(() => PIC)
  pic: PIC;

  @ApiProperty({
    example: [
      {
        id: 175,
        title: 'Check bề mặt ',
        errorGroup: {
          id: 218,
          name: 'Nhóm lỗi 6',
        },
      },
      {
        id: 178,
        title: 'Check1',
        errorGroup: {
          id: 223,
          name: 'Nhóm lỗi 11',
        },
      },
    ],
    description: 'Danh sách check list details tương ứng với lệnh làm việc',
  })
  @Expose()
  @Type(() => CheckListDetail)
  checkListDetails: CheckListDetail[];

  @ApiProperty({
    example: [
      {
        id: 53,
        code: 'ss22',
        name: 'Xưởng CĐ 2',
      },
      {
        id: 54,
        code: 'ss33',
        name: 'Xưởng 3',
      },
      {
        id: 57,
        code: 'QQ1',
        name: 'Xưởng cđ 1',
      },
    ],
    description: 'Danh sách xưởng ứng với work order',
  })
  @Expose()
  @Type(() => WorkCenter)
  workCenters: WorkCenter[];

  @ApiProperty()
  @Expose()
  @Type(() => Material)
  materials: Material[];

  @ApiProperty()
  @Expose()
  @Type(() => PreviousBom)
  previousBoms: PreviousBom[];

  @ApiProperty()
  @Expose()
  lotNumber: string;
}
