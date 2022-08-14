import {MigrationInterface, QueryRunner} from "typeorm";

export class removeColumnTransactionHistoryTable1645686785021 implements MigrationInterface {
    name = 'removeColumnTransactionHistoryTable1645686785021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories" DROP COLUMN "consignment_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories" ADD "consignment_id" integer`);
    }

}
