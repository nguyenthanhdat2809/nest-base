import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, MaxLength, Validate, ValidateNested } from "class-validator";
import { ERROR_REPORT_CONST } from '@constant/entity.constant';
import { Priority } from '@entities/error-report/error-report-error-list.entity';
import { EmojiIconValidate } from "@utils/validator/emoji-icon-validate";
import { CUSTOM_VALIDATOR_CONST } from "@utils/validator/custom-validator.const";
import { TransactionHistoryTypeEnum } from "@components/transaction-history/transaction-history.constant";

export class CreateErrorReportErrorGroupRequestDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  qcRejectQuantity: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  causeGroupId: number;
}

export class CreateErrorReportRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @MaxLength(ERROR_REPORT_CONST.ERROR_REPORT.NAME.MAX_LENGTH)
  @IsNotEmpty()
  @Validate(EmojiIconValidate)
  name: string;

  @ApiProperty()
  @Expose()
  @Type(() => CreateErrorReportErrorGroupRequestDto)
  @ValidateNested()
  errorGroups: CreateErrorReportErrorGroupRequestDto[];

  @ApiProperty()
  @Expose()
  @IsEnum(Priority)
  @IsNotEmpty()
  priority: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  receivedUserId: number;

  @ApiProperty()
  @Expose()
  @MaxLength(
    ERROR_REPORT_CONST.ERROR_REPORT_ERROR_LIST.ERROR_DESCRIPTION.MAX_LENGTH,
  )
  errorDescription: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  createdByUserId: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty()
  @Expose()
  repairDeadline: Date;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  transactionHistoryId: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsEnum(TransactionHistoryTypeEnum)
  qcStageId: number;

  @ApiProperty()
  @Expose()
  @IsOptional()
  itemId: number;
}
