import { ImportResultDto } from '@core/dto/import/response/import.result.dto';

export class ErrorGroupImportResultDto extends ImportResultDto {
  code: string;
  name: string;
  description: string;
}
