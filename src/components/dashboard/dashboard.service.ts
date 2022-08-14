import { DashboardServiceInterface } from "@components/dashboard/interface/dashboard.service.interface";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection } from "typeorm";
import { I18nService } from "nestjs-i18n";
import { Inject, Injectable } from "@nestjs/common";
import { GetDashboardFinishedItemProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-finished-item-progress.request.dto";
import { ProduceServiceInterface } from "@components/produce/interface/produce.service.interface";
import { ResponseBuilder } from "@utils/response-builder";
import { ResponseCodeEnum } from "@constant/response-code.enum";
import { plainToClass } from "class-transformer";
import { GetInProgressMoResponseDto } from "@components/dashboard/dto/response/get-in-progress-mo.response.dto";
import { GetItemsByMoResponseDto } from "@components/dashboard/dto/response/get-items-by-mo.response.dto";
import { GetProduceStepsByMoAndItemRequestDto } from "@components/dashboard/dto/request/get-produce-steps-by-mo-and-item.request.dto";
import { GetProduceStepsByMoAndItemResponseDto } from "@components/dashboard/dto/response/get-produce-steps-by-mo-and-item.response.dto";
import { GetDashboardIoQcProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-io-qc-progress-request.dto";
import { TransactionHistoryServiceInterface } from "@components/transaction-history/interface/transaction-history.service.interface";
import { QualityPlanServiceInterface } from "@components/quality-plan/interface/quality-plan.service.interface";
import { find, isEmpty, max, maxBy, min, minBy } from "lodash";
import { getDaysArray, getDaysBetweenDates } from "@utils/helper";
import {
  DashBoardDateTimeFormat,
  TransactionHistoryInputQcTypes,
  TransactionHistoryIOqcTypeEnum,
  TransactionHistoryOutputQcTypes,
  TransactionHistoryProducingStepsQcTypes,
  TransactionHistoryTypeEnum
} from "@components/transaction-history/transaction-history.constant";
import * as moment from "moment";
import { GetDashboardIoQcProgressResponseDto } from "@components/dashboard/dto/response/get-dashboard-io-qc-progress-response.dto";
import { ActualQuantityImportHistoryServiceInterface } from "@components/actual-quantity-import-history/interface/actual-quantity-import-history.service.interface";
import { GetDashboardOverallQcProgressRequestDto } from "@components/dashboard/dto/request/get-dashboard-overall-qc-progress.request.dto";
import { GetDashboardOverallQcProgressResponseDto } from "@components/dashboard/dto/response/get-dashboard-overall-qc-progress.response.dto";
import { GetDashboardSummaryResponseDto } from "@components/dashboard/dto/response/get-dashboard-summary.response.dto";
import { ErrorReportServiceInterface } from "@components/error-report/interface/error-report.service.interface";
import { ErrorReportRepositoryInterface } from "@components/error-report/interface/error-report.repository.interface";
import { ErrorGroupRepositoryInterface } from "@components/error-group/interface/error-group.repository.interface";
import { ErrorReport } from "@entities/error-report/error-report.entity";
import { GetDashboardErrorResponseDto } from "@components/dashboard/dto/response/get-dashboard-error.response.dto";
import { GetDashboardErrorRequestDto } from "@components/dashboard/dto/request/get-dashboard-error.request.dto";
import { CauseGroupRepositoryInterface } from "@components/cause-group/interface/cause-group.repository.interface";
import { GetDashboardStatusResponseDto } from "@components/dashboard/dto/response/get-dashboard-status.response.dto";
import { ActionCategoryRepositoryInterface } from "@components/action-category/interface/action-category.repository.interface";
import { GetDashboardProducingStepQcProgressResponseDto } from "@components/dashboard/dto/response/get-dashboard-producing-step-qc-progress.response.dto";

@Injectable()
export class DashboardService implements DashboardServiceInterface {
  constructor(
    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceServiceInterface,
    @Inject('TransactionHistoryServiceInterface')
    private readonly transactionHistoryService: TransactionHistoryServiceInterface,
    @Inject('QualityPlanServiceInterface')
    private readonly qualityPlanService: QualityPlanServiceInterface,
    @Inject('ActualQuantityImportHistoryServiceInterface')
    private readonly actualQuantityImportHistoryService: ActualQuantityImportHistoryServiceInterface,
    @Inject('ErrorReportServiceInterface')
    private readonly errorReportService: ErrorReportServiceInterface,
    @Inject('ErrorReportRepositoryInterface')
    private readonly errorReportRepository: ErrorReportRepositoryInterface,
    @Inject('ErrorGroupRepositoryInterface')
    private readonly errorGroupRepository: ErrorGroupRepositoryInterface,
    @Inject('CauseGroupRepositoryInterface')
    private readonly causeGroup: CauseGroupRepositoryInterface,
    @Inject('ActionCategoryRepositoryInterface')
    private readonly actionCategoryRepository: ActionCategoryRepositoryInterface,
    @InjectConnection()
    private readonly connection: Connection,
    private readonly i18n: I18nService,
  ) {}
  public async getDashboardProducingStepQCProgress(
    request: GetDashboardFinishedItemProgressRequestDto,
  ): Promise<any> {
    
    // Get produced/actual quantity from import histories from MESX
    const producedQuantityHistories =
      await this.actualQuantityImportHistoryService.getImportQuantityHistoriesByCreatedDateForProducingSteps(
        request,
      );
    
    // Get and calculate Qc plan quantity from QC plan
    const inProgressProduceQcPlans =
      await this.qualityPlanService.getListProducingStepsQcPlans(request);

    if (isEmpty(inProgressProduceQcPlans)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData([])
        .build();
    }
    
    const minStart = moment(
      minBy(inProgressProduceQcPlans, 'planFrom')['planFrom'],
    );
    const maxEnd = moment(maxBy(inProgressProduceQcPlans, 'planTo')['planTo']);
    const days = getDaysArray(minStart, maxEnd);

    const averagePlanQuantityList = this.getAveragePlanQuantityByDays(
      inProgressProduceQcPlans,
      days,
    );

    // Get raw producing step QC data from database
    const rawProduceQcResponse =
      await this.transactionHistoryService.getProducingStepsQcProgressItems(
        request,
      );

    // Transform
    const result = [];
    averagePlanQuantityList.forEach((item, i) => {
      const v: any = {
        date: item.date,
        qcPlanQuantity: item.qcPlanQuantity || 0,
      };
      const actualQuantityItem = find(
        producedQuantityHistories,
        (d) => d.date === item.date,
      );
      const producedQcItems = find(
        rawProduceQcResponse,
        (d) => item.date === d.date,
      );
      if (i === 0) {
        v.producedQuantity = parseInt(actualQuantityItem?.producedQuantity) || 0;
        v.planQuantity = item.qcPlanQuantity || 0;
        v.qcRejectQuantity = parseInt(producedQcItems?.qcRejectQuantity) || 0;
        v.qcPassQuantity = parseInt(producedQcItems?.qcPassQuantity) || 0;
        v.qcRepairQuantity = parseInt(producedQcItems?.qcRepairQuantity) || 0;
        v.totalQcQuantity = v.qcPassQuantity + v.qcRejectQuantity;
        v.qcQuantity =
          v.producedQuantity + v.qcRepairQuantity - v.totalQcQuantity;
        v.needToBeRepair =
          v.qcRejectQuantity > v.qcRepairQuantity
            ? v.qcRejectQuantity - v.qcRepairQuantity
            : 0;
      } else {
        v.producedQuantity =
          result[i - 1].producedQuantity +
          (parseInt(actualQuantityItem?.producedQuantity) || 0);
        v.planQuantity = result[i - 1].planQuantity + item.qcPlanQuantity;
        v.qcRejectQuantity =
          result[i - 1].qcRejectQuantity +
          (parseInt(producedQcItems?.qcRejectQuantity) || 0);
        v.qcPassQuantity =
          result[i - 1].qcPassQuantity +
          (parseInt(producedQcItems?.qcPassQuantity) || 0);
        v.qcRepairQuantity =
          result[i - 1].qcRepairQuantity +
          (parseInt(producedQcItems?.qcRepairQuantity) || 0);
        v.totalQcQuantity = v.qcPassQuantity + v.qcRejectQuantity;
        v.qcQuantity =
          v.producedQuantity + v.qcRepairQuantity - v.totalQcQuantity;
        v.needToBeRepair =
          v.qcRejectQuantity > v.qcRepairQuantity
            ? v.qcRejectQuantity - v.qcRepairQuantity
            : 0;
      }
      result.push(v);
    });

    const response = plainToClass(
      GetDashboardProducingStepQcProgressResponseDto,
      result,
      { excludeExtraneousValues: true },
    );
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async getInProgressMoList(): Promise<any> {
    const response = await this.produceService.getInProgressMoList();
    const result = plainToClass(GetInProgressMoResponseDto, response, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }

  public async getItemsByMo(id: number): Promise<any> {
    const response = await this.produceService.getItemsByMo(id);
    const result = plainToClass(GetItemsByMoResponseDto, response, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }

  public async getProduceStepsByMoAndItem(
    request: GetProduceStepsByMoAndItemRequestDto,
  ): Promise<any> {
    const response = await this.produceService.getProduceStepsByMoAndItem(
      request,
    );
    const result = plainToClass(
      GetProduceStepsByMoAndItemResponseDto,
      response,
      { excludeExtraneousValues: true },
    );
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }

  public async getDashboardIOQcProgress(
    request: GetDashboardIoQcProgressRequestDto,
    type: TransactionHistoryIOqcTypeEnum,
  ): Promise<any> {
    // Get min max date range from QC plan
    const inProgressPlans =
      await this.qualityPlanService.getListInProgressInputPlans(request, type);
    if (isEmpty(inProgressPlans)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData([])
        .build();
    }

    const minStart = moment(minBy(inProgressPlans, 'planFrom')['planFrom']);
    const maxEnd = moment(maxBy(inProgressPlans, 'planTo')['planTo']);
    const days = getDaysArray(minStart, maxEnd);

    const averagePlanQuantityList = this.getAveragePlanQuantityByDays(
      inProgressPlans,
      days,
    );

    // get input quantity histories by date
    const inputQuantityHistories =
      await this.actualQuantityImportHistoryService.getImportQuantityHistoriesByCreatedDate(
        request,
        type,
      );

    // Get raw input QC data from database
    const rawInputQcResponse =
      await this.transactionHistoryService.getIoQcProgressItems(request, type);
    // Transform
    const result = [];
    averagePlanQuantityList.forEach((item, i) => {
      const v: any = {
        date: item.date,
        qcPlanQuantity: item.qcPlanQuantity || 0,
      };
      const actualQuantityItem = find(
        inputQuantityHistories,
        (d) => d.date === item.date,
      );
      const inputQcItems = find(
        rawInputQcResponse,
        (d) => item.date === d.date,
      );
      if (i === 0) {
        v.importQuantity = parseInt(actualQuantityItem?.importQuantity) || 0;
        v.qcPlanQuantity = item.qcPlanQuantity || 0;
        v.qcRejectQuantity = parseInt(inputQcItems?.qcRejectQuantity) || 0;
        v.qcPassQuantity = parseInt(inputQcItems?.qcPassQuantity) || 0;
        v.qcQuantity = v.qcRejectQuantity + v.qcPassQuantity;
        v.qcNeedQuantity =
          v.importQuantity > v.qcQuantity ? v.importQuantity - v.qcQuantity : 0;
      } else {
        v.importQuantity =
          result[i - 1].importQuantity +
          (parseInt(actualQuantityItem?.importQuantity) || 0);
        v.qcRejectQuantity =
          result[i - 1].qcRejectQuantity +
          (parseInt(inputQcItems?.qcRejectQuantity) || 0);
        v.qcPassQuantity =
          result[i - 1].qcPassQuantity +
          (parseInt(inputQcItems?.qcPassQuantity) || 0);
        v.qcQuantity = v.qcRejectQuantity + v.qcPassQuantity;
        v.qcNeedQuantity =
          v.importQuantity > v.qcQuantity ? v.importQuantity - v.qcQuantity : 0;
        v.qcPlanQuantity = result[i - 1].qcPlanQuantity + item.qcPlanQuantity;
      }
      result.push(v);
    });
    const response = plainToClass(GetDashboardIoQcProgressResponseDto, result, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  private getAveragePlanQuantityByDays(inProgressPlans: any, days: any[]) {
    const result = {};
    // Calculate average plan quantity for each plans
    inProgressPlans.forEach((item) => {
      const qcPlanQuantity = item.qcPlanQuantity
        ? parseInt(item.qcPlanQuantity)
        : 0;
      const dayArrays = getDaysArray(item.planFrom, item.planTo);
      const numberOfdays = getDaysBetweenDates(item.planFrom, item.planTo) || 1;
      const redundantPlanQcQuantity = qcPlanQuantity % numberOfdays;
      const averagePlanQcQuantity =
        numberOfdays == 1
          ? qcPlanQuantity
          : (qcPlanQuantity - redundantPlanQcQuantity) / numberOfdays; // chia lấy phần nguyên
      const averagePlanQcQuantityLastDay =
        averagePlanQcQuantity + redundantPlanQcQuantity;

      dayArrays.forEach((day, index, dayArrays) => {
        const dayWithFormat = moment(day.toISOString()).format(
          DashBoardDateTimeFormat,
        );
        if (!(dayWithFormat in result)) {
          // if last day then assign value to averagePlanQcQuantityLastDay else averagePlanQcQuantity
          result[dayWithFormat] =
            index !== dayArrays.length - 1
              ? averagePlanQcQuantity
              : averagePlanQcQuantityLastDay;
        } else {
          // if last day then assign value to averagePlanQcQuantityLastDay else averagePlanQcQuantity
          result[dayWithFormat] +=
            index !== dayArrays.length - 1
              ? averagePlanQcQuantity
              : averagePlanQcQuantityLastDay;
        }
      });
    });

    // Assign the previous average quantity if the current date has no quantity
    for (let i = 1; i < days.length; i++) {
      const dayWithFormat = moment(days[i].toISOString()).format(
        DashBoardDateTimeFormat,
      );
      if (!(dayWithFormat in result)) {
        result[dayWithFormat] = 0;
      }
    }
    // mapping result object to list of objects
    const resultList = Object.keys(result)
      .map((key) => ({
        date: key,
        qcPlanQuantity: result[key],
      }))
      .sort(function (a, b) {
        // Sorting by date ASC
        const res =
          moment(a.date, DashBoardDateTimeFormat) >
          moment(b.date, DashBoardDateTimeFormat)
            ? 1
            : -1;
        return res;
      });
    return resultList;
  }

  async getDashboardOverallProgress(
    request: GetDashboardOverallQcProgressRequestDto,
  ): Promise<any> {
    const { from, to } = request;
    const overallQcData = await this.getOverallQcData(request);
    const [produceStepQcData, inputQcData, outputQcData] = overallQcData;
    const minStart = min([
      !isEmpty(produceStepQcData?.data)
        ? minBy(
            produceStepQcData?.data.map((e) =>
              moment(e.date, DashBoardDateTimeFormat),
            ),
          )
        : null,
      !isEmpty(inputQcData?.data)
        ? minBy(
            inputQcData?.data.map((e) =>
              moment(e.date, DashBoardDateTimeFormat),
            ),
          )
        : null,
      !isEmpty(outputQcData?.data)
        ? minBy(
            outputQcData?.data.map((e) =>
              moment(e.date, DashBoardDateTimeFormat),
            ),
          )
        : null,
    ]);
    const maxEnd = max([
      !isEmpty(produceStepQcData?.data)
        ? maxBy(
            produceStepQcData?.data.map((e) =>
              moment(e.date, DashBoardDateTimeFormat),
            ),
          )
        : null,
      !isEmpty(inputQcData?.data)
        ? maxBy(
            inputQcData?.data.map((e) =>
              moment(e.date, DashBoardDateTimeFormat),
            ),
          )
        : null,
      !isEmpty(outputQcData?.data)
        ? maxBy(
            outputQcData?.data.map((e) =>
              moment(e.date, DashBoardDateTimeFormat),
            ),
          )
        : null,
    ]);
    const days = minStart && maxEnd ? getDaysArray(minStart, maxEnd) : [];
    let result = [];
    if (!isEmpty(days)) {
      // Calculate SUM quantity of 3 dashboards: Input, Output and Produce Step
      days.forEach((day) => {
        const dayWithFormat = moment(day.toISOString()).format(
          DashBoardDateTimeFormat,
        );
        const v: any = {
          date: dayWithFormat,
        };
        const produceItem = find(
          produceStepQcData?.data,
          (d) => dayWithFormat === d.date,
        );
        const inputItem = find(
          inputQcData?.data,
          (d) => dayWithFormat === d.date,
        );
        const outputItem = find(
          outputQcData?.data,
          (d) => dayWithFormat === d.date,
        );
        v.qcQuantity =
          (produceItem?.totalQcQuantity || 0) +
          (inputItem?.qcQuantity || 0) +
          (outputItem?.qcQuantity || 0);
        v.qcPassQuantity =
          (produceItem?.qcPassQuantity || 0) +
          (inputItem?.qcPassQuantity || 0) +
          (outputItem?.qcPassQuantity || 0);
        v.qcNeedQuantity =
          (produceItem?.qcQuantity || 0) +
          (inputItem?.qcNeedQuantity || 0) +
          (outputItem?.qcNeedQuantity || 0);
        v.qcPlanQuantity =
          (produceItem?.planQuantity || 0) +
          (inputItem?.qcPlanQuantity || 0) +
          (outputItem?.qcPlanQuantity || 0);
        result.push(v);
      });
    }
    // filter by from date and to date
    if (from) {
      result = result.filter((item) => {
        const itemDate = moment(item.date, DashBoardDateTimeFormat);
        const fromDate = moment(from);
        return itemDate.isSameOrAfter(fromDate);
      });
    }

    if (to) {
      result = result.filter((item) => {
        const itemDate = moment(item.date, DashBoardDateTimeFormat);
        const toDate = moment(to);
        return itemDate.isSameOrBefore(toDate);
      });
    }

    const response = plainToClass(
      GetDashboardOverallQcProgressResponseDto,
      result,
      { excludeExtraneousValues: true },
    );
    return new ResponseBuilder()
      .withData(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private async getOverallQcData(
    request: GetDashboardOverallQcProgressRequestDto,
  ): Promise<any> {
    let produceStepQcData = [];
    let inputQcData = [];
    let outputQcData = [];

    let produceStepQcFilter = new GetDashboardFinishedItemProgressRequestDto();
    let inputQcFilter = new GetDashboardIoQcProgressRequestDto();
    let outputQcFilter = new GetDashboardIoQcProgressRequestDto();
    const { qcStageId } = request;

    if (qcStageId === TransactionHistoryTypeEnum.OutputProducingStep) {
      // if filters only produce QC
      produceStepQcFilter = request.produceStepQcFilter
        ? request.produceStepQcFilter
        : new GetDashboardFinishedItemProgressRequestDto();
      produceStepQcData = await this.getDashboardProducingStepQCProgress(
        produceStepQcFilter,
      );
    } else if (TransactionHistoryInputQcTypes.includes(qcStageId)) {
      // if filters only input QC
      inputQcFilter = request.ioQcFilter
        ? request.ioQcFilter
        : new GetDashboardIoQcProgressRequestDto();
      inputQcData = await this.getDashboardIOQcProgress(
        inputQcFilter,
        TransactionHistoryIOqcTypeEnum.input,
      );
    } else if (TransactionHistoryOutputQcTypes.includes(qcStageId)) {
      // if filters only output QC
      outputQcFilter = request.ioQcFilter
        ? request.ioQcFilter
        : new GetDashboardIoQcProgressRequestDto();
      outputQcData = await this.getDashboardIOQcProgress(
        outputQcFilter,
        TransactionHistoryIOqcTypeEnum.output,
      );
    } else {
      // if no filters then get all data
      produceStepQcData = await this.getDashboardProducingStepQCProgress(
        produceStepQcFilter,
      );
      inputQcData = await this.getDashboardIOQcProgress(
        inputQcFilter,
        TransactionHistoryIOqcTypeEnum.input,
      );
      outputQcData = await this.getDashboardIOQcProgress(
        outputQcFilter,
        TransactionHistoryIOqcTypeEnum.output,
      );
    }
    return await Promise.all([produceStepQcData, inputQcData, outputQcData]);
  }

  async getDashboardSummary(): Promise<any> {
    const produceQcData = await this.getDashboardProducingStepQCProgress(
      new GetDashboardFinishedItemProgressRequestDto(),
    );
    const inputQcData = await this.getDashboardIOQcProgress(
      new GetDashboardIoQcProgressRequestDto(),
      TransactionHistoryIOqcTypeEnum.input,
    );
    const outputQcData = await this.getDashboardIOQcProgress(
      new GetDashboardIoQcProgressRequestDto(),
      TransactionHistoryIOqcTypeEnum.output,
    );
    const result = {
      totalInputQcPlanQuantity: !isEmpty(inputQcData?.data)
        ? inputQcData?.data[inputQcData?.data?.length - 1].qcPlanQuantity
        : 0,
      totalOutputQcPlanQuantity: !isEmpty(outputQcData?.data)
        ? outputQcData?.data[outputQcData?.data?.length - 1].qcPlanQuantity
        : 0,
      totalProduceQcPlanQuantity: !isEmpty(produceQcData?.data)
        ? produceQcData?.data[produceQcData?.data?.length - 1].planQuantity
        : 0,
    };
    const response = plainToClass(GetDashboardSummaryResponseDto, result, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  async getDashboardByErrorType(
    request: GetDashboardErrorRequestDto,
  ): Promise<any> {
    let errorReportProducingStep = [];
    let errorReportInputQc = [];

    let produceStepQcFilter = new GetDashboardFinishedItemProgressRequestDto();
    let inputQcFilter = new GetDashboardIoQcProgressRequestDto();
    const { qcStageId } = request;
    const errorGroup = [];
    let result = [];
    if (TransactionHistoryProducingStepsQcTypes.includes(qcStageId)) {
      produceStepQcFilter = request.produceStepQcFilter
        ? request.produceStepQcFilter
        : new GetDashboardFinishedItemProgressRequestDto();
      errorReportProducingStep = await this.errorReportRepository.getListErrorReportByProduceStep(
          qcStageId,
          produceStepQcFilter?.moId,
          produceStepQcFilter?.itemId,
          produceStepQcFilter?.producingStepId,
        );
      if (!isEmpty(errorReportProducingStep)) {
        errorReportProducingStep.forEach((e) => {
          const errorReportErrorDetail = e?.errorReportStageDetail?.errorReportErrorList?.errorReportErrorDetails;
          errorReportErrorDetail?.forEach((e) => {
            errorGroup.push(e.errorGroupId);
          });
        });
      }
      result = await this.CalculateAndMapData(errorGroup);
    } else if (
      TransactionHistoryInputQcTypes.includes(qcStageId) ||
      TransactionHistoryOutputQcTypes.includes(qcStageId)
    ) {
      // if filters only input QC
      inputQcFilter = request.ioQcFilter
        ? request.ioQcFilter
        : new GetDashboardIoQcProgressRequestDto();
      errorReportInputQc = await this.errorReportRepository.getListErrorReportIoqcStage(
          qcStageId,
          inputQcFilter?.orderId,
          inputQcFilter?.itemId,
        );
      if (!isEmpty(errorReportInputQc)) {
        errorReportInputQc.forEach((e) => {
          const errorReportErrorDetail = e?.errorReportIoqcDetail?.errorReportErrorList?.errorReportErrorDetails;
          errorReportErrorDetail?.forEach((e) => {
            errorGroup.push(e.errorGroupId);
          });
        });
      }
      result = await this.CalculateAndMapData(errorGroup);
    } else {
      const listErrorReport = await this.errorReportRepository.getListAllErrorReport();
      if (!isEmpty(listErrorReport)) {
        listErrorReport.forEach((e) => {
          if (!isEmpty(e?.errorReportIoqcDetail)) {
            const errorReportErrorDetail = e?.errorReportIoqcDetail?.errorReportErrorList?.errorReportErrorDetails;
            errorReportErrorDetail?.forEach((e) => {
              errorGroup.push(e.errorGroupId);
            });
          }
          else if (!isEmpty(e?.errorReportStageDetail)) {
            const errorReportErrorDetail = e?.errorReportStageDetail?.errorReportErrorList?.errorReportErrorDetails;
            errorReportErrorDetail?.forEach((e) => {
              errorGroup.push(e.errorGroupId);
            });
          }
        });
      }
      result = await this.CalculateAndMapData(errorGroup);
    }
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }
  async CalculateAndMapData(errorGroup: number[]): Promise<any> {
    const errorGroupArray = Array.from(new Set(errorGroup));
    const result = [];
    let index = 0;
    const detailErrorGroup = await this.errorGroupRepository.getErrorGroupByIds(errorGroupArray);
    for (const e of detailErrorGroup) {
      if (index == detailErrorGroup.length - 1) {
        const total = errorGroup.filter((x) => x === e?.id).length;
        let totalRatio = 0;
        result.forEach((e) => {
          totalRatio += e.ratio;
        });
        const ratio = Math.round((100 - totalRatio) * 100) / 100;
        const response: GetDashboardErrorResponseDto = new GetDashboardErrorResponseDto();
        response.name = e?.name;
        response.quantity = total;
        response.ratio = ratio;
        result.push(response);
      } else {
        index++;
        const total = errorGroup.filter((x) => x === e?.id).length;
        const calculate = (total / errorGroup.length) * 100;
        const ratio = Math.round(calculate * 100) / 100;
        const response: GetDashboardErrorResponseDto = new GetDashboardErrorResponseDto();
        response.name = e?.name;
        response.quantity = total;
        response.ratio = ratio;
        result.push(response);
      }
    }
    return result;
  }

  async getDashboardByCauseGroup(
    request: GetDashboardErrorRequestDto,
  ): Promise<any> {
    let errorReportProducingStep = [];
    let errorReportInputQc = [];

    let produceStepQcFilter = new GetDashboardFinishedItemProgressRequestDto();
    let inputQcFilter = new GetDashboardIoQcProgressRequestDto();
    const { qcStageId } = request;
    const causeGroup = [];
    let result = [];
    if (TransactionHistoryProducingStepsQcTypes.includes(qcStageId)) {
      produceStepQcFilter = request.produceStepQcFilter
        ? request.produceStepQcFilter
        : new GetDashboardFinishedItemProgressRequestDto();
      errorReportProducingStep = await this.errorReportRepository.getListErrorReportByProduceStep(
          qcStageId,
          produceStepQcFilter?.moId,
          produceStepQcFilter?.itemId,
          produceStepQcFilter?.producingStepId,
        );
      if (!isEmpty(errorReportProducingStep)) {
        errorReportProducingStep.forEach((e) => {
          const errorReportErrorDetail = e?.errorReportStageDetail?.errorReportErrorList?.errorReportErrorDetails;
          errorReportErrorDetail?.forEach((e) => {
            causeGroup.push(e.causeGroupId);
          });
        });
      }
      result = await this.CalculateAndMapDataCauseGroup(causeGroup);
    } else if (
      TransactionHistoryInputQcTypes.includes(qcStageId) ||
      TransactionHistoryOutputQcTypes.includes(qcStageId)
    ) {
      // if filters only input QC
      inputQcFilter = request.ioQcFilter
        ? request.ioQcFilter
        : new GetDashboardIoQcProgressRequestDto();
      errorReportInputQc = await this.errorReportRepository.getListErrorReportIoqcStage(
          qcStageId,
          inputQcFilter?.orderId,
          inputQcFilter?.itemId,
        );
      if (!isEmpty(errorReportInputQc)) {
        errorReportInputQc.forEach((e) => {
          const errorReportErrorDetail = e?.errorReportIoqcDetail?.errorReportErrorList?.errorReportErrorDetails;
          errorReportErrorDetail?.forEach((e) => {
            causeGroup.push(e.causeGroupId);
          });
        });
      }
      result = await this.CalculateAndMapDataCauseGroup(causeGroup);
    } else {
      const listErrorReport = await this.errorReportRepository.getListAllErrorReport();
      if (!isEmpty(listErrorReport)) {
        listErrorReport.forEach((e) => {
          if (!isEmpty(e?.errorReportIoqcDetail)) {
            const errorReportErrorDetail = e?.errorReportIoqcDetail?.errorReportErrorList?.errorReportErrorDetails;
            errorReportErrorDetail?.forEach((e) => {
              causeGroup.push(e.causeGroupId);
            });
          }
          else if (!isEmpty(e?.errorReportStageDetail)) {
            const errorReportErrorDetail = e?.errorReportStageDetail?.errorReportErrorList?.errorReportErrorDetails;
            errorReportErrorDetail?.forEach((e) => {
              causeGroup.push(e.causeGroupId);
            });
          }
        });
      }
      result = await this.CalculateAndMapDataCauseGroup(causeGroup);
    }
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }
  async CalculateAndMapDataCauseGroup(causeGroup: number[]): Promise<any> {
    const causeGroupArray = Array.from(new Set(causeGroup));
    const result = [];
    let index = 0;
    const detailCauseGroup = await this.causeGroup.getCauseGroupByIds(causeGroupArray);
    for (const e of detailCauseGroup) {
      if (index == detailCauseGroup.length - 1) {
        const total = causeGroup.filter((x) => x === e?.id).length;
        let totalRatio = 0;
        result.forEach((e) => {
          totalRatio += e.ratio;
        });
        const ratio = Math.round((100 - totalRatio) * 100) / 100;
        const response: GetDashboardErrorResponseDto = new GetDashboardErrorResponseDto();
        response.name = e?.name;
        response.quantity = total;
        response.ratio = ratio;
        result.push(response);
      } else {
        index++;
        const total = causeGroup.filter((x) => x === e?.id).length;
        const calculate = (total / causeGroup.length) * 100;
        const ratio = Math.round(calculate * 100) / 100;
        const response: GetDashboardErrorResponseDto = new GetDashboardErrorResponseDto();
        response.name = e?.name;
        response.quantity = total;
        response.ratio = ratio;
        result.push(response);
      }
    }
    return result;
  }

  async getDashboardByStatus(
    request: GetDashboardErrorRequestDto,
  ): Promise<any> {
    let errorReportProducingStep = [];
    let errorReportInputQc = [];

    let produceStepQcFilter = new GetDashboardFinishedItemProgressRequestDto();
    let inputQcFilter = new GetDashboardIoQcProgressRequestDto();
    const { qcStageId } = request;
    let result = [];
    if (TransactionHistoryProducingStepsQcTypes.includes(qcStageId)) {
      produceStepQcFilter = request.produceStepQcFilter
        ? request.produceStepQcFilter
        : new GetDashboardFinishedItemProgressRequestDto();
      errorReportProducingStep = await this.errorReportRepository.getListErrorReportByProduceStep(
          qcStageId,
          produceStepQcFilter?.moId,
          produceStepQcFilter?.itemId,
          produceStepQcFilter?.producingStepId,
        );
      result = await this.CalculateAndMapDataStatus(errorReportProducingStep);
    } else if (
      TransactionHistoryInputQcTypes.includes(qcStageId) ||
      TransactionHistoryOutputQcTypes.includes(qcStageId)
    ) {
      // if filters only input QC
      inputQcFilter = request.ioQcFilter
        ? request.ioQcFilter
        : new GetDashboardIoQcProgressRequestDto();
      errorReportInputQc = await this.errorReportRepository.getListErrorReportIoqcStage(
          qcStageId,
          inputQcFilter?.orderId,
          inputQcFilter?.itemId,
        );
      result = await this.CalculateAndMapDataStatus(errorReportInputQc);
    } else {
      const listErrorReport = await this.errorReportRepository.getListAllErrorReport();
      result = await this.CalculateAndMapDataStatus(listErrorReport);
    }
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }

  async CalculateAndMapDataStatus(errorReport: ErrorReport[]): Promise<any> {
    const result = [];
    const status = [0, 1, 2, 3];
    let index = 0;
    for (const e of status) {
      if (index == status.length - 1) {
        const total = errorReport.filter((x) => x.status === e).length;
        let totalRatio = 0;
        result.forEach((e) => {
          totalRatio += e.ratio;
        });
        const ratio = Math.round((100 - totalRatio) * 100) / 100;
        const response: GetDashboardStatusResponseDto = new GetDashboardStatusResponseDto();
        response.status = e;
        response.quantity = total;
        response.ratio = ratio;
        result.push(response);
      } else {
        index++;
        const total = errorReport.filter((x) => x.status === e).length;
        const calculate = (total / errorReport.length) * 100;
        const ratio = Math.round(calculate * 100) / 100;
        const response: GetDashboardStatusResponseDto = new GetDashboardStatusResponseDto();
        response.status = e;
        response.quantity = total;
        response.ratio = ratio;
        result.push(response);
      }
    }
    return result;
  }

  async getDashboardByActionCategory(
    request: GetDashboardErrorRequestDto,
  ): Promise<any> {
    let errorReportProducingStep = [];
    let errorReportInputQc = [];

    let produceStepQcFilter = new GetDashboardFinishedItemProgressRequestDto();
    let inputQcFilter = new GetDashboardIoQcProgressRequestDto();
    const { qcStageId } = request;
    const actionCategory = [];
    let result = [];
    if (TransactionHistoryProducingStepsQcTypes.includes(qcStageId)) {
      produceStepQcFilter = request.produceStepQcFilter
        ? request.produceStepQcFilter
        : new GetDashboardFinishedItemProgressRequestDto();
      errorReportProducingStep = await this.errorReportRepository.getListErrorReportByProduceStep(
          qcStageId,
          produceStepQcFilter?.moId,
          produceStepQcFilter?.itemId,
          produceStepQcFilter?.producingStepId,
        );
      if (!isEmpty(errorReportProducingStep)) {
        errorReportProducingStep.forEach((e) => {
          const errorReportErrorDetail = e?.errorReportStageDetail?.errorReportErrorList?.errorReportErrorDetails;
          errorReportErrorDetail?.forEach((e) => {
            if (e.actionCategoryId != null){
              actionCategory.push(e?.actionCategoryId);
            }
          });
        });
      }
      if (isEmpty(actionCategory)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      } else {
        result = await this.CalculateAndMapDataActionCategory(actionCategory);
      }
    } else if (
      TransactionHistoryInputQcTypes.includes(qcStageId) ||
      TransactionHistoryOutputQcTypes.includes(qcStageId)
    ) {
      // if filters only input QC
      inputQcFilter = request.ioQcFilter
        ? request.ioQcFilter
        : new GetDashboardIoQcProgressRequestDto();
      errorReportInputQc = await this.errorReportRepository.getListErrorReportIoqcStage(
          qcStageId,
          inputQcFilter?.orderId,
          inputQcFilter?.itemId,
        );
      if (!isEmpty(errorReportInputQc)) {
        errorReportInputQc.forEach((e) => {
          const errorReportErrorDetail = e?.errorReportIoqcDetail?.errorReportErrorList?.errorReportErrorDetails;
          errorReportErrorDetail?.forEach((e) => {
            if (e.actionCategoryId != null){
              actionCategory.push(e?.actionCategoryId);
            }
          });
        });
      }
      if (isEmpty(actionCategory)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      } else {
        result = await this.CalculateAndMapDataActionCategory(actionCategory);
      }
    } else {
      const listErrorReport = await this.errorReportRepository.getListAllErrorReport();
      if (!isEmpty(listErrorReport)) {
        listErrorReport.forEach((e) => {
          if (!isEmpty(e?.errorReportIoqcDetail)) {
            const errorReportErrorDetail = e?.errorReportIoqcDetail?.errorReportErrorList?.errorReportErrorDetails;
            errorReportErrorDetail?.forEach((e) => {
              if (e.actionCategoryId != null){
                actionCategory.push(e?.actionCategoryId);
              }
            });
          }
          else if (!isEmpty(e?.errorReportStageDetail)) {
            const errorReportErrorDetail = e?.errorReportStageDetail?.errorReportErrorList?.errorReportErrorDetails;
            errorReportErrorDetail?.forEach((e) => {
              if (e.actionCategoryId != null){
                actionCategory.push(e?.actionCategoryId);
              }
            });
          }
        });
      }
      if (isEmpty(actionCategory)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      } else {
        result = await this.CalculateAndMapDataActionCategory(actionCategory);
      }
    }
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }
  async CalculateAndMapDataActionCategory(
    actionCategory: number[],
  ): Promise<any> {
    const actionCategoryArray = Array.from(new Set(actionCategory));
    const result = [];
    let index = 0;
    const detailCauseGroup =
      await this.actionCategoryRepository.getActionCategoryByIds(
        actionCategoryArray,
      );
    for (const e of detailCauseGroup) {
      if (index == detailCauseGroup.length - 1) {
        const total = actionCategory.filter((x) => x === e?.id).length;
        let totalRatio = 0;
        result.forEach((e) => {
          totalRatio += e.ratio;
        });
        const ratio = Math.round((100 - totalRatio) * 100) / 100;
        const response: GetDashboardErrorResponseDto = new GetDashboardErrorResponseDto();
        response.name = e?.name;
        response.quantity = total;
        response.ratio = ratio;
        result.push(response);
      } else {
        index++;
        const total = actionCategory.filter((x) => x === e?.id).length;
        const calculate = (total / actionCategory.length) * 100;
        const ratio = Math.round(calculate * 100) / 100;
        const response: GetDashboardErrorResponseDto = new GetDashboardErrorResponseDto();
        response.name = e?.name;
        response.quantity = total;
        response.ratio = ratio;
        result.push(response);
      }
    }
    return result;
  }
}
