import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SuccessResponse } from '@utils/success.response.dto';
export class GetDashboardErrorResponseDto extends SuccessResponse {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  quantity: number;

  @ApiProperty()
  @Expose()
  ratio: number;
}
