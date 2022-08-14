import { IsArray, IsInt, IsNotEmpty } from "class-validator";

export class BaseCheckOwnerPermissionRequestDto {
  @IsNotEmpty()
  user: any;
  @IsNotEmpty()
  @IsInt()
  record: any;
  @IsNotEmpty()
  @IsArray()
  departmentIds: number[];
  @IsNotEmpty()
  @IsArray()
  roleCodes: string[];
}