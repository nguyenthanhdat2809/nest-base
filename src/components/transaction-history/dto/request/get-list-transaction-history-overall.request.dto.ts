import { PaginationQuery } from '@utils/pagination.query';
import { IsNotEmpty } from "class-validator";

export class GetListTransactionHistoryOverallRequestDto extends PaginationQuery {
  @IsNotEmpty()
  user: any;
}