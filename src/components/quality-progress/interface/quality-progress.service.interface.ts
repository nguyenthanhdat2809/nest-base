import { UpdateQcProgressRequestDto } from '@components/quality-progress/dto/request/update-qc-progress.request.dto';
import { ResponsePayload } from '@utils/response-payload';
import { TransactionHistoryTypeEnum } from '@components/transaction-history/transaction-history.constant';
import { QcProgressScanQrRequestDto } from '@components/quality-progress/dto/request/qc-progress-scan-qr.request.dto';

export interface QualityProgressServiceInterface {
  scanQRCode(
    request: QcProgressScanQrRequestDto,
    unCheckUser?: boolean,
  ): Promise<ResponsePayload<any>>;
  update(
    request: UpdateQcProgressRequestDto,
    type: TransactionHistoryTypeEnum,
  ): Promise<ResponsePayload<any>>;
}
