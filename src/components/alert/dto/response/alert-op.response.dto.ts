import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AlertOpResponseDto {
  @ApiProperty({ example: 1, description: 'Id của thông báo' })
  @Expose()
  id: number;

  @ApiProperty({ example: '00001', description: 'Mã thông báo' })
  @Expose()
  code: string;

  @ApiProperty({ example: 'Thông báo 1', description: 'Tên thông báo', })
  @Expose()
  name: string;

  @ApiProperty({ example: 'Mô tả', description: 'Mô tả', })
  @Expose()
  description: string;

  @ApiProperty({ example: 1, description: 'Công đoạn QC', })
  @Expose()
  stage: number;

  @ApiProperty({ example: 0, description: 'Trạng thái', })
  @Expose()
  status: number;

  @ApiProperty({ example: 1, description: 'Tên sản phẩm', })
  @Expose()
  itemId: number;

  @ApiProperty({ example: 1, description: 'QC công đoạn sản xuất', })
  @Expose()
  typeAlert: number;

  @ApiProperty({ example: 1, description: 'Người người tạo', })
  @Expose()
  userId: number;

  @ApiProperty({ example: 1, description: 'Lệnh sản xuất', })
  @Expose()
  manufacturingOrderId: number;

  @ApiProperty({ example: 1, description: 'Tên quy trình', })
  @Expose()
  routingId: number;

  @ApiProperty({ example: 1, description: 'Công đoạn sản xuất', })
  @Expose()
  producingStepId: number;

  @ApiProperty({ example: 1, description: 'Loại sản phẩm', })
  @Expose()
  productType: number;

  @ApiProperty({ example: '2021-07-13 09:13:15.562609+00', description: '' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2021-07-13 09:13:15.562609+00', description: '' })
  @Expose()
  updatedAt: Date;
}
