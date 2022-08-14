import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { TransactionHistoryLogTimeResponseDto } from "@components/transaction-history/dto/response/transaction-history-log-time.response.dto";
import { TransactionHistoryLogTimeAdditionResponseDto } from "@components/transaction-history/dto/response/transaction-history-log-time-addition.response.dto";

export class UpdateTransactionHistoryLogTimeAdditionResponseDto extends TransactionHistoryLogTimeAdditionResponseDto {}
