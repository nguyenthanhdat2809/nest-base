import { BaseInterfaceRepository } from './base.interface.repository';

import { DeleteResult, Repository } from 'typeorm';
import { BASE_ENTITY_CONST } from '@constant/entity.constant';

export abstract class BaseAbstractRepository<T>
  implements BaseInterfaceRepository<T>
{
  private entity: Repository<T>;
  protected readonly fieldMap = new Map();

  protected constructor(entity: Repository<T>) {
    this.entity = entity;

    this.fieldMap.set(
      BASE_ENTITY_CONST.CREATED_AT.COL_NAME.toLowerCase(),
      BASE_ENTITY_CONST.CREATED_AT.DB_COL_NAME,
    );
    this.fieldMap.set(
      BASE_ENTITY_CONST.UPDATED_AT.COL_NAME.toLowerCase(),
      BASE_ENTITY_CONST.UPDATED_AT.DB_COL_NAME,
    );
  }

  createEntity(data: any): T {
    throw new Error('Method not implemented.');
  }

  public async create(data: T | any): Promise<T> {
    return await this.entity.save(data);
  }

  public async update(data: T | any): Promise<T> {
    return await this.entity.save(data);
  }

  public async findOneById(id: number): Promise<T> {
    return await this.entity.findOne(id);
  }

  public async findByCondition(filterCondition: any): Promise<T[]> {
    return await this.entity.find({ where: filterCondition });
  }

  public async findOneByCondition(condition: any): Promise<T> {
    return await this.entity.findOne(condition);
  }

  public async findAndCount(filterCondition: any): Promise<any> {
    return await this.entity.findAndCount(filterCondition);
  }

  public async findWithRelations(relations: any): Promise<T[]> {
    return await this.entity.find(relations);
  }

  public async findAll(): Promise<T[]> {
    return await this.entity.find();
  }

  public async remove(id: number): Promise<DeleteResult> {
    return await this.entity.delete(id);
  }

  public async softDelete(id: number): Promise<DeleteResult> {
    return await this.entity
      .createQueryBuilder()
      .softDelete()
      .where('id = :id', { id: id })
      .execute();
  }
}
