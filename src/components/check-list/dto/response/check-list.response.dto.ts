import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class ErrorGroup {
  @ApiProperty({ description: 'ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Mã' })
  @Expose()
  code: string;

  @ApiProperty({ description: 'Tên' })
  @Expose()
  name: string;
}

class ItemUnit extends ErrorGroup {}

export class CheckListDetailResponseDto {
  @ApiProperty({ example: 1, description: 'Check List Detail ID' })
  @Expose()
  id: number;

  @ApiProperty({ example: 1, description: 'Check List ID' })
  @Expose()
  checkListid: number;

  @ApiProperty({ example: 'Title', description: 'Title' })
  @Expose()
  title: string;

  @ApiProperty({ example: 'Description Content', description: 'Description Content' })
  @Expose()
  descriptionContent: string;

  @ApiProperty({ example: 1, description: 'Check Type' })
  @Expose()
  checkType: number;

  @ApiProperty({ example: 1, description: 'Norm' })
  @Expose()
  norm: number;

  @ApiProperty({ example: 1, description: 'Value Top' })
  @Expose()
  valueTop: number;

  @ApiProperty({ example: 1, description: 'Value Bottom' })
  @Expose()
  valueBottom: number;

  @ApiProperty({ description: 'Đơn vị' })
  @Expose()
  @Type(() => ItemUnit)
  itemUnit: ItemUnit;

  @ApiProperty({ description: 'Loại lỗi' })
  @Expose()
  @Type(() => ErrorGroup)
  errorGroup: ErrorGroup;
}

export class CheckListResponseDto {
  @ApiProperty({ example: 1, description: 'ID' })
  @Expose()
  id: number;

  @ApiProperty({
    example: 'Check List',
    description: 'Name',
  })
  @Expose()
  name: string;

  @ApiProperty({ example: 'ABCDE', description: 'Code' })
  @Expose()
  code: string;

  @ApiProperty({ example: 1, description: 'Status' })
  @Expose()
  status: number;

  @ApiProperty({ example: 'Description', description: 'Description' })
  @Expose()
  description: string;

  @ApiProperty({
    example: [
      {
        'id': 1,
        'title': 'Title',
        'descriptionContent': 'Description Content',
        'checkType': 2,
        'norm': 2,
        'valueTop': 1,
        'valueBottom': 1,
        'errorGroupId': 1,
        'itemUnitId': 6
      },
      {
        'id': 2,
        'title': 'Title',
        'descriptionContent': 'Description Content',
        'checkType': 2,
        'norm': 2,
        'valueTop': 1,
        'valueBottom': 1,
        'errorGroupId': 1,
        'itemUnitId': 6
      },
    ],
    description: 'Check List Detail',
  })
  @Expose()
  @Type(() => CheckListDetailResponseDto)
  checkListDetails: CheckListDetailResponseDto[];

  @ApiProperty({ example: '2021-07-13 09:13:15.562609+00', description: '' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2021-07-13 09:13:15.562609+00', description: '' })
  @Expose()
  updatedAt: Date;
}
