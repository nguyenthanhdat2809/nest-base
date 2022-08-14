import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { TypeOrmCoreModule } from "@nestjs/typeorm/dist/typeorm-core.module";

class ErrorGroupResponseDto {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  name: string;
  @ApiProperty()
  @Expose()
  errorItemQuantityRemained: number;
  @ApiProperty()
  @Expose()
  errorReportDetailsId: number;
}
class ErrorReport {
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
  status: number;
  @ApiProperty()
  @Expose()
  @Type(() => ErrorGroupResponseDto)
  errorGroups: ErrorGroupResponseDto[];
}

export class ActionCategoryERResponseDto {
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
export class GetErrorReportDetailByWoResponseDto {
  @ApiProperty()
  @Expose()
  @Type(() => ErrorReport)
  errorReports: ErrorReport[];
  @ApiProperty()
  @Expose()
  @Type(() => ActionCategoryERResponseDto)
  actionCategories: ActionCategoryERResponseDto[];
}