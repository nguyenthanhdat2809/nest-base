import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnTransactionHistoryTable1639825108232 implements MigrationInterface {
    name = 'addColumnTransactionHistoryTable1639825108232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories" ADD "quality_point_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories" DROP COLUMN "quality_point_id"`);
    }

}
