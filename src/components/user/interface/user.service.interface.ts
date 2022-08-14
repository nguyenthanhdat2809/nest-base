export interface UserServiceInterface {
  getUserByID(id: number): Promise<any>;
  getListByIDs(idList: number[]): Promise<any>;
  getUserMapByIds(idList: number[]): Promise<Map<number, string>>;
  getList(): Promise<any>;
  getUserByConditions(request: any): Promise<any>;
  insertPermission(permissions): Promise<any>;
  deletePermissionNotActive(): Promise<any>;
}
