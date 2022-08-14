import { BaseAbstractRepository } from "@core/repository/base.abstract.repository";
import { CheckListDetailRepositoryInterface } from "@components/check-list/interface/check-list-detail.repository.interface";
import { CheckListDetail } from "@entities/check-list/check-list-detail.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { join } from "lodash";
import { Repository } from "typeorm";

@Injectable()
export class CheckListDetailRepository
extends BaseAbstractRepository<CheckListDetail>
implements CheckListDetailRepositoryInterface {
  constructor(
    @InjectRepository(CheckListDetail)
    private readonly checkListDetailRepository: Repository<CheckListDetail>,
    ) {
    super(checkListDetailRepository);
  }

  createEntity(data: any): CheckListDetail {
    const {
      checkListId,
      title,
      descriptionContent,
      checkType,
      norm,
      valueTop,
      valueBottom,
      errorGroupId,
      itemUnitId,
    } = data;
    const entity = new CheckListDetail();
    entity.checkListId = checkListId;
    entity.title = title;
    entity.descriptionContent = descriptionContent;
    entity.checkType = checkType;
    entity.norm = norm;
    entity.valueTop = valueTop;
    entity.valueBottom = valueBottom;
    entity.errorGroupId = errorGroupId;
    entity.itemUnitId = itemUnitId;
    return entity;
  }
}
