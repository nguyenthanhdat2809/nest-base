import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { ALERT_DB } from '@components/alert/alert.constant';
import { AlertRelatedUser } from '../alert/alert-related-user.entity';

export enum status {
  ACTIVE = 1,
  IN_ACTIVE = 0,
}

export enum typeAlert {
  OP = 1,
  INPUT = 2,
  OUTPUT = 3,
}

export enum ProductTypeAlert {
  material = 1, // Nguyên vật liệu
  productPrevious = 2 // Sản phẩm công đoạn trước
};

export type ProductType = {
  material: number,
  productPrevious: number
};

@Entity({ name: 'alerts' })
export class Alert {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: ALERT_DB.CODE.MAX_LENGTH,
    unique: true,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: ALERT_DB.NAME.MAX_LENGTH,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: ALERT_DB.DESCRIPTION.MAX_LENGTH,
    nullable: true,
  })
  description: string;

  @Column({
    type: 'int',
  })
  stage: number;

  @Column({
    type: 'int',
  })
  itemId: number;

  @Column({
    type: 'enum',
    enum: status,
    default: status.IN_ACTIVE,
  })
  status: number;

  @Column({
    type: 'enum',
    enum: typeAlert,
  })
  typeAlert: number;

  @Column({
    type: 'int',
  })
  userId: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  manufacturingOrderId: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  routingId: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  producingStepId: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  purchasedOrderId: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  warehouseId: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  errorReportId: number;

  @Column({
    type: 'enum',
    enum: ProductTypeAlert,
    nullable: true,
  })
  productType: number;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;

  @OneToMany(() => AlertRelatedUser, alertRelatedUser => alertRelatedUser.alert)
  alertRelatedUsers: AlertRelatedUser[];
}
