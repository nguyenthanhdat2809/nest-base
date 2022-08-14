import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BaseDto } from "@core/dto/base.dto";

export class ShowCreateErrorReportCauseGroupResponseDto {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  name: string;
}

export class ShowCreateErrorReportErrorGroupResponseDto {
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
  qcRejectQuantity: number;
  @ApiProperty()
  @Expose()
  causeGroupId: number;
}

export class ShowCreateErrorReportReceivedUsersResponseDto {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  username: string;
}

export class ShowCreateErrorReportResponseDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @Type(() => ShowCreateErrorReportErrorGroupResponseDto)
  errorGroups: ShowCreateErrorReportErrorGroupResponseDto[];
  @ApiProperty()
  @Expose()
  @Type(() => ShowCreateErrorReportReceivedUsersResponseDto)
  receivedUsers: ShowCreateErrorReportReceivedUsersResponseDto[];
  @ApiProperty()
  @Expose()
  @Type(() => ShowCreateErrorReportCauseGroupResponseDto)
  causeGroups: ShowCreateErrorReportCauseGroupResponseDto[];
  @ApiProperty()
  @Expose()
  type: number;
  @ApiProperty()
  @Expose()
  itemType: number;
  @ApiProperty()
  @Expose()
  itemId: number;
}
