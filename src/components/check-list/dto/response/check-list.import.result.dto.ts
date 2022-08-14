import { ImportResultDto } from '@core/dto/import/response/import.result.dto';
import { CheckListDetailResponseDto } from '@components/check-list/dto/response/check-list.response.dto';

export class CheckListImportResultDto extends ImportResultDto {
  code: string;
  name: string;
  description: string;
  checkListDetails: CheckListDetailResponseDto[];
}
