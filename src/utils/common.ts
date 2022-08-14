import { TIME_ZONE_VN } from '@constant/common';
import { extendMoment } from 'moment-range';
import { isEmpty, map, uniq } from 'lodash';
import * as MomentTimezone from 'moment-timezone';

const moment = extendMoment(MomentTimezone);

import Big from 'big.js';
import {
  ADMIN_LEADER_ROLES,
  QC_DEPARTMENT_NAME,
} from '@utils/permissions/role';
import any = jasmine.any;
import { WORK_ORDER_CODE_PREFIX } from '@components/work-order/work-order.constant';
import { CreateProducingStepsTransactionHistoryRequestDto } from '@components/transaction-history/dto/request/create-producing-steps-transaction-history-request.dto';
import { ValidateInputQcQuantityRequestDto } from '@components/transaction-history/dto/request/validate-input-qc-quantity.request.dto';
import {
  ALL_DEPARTMENTS_CONST,
  ALL_ROLES_CONST,
} from '@components/check-owner-permission/check-owner-permission.constant';

export const minus = (first: number, second: number): number => {
  return Number(new Big(first).minus(new Big(second)));
};

export const plus = (first: number, second: number): number => {
  return Number(new Big(first).plus(new Big(second)));
};

export const mul = (first: number, second: number): number => {
  return Number(new Big(first).mul(new Big(second)));
};

export const div = (first: number, second: number): number => {
  return Number(new Big(first).div(new Big(second)));
};

export const escapeCharForSearch = (str: string): string => {
  return str.toLowerCase().replace(/[?%\\_]/gi, function (x) {
    return '\\' + x;
  });
};

export const handleDataRequest = (request: any): any => {
  let { keyword, sort, filter, take, skip, isGetAll } = request;

  if (keyword !== undefined) {
    keyword = keyword.trim();
  }

  if (filter !== undefined) {
    for (let i = 0; i < filter.length; i++) {
      filter[i].text = filter[i].text.trim();
    }
  }
  return { keyword, sort, filter, take, skip, isGetAll };
};

