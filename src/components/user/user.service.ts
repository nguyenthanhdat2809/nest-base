import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserServiceInterface } from './interface/user.service.interface';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @Inject('USER_SERVICE_CLIENT')
    private readonly userServiceClient: ClientProxy,
  ) {}

  async getListByIDs(ids: number[], relation?: string[]): Promise<any> {
    try {
      const response = await this.userServiceClient
        .send('get_users_by_ids', { userIds: ids, relation })
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response.data;
    } catch (err) {
      return [];
    }
  }

  async getUserList(params: any): Promise<any> {
    try {
      const response = await this.userServiceClient
        .send('list', params)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }

      return response?.data?.items;
    } catch (err) {
      return [];
    }
  }

  async getUserByID(id: number): Promise<any> {
    try {
      const response = await this.userServiceClient
        .send('detail', { id: id })
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return '';
      }

      return response.data;
    } catch (err) {
      return '';
    }
  }

  async getUserMapByIds(userIds: number[]): Promise<Map<number, string>> {
    return new Map(
      (await this.getListByIDs(userIds)).map((user) => [
        user.id,
        user.username,
      ]),
    );
  }

  async getList(): Promise<any> {
    try {
      const response = await this.userServiceClient
        .send('list', { isGetAll: '1' })
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }

      return response?.data;
    } catch (err) {
      return [];
    }
  }

  async getUserByConditions(request: any): Promise<any> {
    try {
      const response = await this.userServiceClient
        .send('list', request)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }

      return response?.data;
    } catch (err) {
      return [];
    }
  }

  public async insertPermission(permissions): Promise<any> {
    return await this.userServiceClient
      .send('insert_permission', permissions)
      .toPromise();
  }

  public async deletePermissionNotActive(): Promise<any> {
    return await this.userServiceClient
      .send('delete_permission_not_active', {})
      .toPromise();
  }
}
