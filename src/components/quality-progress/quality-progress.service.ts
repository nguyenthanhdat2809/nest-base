import { Inject, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { UserService } from '@components/user/user.service';
import { ProduceService } from '@components/produce/produce.service';
import { CheckListRepositoryInterface } from '@components/check-list/interface/check-list.repository.interface';
import { QualityProgressServiceInterface } from '@components/quality-progress/interface/quality-progress.service.interface';
import { ResponsePayload } from '@utils/response-payload';
import { UpdateQcProgressRequestDto } from '@components/quality-progress/dto/request/update-qc-progress.request.dto';
import { TransactionHistoryRepositoryInterface } from '@components/transaction-history/interface/transaction-history.repository.interface';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { TransactionHistoryTypeEnum } from '@components/transaction-history/transaction-history.constant';
import { QcProgressScanQrRequestDto } from '@components/quality-progress/dto/request/qc-progress-scan-qr.request.dto';
import { ItemBarcodeTypeEnum } from '@components/item/item.constant';
import { ItemServiceInterface } from '@components/item/interface/item.service.interface';
import { QualityPointServiceInterface } from '@components/quality-point/interface/quality-point.service.interface';
import {
  checkUserRoleSettings,
  extractWorkOrderIdFromQrCode,
  plus,
  validateInputQcQuantity,
} from '@utils/common';
import {
  QualityProgressDto,
  InputQcProgressScanQrResponseDto,
} from '@components/quality-progress/dto/response/input-qc-progress-scan-qr-response.dto';
import { QualityPlanIOqcRepositoryInterface } from '@components/quality-plan/interface/quality-plan-ioqc.repository.interface';
import { ApiError } from '@utils/api.error';
import { isEmpty, map, uniq } from 'lodash';
import { ErrorReportRepositoryInterface } from '@components/error-report/interface/error-report.repository.interface';
import { QualityPointRepositoryInterface } from '@components/quality-point/interface/quality-point.repository.interface';
import { QUALITY_POINT_FORMALITY } from '@components/quality-point/quality-point.constant';
import { QCPlanStatus } from '@entities/quality-plan/quality-plan.entity';
import { QualityPlanRepositoryInterface } from '@components/quality-plan/interface/quality-plan.repository.interface';
import { STAGES_OPTION } from '@constant/qc-stage.constant';
import { NumberOfTime } from "@entities/quality-point/quality-point.entity";
import { userIOqcNumberOfTimeQc } from "@entities/quality-plan/quality-plan-ioqc-quality-point-user.entity";
import { TransactionHistoryNumberOfTimeQc } from "@entities/transaction-history/transaction-history.entity";

@Injectable()
export class QualityProgressService implements QualityProgressServiceInterface {
  constructor(
    @Inject('UserServiceInterface')
    private readonly userService: UserService,

    @Inject('ItemServiceInterface')
    private readonly itemService: ItemServiceInterface,

    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceService,

    @Inject('QualityPointServiceInterface')
    private readonly qualityPointService: QualityPointServiceInterface,

    @Inject('CheckListRepositoryInterface')
    private readonly checkListRepository: CheckListRepositoryInterface,

    @Inject('TransactionHistoryRepositoryInterface')
    private readonly transactionHistoryRepository: TransactionHistoryRepositoryInterface,

    @Inject('QualityPlanIOqcRepositoryInterface')
    private readonly qualityPlanIOqcRepository: QualityPlanIOqcRepositoryInterface,

    @Inject('ErrorReportRepositoryInterface')
    private readonly errorReportRepository: ErrorReportRepositoryInterface,

    @Inject('QualityPointRepositoryInterface')
    private readonly qualityPointRepository: QualityPointRepositoryInterface,

    @Inject('QualityPlanRepositoryInterface')
    private readonly qualityPlanRepository: QualityPlanRepositoryInterface,

    private readonly i18n: I18nService,
  ) {}

  public async scanQRCode(
    request: QcProgressScanQrRequestDto,
    unCheckUser?: boolean,
  ): Promise<ResponsePayload<any>> {
    const { type, qcStageId, orderId, warehouseId, qrCode, user } = request;
    // Check Qc plans by user
    const qcPlans = await this.qualityPlanRepository.findIoQcPlanByUser(
      request.userId,
      qcStageId,
    );

    if (isEmpty(qcPlans) && !unCheckUser) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(
          await this.i18n.translate('error.IO_QC_PLAN_USER_ASSIGN_NOT_FOUND'),
        )
        .build();
    }

    // ITEM
    let filterItemIds = [];
    let dataFilterItems;
    if (!isEmpty(qrCode)) {
      const params = {
        isGetAll: '1',
        user: user,
        filter: [
          {
            column: 'code',
            text: qrCode,
          },
        ],
      };

      dataFilterItems = await this.itemService.getItemByConditions(params);

      if (isEmpty(dataFilterItems)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(await this.i18n.translate('error.ITEM_NOT_CREATED_PLAN'))
          .build();
      }

      filterItemIds = dataFilterItems.map((item) => item.id);
    }
    const itemId = filterItemIds[0];

    // Kiểm tra sản phẩm đã được tạo plan qc chưa ?
    const qualityPlanIOqc =
      await this.qualityPlanIOqcRepository.findQualityPlanIOqcByQc(
        qcStageId,
        orderId,
        warehouseId,
        itemId,
      );

    if (!qualityPlanIOqc) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.ITEM_NOT_CREATED_PLAN'))
        .build();
    }

    if (qualityPlanIOqc?.qualityPlan?.status == QCPlanStatus.Awaiting) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.QUALITY_PLAN_UNCONFIRMED'),
        )
        .build();
    }

    // User đang đăng nhập là user thực hiện qc lần mấy
    let numberOfTimeUserQc: any;
    if(!unCheckUser){
      const qualityPlanIOqcDetail = qualityPlanIOqc?.qualityPlanIOqcDetails ? qualityPlanIOqc?.qualityPlanIOqcDetails[0] : null;
      const users = qualityPlanIOqcDetail ? qualityPlanIOqcDetail.qualityPlanIOqcQualityPointUsers : [];
      numberOfTimeUserQc = users.find((x) => x?.userId == user?.id)?.numberOfTimeQc;

      if (
        numberOfTimeUserQc != userIOqcNumberOfTimeQc.theFirstTime
        && numberOfTimeUserQc != userIOqcNumberOfTimeQc.theSecondTime
      ) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(
            await this.i18n.translate(
              'error.USER_NOT_QC',
            ),
          )
          .build();
      }
    }

    const qrScanRequest = {
      type: type,
      qrCode: qrCode,
      warehouseId: warehouseId,
      user: user,
    };

    switch (type) {
      case ItemBarcodeTypeEnum.PO:
        qrScanRequest['poId'] = orderId;
        break;
      case ItemBarcodeTypeEnum.SO:
        qrScanRequest['soId'] = orderId;
        break;
      case ItemBarcodeTypeEnum.PRO:
        qrScanRequest['proId'] = orderId;
        break;
      default:
        break;
    }

    const response = new ResponseBuilder();
    const scanResponse = await this.itemService.scanQRCode(qrScanRequest);
    const scanResponseData = scanResponse.data;
    if (!scanResponseData) return scanResponse;

    const item = scanResponseData.items[0];

    // Tiêu chí
    const qcCriteriaId = item?.qcCriteriaId ? item.qcCriteriaId : null;
    const qualityPoint = await this.qualityPointRepository.findOneById(
      qcCriteriaId,
    );

    if (!qualityPoint) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.QUALITY_POINT_NOT_FOUND'))
        .build();
    }

    // Hình thức QC
    const formality = QUALITY_POINT_FORMALITY.filter(
      (x) => x.value == qualityPoint.formality,
    ).map((y) => y.text)[0];

    // Số lô
    const lot = item?.lots ? item?.lots[0] : null;
    const consignmentName = lot ? lot?.lotNumber : null;

    // QC 2 lần
    const numberOfTime = qualityPoint?.numberOfTime;
    if (
      numberOfTime != NumberOfTime.OneTimes
      && numberOfTime != NumberOfTime.TwoTimes
    ) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(
          await this.i18n.translate(
            'error.DATA_NOT_QC',
          ),
        )
        .build();
    }

    // lấy dữ liệu chi tiết danh sách lỗi
    const checkListDetails =
      await this.qualityPointService.getCheckListDetailsByQualityPoint(
        qcCriteriaId,
      );
    const checkListDetailData = checkListDetails?.data
      ? checkListDetails.data
      : [];

    if (
      item?.planQuantity == undefined ||
      item?.actualQuantity == undefined ||
      item?.qcPassQuantity === undefined ||
      item?.qcRejectQuantity === undefined
    ) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.QUANTITY_INVALID'))
        .build();
    }

    let qcNeedTotalQuantity: number;
    let qcDoneTotalQuantity: number;

    if (item.qcPassQuantity === null || item.qcRejectQuantity === null) {
      qcNeedTotalQuantity = item.planQuantity;
      qcDoneTotalQuantity = 0;
    } else {
      qcNeedTotalQuantity =
        item.planQuantity - item.qcPassQuantity - item.qcRejectQuantity;
      qcDoneTotalQuantity = item.qcPassQuantity + item.qcRejectQuantity;
    }

    if (
      qcNeedTotalQuantity < 0 ||
      qcDoneTotalQuantity < 0 ||
      qcNeedTotalQuantity > item.planQuantity
    ) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.QUANTITY_INVALID'))
        .build();
    }

    let qcPassTotalQuantity = item?.qcPassQuantity ? item.qcPassQuantity : 0;       // Số lượng đạt
    let qcRejectTotalQuantity = item?.qcRejectQuantity ? item.qcRejectQuantity : 0; // Số lượng lỗi

    const errorReports =
      await this.errorReportRepository.getListErrorReportNotConfirmAndReject(
        Number(qcStageId),
        orderId,
        warehouseId,
        itemId,
      );

    const totalQcQuantityErs = errorReports
      .map((x) => x?.transactionHistory?.qcQuantity)
      .reduce((a, b) => Number(a) + Number(b), 0);

    let validateQcNeedQuantity = qcNeedTotalQuantity - totalQcQuantityErs;

    // view số lượng khi qc 2 lần
    if(numberOfTime == NumberOfTime.TwoTimes){
      const theFirstTimeTransactionForItem = await this.transactionHistoryRepository.totalQuantityForItem(
        orderId,
        warehouseId,
        itemId,
        qcStageId,
        TransactionHistoryNumberOfTimeQc.theFirstTime, // TH QC lần 1
      );

      // Số lượng đã QC lần 1
      const qcDoneQuantity1 = theFirstTimeTransactionForItem?.qcQuantity ? Number(theFirstTimeTransactionForItem.qcQuantity) : 0;

      if(numberOfTimeUserQc == userIOqcNumberOfTimeQc.theFirstTime){
        qcNeedTotalQuantity = item.planQuantity - qcDoneQuantity1;
        qcDoneTotalQuantity = qcDoneQuantity1;
        validateQcNeedQuantity = qcNeedTotalQuantity - qcDoneQuantity1;
      }else if(numberOfTimeUserQc == userIOqcNumberOfTimeQc.theSecondTime){
        qcNeedTotalQuantity = qcDoneQuantity1 - qcDoneTotalQuantity;
        qcDoneTotalQuantity = qcDoneTotalQuantity;
        validateQcNeedQuantity = qcNeedTotalQuantity - totalQcQuantityErs;
      }
    }

    const result: InputQcProgressScanQrResponseDto = {
      order: {
        id: scanResponseData ? scanResponseData.id : null,
        name: scanResponseData ? scanResponseData.name : null,
        code: scanResponseData ? scanResponseData.code : null,
      }, // Lệnh
      warehouse: {
        id: scanResponseData?.warehouse[0]
          ? scanResponseData.warehouse[0].id
          : null,
        name: scanResponseData?.warehouse[0]
          ? scanResponseData.warehouse[0].name
          : null,
      }, // Kho nhập
      vendor: {
        id: scanResponseData?.vendor ? scanResponseData.vendor.id : null,
        name: scanResponseData?.vendor ? scanResponseData.vendor.name : null,
      }, // Nhà cung cấp
      customer: {
        id: scanResponseData?.customer ? scanResponseData.customer.id : null,
        name: scanResponseData?.customer
          ? scanResponseData.customer.name
          : null,
      }, // Nhà cung cấp
      deadline: new Date(Date.now()), // ngày thực hiện
      qcCriteriaId: qcCriteriaId, // tiêu chí
      createdBy: {
        id: user ? user.id : null,
        userName: user ? user.username : null,
      }, // Người thực hiện
      formality: formality,
      consignmentName: consignmentName,
      numberOfTime: numberOfTime == NumberOfTime.OneTimes ? 1 : 2,
      numberOfTimeQc: numberOfTimeUserQc,
      qcProgress: {
        item: {
          id: item?.id ? item.id : '',                              // Id sản phẩm
          code: item?.code ? item.code : '',                        // Mã sản phẩm
          name: item?.name ? item.name : '',                        // Tên sản phâm
          unitName: item?.itemUnit?.name ? item.itemUnit.name : '', // Đơn vị
          planQuantity: item?.planQuantity ? item.planQuantity : 0, // Số Lượng kế hoạch
          qcNeedTotalQuantity: qcNeedTotalQuantity,                 // Số lượng cần
          qcDoneTotalQuantity: qcDoneTotalQuantity,                 // Số lượng đã qc
          qcPassTotalQuantity: qcPassTotalQuantity,                 // Số lượng đạt
          qcRejectTotalQuantity: qcRejectTotalQuantity,             // Số lượng lỗi
          validateQcNeedQuantity: validateQcNeedQuantity,           // Số lượng cân để validate
        },
        checkListDetails: checkListDetailData,
      },
    };

    return response.withData(result).build();
  }

  public async update(
    request: UpdateQcProgressRequestDto,
    type: TransactionHistoryTypeEnum,
  ): Promise<ResponsePayload<any>> {
    const response = new ResponseBuilder();
    const {
      transactionHistoryCheckListDetails,
      orderId,
      itemId,
      warehouseId,
      qcCriteriaId,
      qcQuantity,
      qcPassQuantity,
      qcRejectQuantity,
      user,
      transactionHistoryIOqc,
      numberOfTime,
      numberOfTimeQc,
    } = request;

    // validate user permission
    // check if current orderId: user is assigned or not
    const isAdminOrLeader = checkUserRoleSettings(request.user);
    if (!isAdminOrLeader) {
      const qcPlans = await this.qualityPlanRepository.findIoQcPlanByUser(
        request.createdByUserId,
        type,
      );

      if (isEmpty(qcPlans)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(
            await this.i18n.translate('error.IO_QC_PLAN_USER_ASSIGN_NOT_FOUND'),
          )
          .build();
      }
      const filterOrderIds = [];
      qcPlans.forEach((item) => {
        if (!isEmpty(item.orderDetails)) {
          item.orderDetails.forEach((item) => {
            if (!filterOrderIds.includes(item.orderId)) {
              filterOrderIds.push(item.orderId);
            }
          });
        }
      });
      if (!filterOrderIds.includes(orderId)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.ORDER_NOT_ASSIGN_TO_USER'),
          )
          .build();
      }
    }

    // validate input qc quantity
    const checkInputQcQuantity = validateInputQcQuantity({
      checkListDetails: transactionHistoryCheckListDetails,
      totalUnQcQuantity: transactionHistoryIOqc.qcNeedTotalQuantity,
      qcQuantity: qcQuantity,
      qcPassQuantity: qcPassQuantity,
      qcRejectQuantity: qcRejectQuantity,
    });

    if (!checkInputQcQuantity) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.QC_QUANTITY_INVALID'))
        .build();
    }

    const validateQcNeedQuantity = await this.validateQcNeedQuantity(
      type,
      orderId,
      warehouseId,
      itemId,
      qcQuantity,
    );

    if (validateQcNeedQuantity) {
      return new ResponseBuilder()
        .withCode(validateQcNeedQuantity?.statusCode)
        .withMessage(validateQcNeedQuantity?.message)
        .build();
    }

    // Kiểm tra có tồn lại tiêu chí ko
    const qualityPoint = await this.qualityPointRepository.findOneById(
      qcCriteriaId,
    );
    if (isEmpty(qualityPoint)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.QUALITY_POINT_NOT_FOUND'))
        .build();
    }

    let isBack = false;

    if(
      numberOfTime == (NumberOfTime.OneTimes + 1)
      && qcRejectQuantity == 0
    ){
      isBack = true;
    }else if(
      numberOfTime == (NumberOfTime.TwoTimes + 1)
      && numberOfTimeQc == TransactionHistoryNumberOfTimeQc.theSecondTime
      && qcRejectQuantity == 0
    ){
      isBack = true;
    }else if(
      numberOfTime == (NumberOfTime.TwoTimes + 1)
      && numberOfTimeQc == TransactionHistoryNumberOfTimeQc.theFirstTime
    ){
      isBack = true;
    }

    try {
      const transactionHistory =
        await this.transactionHistoryRepository.updateQualityProgress(
          request,
          type,
        );

      return response
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData({
          isBack: isBack,
          ...transactionHistory
        })
        .build();
    } catch (error) {
      throw error;
    }
  }

  private async validateQcNeedQuantity(
    type: any,
    orderId: number,
    warehouseId: number,
    itemId: number,
    qcQuantity: number,
  ): Promise<any> {
    const qualityPlanIOqc =
      await this.qualityPlanIOqcRepository.findQualityPlanIOqcByQc(
        type,
        orderId,
        warehouseId,
        itemId,
      );

    if (!qualityPlanIOqc) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.ITEM_NOT_CREATED_PLAN'))
        .build();
    }

    const planQuantityPlan = qualityPlanIOqc?.planQuantity
      ? Number(qualityPlanIOqc?.planQuantity)
      : 0;
    const qcRejectQuantityPlan = qualityPlanIOqc?.qcRejectQuantity
      ? Number(qualityPlanIOqc?.qcRejectQuantity)
      : 0;
    const qcPassQuantityPlan = qualityPlanIOqc?.qcPassQuantity
      ? Number(qualityPlanIOqc?.qcPassQuantity)
      : 0;
    const qcNeedQuantityPlan =
      planQuantityPlan - qcRejectQuantityPlan - qcPassQuantityPlan;

    const errorReports =
      await this.errorReportRepository.getListErrorReportNotConfirmAndReject(
        type,
        orderId,
        warehouseId,
        itemId,
      );

    const totalQcQuantityErs = errorReports
      .map((x) => x?.transactionHistory?.qcQuantity)
      .reduce((a, b) => Number(a) + Number(b), 0);

    const totalDoneQcQuantity = totalQcQuantityErs + qcQuantity;

    if (totalDoneQcQuantity > qcNeedQuantityPlan) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.QC_QUANTITY_INVALID_NEED'),
        )
        .build();
    }

    return null;
  }
}
