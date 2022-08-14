import { UpdateErrorReportsAfterRepairRequestDto } from "@components/error-report/dto/request/update-error-reports-after-repair.request.dto";
import { BaseInterfaceRepository } from "@core/repository/base.interface.repository";
import { ErrorReportErrorDetail } from "@entities/error-report/error-report-error-detail.entity";

export interface ErrorReportErrorDetailRepositoryInterface extends BaseInterfaceRepository<ErrorReportErrorDetail> {
  findByCondition(filterCondition: any): Promise<ErrorReportErrorDetail[]>;
}