export enum EnumSort {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum RememberPassword {
  active = 1,
  inactive = 0,
}

export const enumerateDaysBetweenDates = (startDate, endDate) => {
  const dates = [];
  const currDate = moment(startDate).tz(TIME_ZONE_VN).startOf('day');
  const lastDate = moment(endDate).tz(TIME_ZONE_VN).startOf('day');

  do {
    dates.push(currDate.format());
  } while (currDate.add(1, 'days').diff(lastDate) <= 0);
  return dates;
};

export const getUTCOffset = (date, timeZone) => {
  const dateComponents = date
    .toLocaleString('sv', { timeZone })
    .split(/[\-\s:]/);
  const utcDate = Date.UTC(
    Number(dateComponents[0]),
    Number(dateComponents[1]) - 1,
    Number(dateComponents[2]),
    Number(dateComponents[3]),
    Number(dateComponents[4]),
    Number(dateComponents[5]),
  );
  return new Date(utcDate);
};

// SEARCH SERVICE
export const searchService = (data, textSearch, fieldSearch): any => {
  const textSearchToLowerCase = textSearch?.toLowerCase();

  if (!isEmpty(data)) {
    return data.filter((x) =>
      x[fieldSearch]?.toLowerCase()?.includes(textSearchToLowerCase),
    );
  }

  return data;
};

// SORT SERVICE
export const sortService = (data, sort, column): any => {
  const fieldSort = sort?.filter((x) => column.includes(x?.column));
  if (!isEmpty(fieldSort)) {
    const sortColumn = fieldSort[0]?.column;
    const sortOrder = fieldSort[0]?.order;

    // SORT OBJECT
    const nestedSort =
      (prop1, prop2 = null, direction = 'asc') =>
      (e1, e2) => {
        let a = prop2 ? e1[prop1][prop2] : e1[prop1];
        let b = prop2 ? e2[prop1][prop2] : e2[prop1];
        const sortOrder = direction === 'asc' || direction === 'ASC' ? 1 : -1;

        if (typeof a == 'string' && typeof b == 'string') {
          a = a?.trim()?.toLowerCase();
          b = b?.trim()?.toLowerCase();
          const index = a.localeCompare(b);
          return index < 0 ? -sortOrder : index > 0 ? sortOrder : 0;
        }

        return a < b ? -sortOrder : a > b ? sortOrder : 0;
      };

    data.sort(nestedSort(sortColumn, null, sortOrder));
  }

  return data;
};

// PAGINATE
export const paginationService = (data, page, limit): any => {
  return data.slice((page - 1) * limit, page * limit);
};

export const generatePermissionCodes = (arr: string[]): string => {
  return arr.join('|');
};

export const checkUserRoleSettings = (user: any) => {
  let isQcDepartMent = false;
  let isAdminOrLeader = false;
  if (!isEmpty(user.departmentSettings)) {
    isQcDepartMent = !isEmpty(
      user.departmentSettings.filter((e) => e.name === QC_DEPARTMENT_NAME.name),
    );
  }
  if (!isEmpty(user.userRoleSettings)) {
    isAdminOrLeader = !isEmpty(
      user.userRoleSettings.filter((e) => ADMIN_LEADER_ROLES.includes(e.name)),
    );
  }
  return isQcDepartMent && isAdminOrLeader;
};

export const extractWorkOrderIdFromQrCode = (qrCode: string): string => {
  return qrCode.replace(WORK_ORDER_CODE_PREFIX, '');
};

export const validateInputQcQuantity = (
  request: ValidateInputQcQuantityRequestDto,
): boolean => {
  const {
    qcQuantity,
    totalUnQcQuantity,
    qcRejectQuantity,
    qcPassQuantity,
    checkListDetails,
  } = request;
  // validate check list details: SUM of each check list detail must be the same
  let isCheckListValid = true;
  let isNoRejectAll = true;
  let totalCheckListRejectQuantity = 0;
  if (!isEmpty(checkListDetails)) {
    let lastCheckListQcPassQuantity = qcQuantity;
    for (let i = 0; i < checkListDetails.length; i++) {
      if (
        checkListDetails[i].qcRejectQuantity !==
        minus(lastCheckListQcPassQuantity, checkListDetails[i].qcPassQuantity)
      ) {
        return false;
      }
      totalCheckListRejectQuantity += checkListDetails[i].qcRejectQuantity;
      if (checkListDetails[i].qcRejectQuantity != 0) {
        isNoRejectAll = false;
      }
      lastCheckListQcPassQuantity = minus(
        lastCheckListQcPassQuantity,
        checkListDetails[i].qcRejectQuantity,
      );
    }
  }

  // validate if SUM total check list reject quantity greater than qcQuantity
  if (totalCheckListRejectQuantity > qcQuantity) {
    return false;
  }

  // validate if all check list has qcRejectQuantity = 0
  if (isNoRejectAll && qcRejectQuantity != 0) {
    isCheckListValid = false;
  }

  // validate if all check list has qcRejectQuantity != 0
  if (!isNoRejectAll && qcRejectQuantity == 0) {
    isCheckListValid = false;
  }

  if (!isCheckListValid) {
    return false;
  }

  // validate if qcQuantity = plus(qcRejectQuantity, qcPassQuantity)
  if (qcQuantity != plus(qcRejectQuantity, qcPassQuantity)) {
    return false;
  }

  // validate if qcQuantity greater than totalUnQcQuantity
  if (qcQuantity > totalUnQcQuantity) {
    return false;
  }
  return true;
};

export const checkQcEmployeeRole = (user: any): boolean => {
  // Check permissions by department and roles
  if (!isEmpty(user.userRoleSettings) && !isEmpty(user.departmentSettings)) {
    const userRoles = user.userRoleSettings.filter(
      (x) => ALL_ROLES_CONST.EMPLOYEE.code === x.code,
    );
    const userDepartments = user.departmentSettings.filter(
      (x) => ALL_DEPARTMENTS_CONST.QC.id === x.id,
    );

    if (!isEmpty(userRoles) && !isEmpty(userDepartments)) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};
