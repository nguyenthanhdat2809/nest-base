import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { QualityPointResponseDto } from '@components/quality-point/dto/response/quality-point.response.dto';

export class QualityPointDataResponseDto extends SuccessResponse {
  @ApiProperty({
    example: {
      id: 1,
      name: 'QualityPoint',
      code: 'ABCDE',
      createdAt: '2021-07-14T02:48:36.864Z',
      updatedAt: '2021-07-14T02:48:36.864Z',
    },
  })
  @Expose()
  data: QualityPointResponseDto;
}
