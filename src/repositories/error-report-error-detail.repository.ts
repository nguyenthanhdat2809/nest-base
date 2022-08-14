import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { ErrorReport } from '@entities/error-report/error-report.entity';
import { ErrorReportRepositoryInterface } from '@components/error-report/interface/error-report.repository.interface';
import { ErrorReportErrorDetail } from '@entities/error-report/error-report-error-detail.entity';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { ERROR_REPORT_CONST } from '@constant/entity.constant';
import { ErrorReportErrorDetailRepositoryInterface } from '@components/error-report/interface/error-report-error-detail.repository.interface';
import { UpdateErrorReportsAfterRepairRequestDto } from '@components/error-report/dto/request/update-error-reports-after-repair.request.dto';

export class ErrorReportErrorDetailRepository
  extends BaseAbstractRepository<ErrorReportErrorDetail>
  implements ErrorReportErrorDetailRepositoryInterface
{
  constructor(
    @InjectRepository(ErrorReportErrorDetail)
    private readonly errorReportErrorDetailRepository: Repository<ErrorReportErrorDetail>,

    @InjectConnection()
    private readonly connection: Connection,

    private readonly i18n: I18nService,
  ) {
    super(errorReportErrorDetailRepository);
  }
}
