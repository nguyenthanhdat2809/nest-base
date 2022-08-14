export const ALL_DEPARTMENTS_CONST = {
  WAREHOUSE: {
    id: 1,
    name: 'Kho',
  },
  PRODUCE: {
    id: 2,
    name: 'Sản xuất',
  },
  QC: {
    id: 3,
    name: 'Qc',
  },
  IT: {
    id: 4,
    name: 'IT',
  },
  SALE: {
    id: 5,
    name: 'Bán hàng',
  },
  ADMIN: {
    id: 6,
    name: 'Admin',
  },
};

export const ALL_ROLES_CONST = {
  ADMIN: {
    id: 1,
    name: 'Admin',
    code: '00',
  },
  LEADER: {
    id: 2,
    name: 'Leader',
    code: '05',
  },
  EMPLOYEE: {
    id: 3,
    name: 'Employee',
    code: '02',
  },
  PM: {
    id: 4,
    name: 'PM',
    code: '03',
  },
};

export const BASE_OWNER_DEPARTMENT_IDS = [ALL_DEPARTMENTS_CONST.QC.id];

export const BASE_OWNER_ROLES_CODES = [ALL_ROLES_CONST.EMPLOYEE.code];
