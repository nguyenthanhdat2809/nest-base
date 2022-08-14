import * as dotenv from 'dotenv';
dotenv.config();

export enum APIPrefix {
  Version = 'api/v1',
}

export const jwtConstants = {
  acessTokenSecret: process.env.JWT_ACESS_TOKEN_SECRET,
  acessTokenExpiresIn: process.env.JWT_ACESS_TOKEN_EXPIRES_IN || 1800,
  refeshTokenSecret: process.env.JWT_RESFRESH_TOKEN_SECRET,
  refeshTokenExpiresIn: process.env.JWT_RESFRESH_TOKEN_EXPIRES_IN || 2000,
  refeshTokenExpiresMaxIn:
    process.env.JWT_RESFRESH_TOKEN_EXPIRES_MAX_IN || 432000,
};

export const APP_CONST = {
  DATE_FILTER_SEPARATOR: '|',
};

export const DEFAULT_INIT_PAGE_SIZE = 10;
export const TIME_ZONE_VN = "Asia/Ho_Chi_Minh";

export const IS_EXPORT = true;

//permission
export enum StatusPermission {
  ACTIVE = 1,
  INACTIVE = 0,
}

export const FORMAT_CODE_PERMISSION = 'QUALITY_CONTROL_';