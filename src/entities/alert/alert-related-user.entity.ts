import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Alert } from '../alert/alert.entity';

@Entity({ name: 'alert_related_users' })
export class AlertRelatedUser {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'int',
  })
  alertId: number;

  @Column({
    type: 'int',
  })
  userId: number;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @ManyToOne(() => Alert, (alert) => alert.alertRelatedUsers)
  alert: Alert;
}
