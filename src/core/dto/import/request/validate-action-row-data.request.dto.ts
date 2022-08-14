import { ImportResultDto } from '@core/dto/import/response/import.result.dto';

export class ValidateActionRowDataRequestDto {
  inputAction: string;
  dataRowValues: any;
  totalCount: number;
  colOffset: number;
  importResults: ImportResultDto[];
  importResult: ImportResultDto;
}
