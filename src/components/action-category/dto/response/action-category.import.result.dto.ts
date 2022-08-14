import { ImportResultDto } from '@core/dto/import/response/import.result.dto';

export class ActionCategoryImportResultDto extends ImportResultDto {
  code: string;
  name: string;
  description: string;
}
