import { MigrationInterface, QueryRunner } from 'typeorm';

export class addWorkCenterColumnTransactionHistoriesTable1637046147858
  implements MigrationInterface
{
  name = 'addWorkCenterColumnTransactionHistoriesTable1637046147858';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction_histories" ADD "work_center_id" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction_histories" DROP COLUMN "work_center_id"`,
    );
  }
}
