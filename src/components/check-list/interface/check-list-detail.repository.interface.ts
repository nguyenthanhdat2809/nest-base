import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { CheckListDetail } from "@entities/check-list/check-list-detail.entity";

export interface CheckListDetailRepositoryInterface
  extends BaseInterfaceRepository<CheckListDetail> {
  createEntity(data: any): CheckListDetail;
}
