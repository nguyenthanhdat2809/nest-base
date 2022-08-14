import { ImportResultDto } from '@core/dto/import/response/import.result.dto';
import { Expose, Type } from 'class-transformer';

export class QualityPointUserResponseDto {
  @Expose()
  id: number;

  @Expose()
  username: number;
}

export class QualityPointImportResultDto extends ImportResultDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  status: number;

  @Expose()
  itemId: number;

  @Expose()
  stage: number;

  @Expose()
  qcStageName: string;

  @Expose()
  username: string;

  @Expose()
  checkListId: number;

  @Expose()
  formality: number;

  @Expose()
  numberOfTime: number;

  @Expose()
  quantity: number;

  @Expose()
  errorAcceptanceRate: number;

  @Expose()
  description: string;

  @Expose()
  @Type(() => QualityPointUserResponseDto)
  qualityPointUser1s: QualityPointUserResponseDto[];

  @Expose()
  @Type(() => QualityPointUserResponseDto)
  qualityPointUser2s: QualityPointUserResponseDto[];
}
