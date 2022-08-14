import { ErrorReportStatus } from "@entities/error-report/error-report.entity";
import { Priority } from "@entities/error-report/error-report-error-list.entity";

export const OPTION_ERROR_REPORT_PRIORITY = [
  {
    value: Priority.Low,
    text: 'Thấp',
  },
  {
    value: Priority.Medium,
    text: 'Trung bình',
  },
  {
    value: Priority.High,
    text: 'Cao',
  }
]

export const optionErorReportStatus = [
  {
    value: ErrorReportStatus.Awaiting,
    text: 'Chờ xác nhận',
  },
  {
    value: ErrorReportStatus.Confirmed,
    text: 'Xác nhận',
  },
  {
    value: ErrorReportStatus.Rejected,
    text: 'Từ chối',
  },
  {
    value: ErrorReportStatus.Completed,
    text: 'Hoàn thành',
  },
]

export const FILE_EXPORT_ERROR_REPORT_NAME = 'error-report';
export const FILE_EXPORT_ERROR_REPORT_HEADER = [
  {
    from: 'code',
  },
  {
    from: 'name',
  },
  {
    from: 'qcStageName',
  },
  {
    from: 'orderName',
  },
  {
    from: 'transactionHistoryCode',
  },
  {
    from: 'transactionHistoryCreatedAt',
  },
  {
    from: 'transactionHistoryCreatedByUser',
  },
  {
    from: 'transactionHistoryConsignmentName',
  },
  {
    from: 'priority',
  },
  {
    from: 'repairDeadline',
  },
  {
    from: 'errorDescription',
  },
  {
    from: 'assignedTo',
  },
  {
    from: 'status',
  },
];

export const FILE_EXPORT_ERROR_REPORT_DETAIL_NAME = 'error-report-detail';
export const FILE_EXPORT_ERROR_REPORT_DETAIL_HEADER = [
  {
    from: 'code',
  },
  {
    from: 'errorGroupName',
  },
  {
    from: 'causeGroupName',
  },
  {
    from: 'errorItemQuantity',
  },
  {
    from: 'repairItemQuantity',
  },
];
