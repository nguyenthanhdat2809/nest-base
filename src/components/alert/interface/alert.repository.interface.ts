import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { Alert } from '@entities/alert/alert.entity';
import { AlertRelatedUser } from '@entities/alert/alert-related-user.entity';
import { AlertRequestDto } from '@components/alert/dto/request/alert.request.dto';
import { GetListAlertRequestDto } from '@components/alert/dto/request/get-list-alert.request.dto';

export interface AlertRepositoryInterface
  extends BaseInterfaceRepository<Alert> {
  getList(
    request: GetListAlertRequestDto,
    filterStageSearch: any,
    filterUserSearch: any,
  );
  getDetail(id: number, typeAlert: number): Promise<any>;
  getExistedRecord(id: number, alertDto: AlertRequestDto): Promise<Alert>;
  createEntity(alertDto: AlertRequestDto): Alert;
  createAlertRelatedUserEntity(
    alertId: number,
    userId: number,
  ): AlertRelatedUser;
}
