import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseCauseGroupResponseDto } from '@components/cause-group/dto/response/base.cause-group.response.dto';
import { BaseErrorGroupResponseDto } from '@components/error-group/dto/response/base.error-group.response.dto';

export class ErrorReportErrorDetailResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  errorGroup: BaseErrorGroupResponseDto;

  @ApiProperty()
  @Expose()
  causeGroup: BaseCauseGroupResponseDto;

  @ApiProperty()
  @Expose()
  errorItemQuantity: number;
}
