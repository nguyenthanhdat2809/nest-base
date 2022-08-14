import {MigrationInterface, QueryRunner} from "typeorm";

export class addConsignmentTransactionHistoryTable1639369403845 implements MigrationInterface {
    name = 'addConsignmentTransactionHistoryTable1639369403845'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories" ADD "consignment_id" integer`);
        await queryRunner.query(`ALTER TABLE "transaction_histories" ADD "consignment_name" character varying(20)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories" DROP COLUMN "consignment_name"`);
        await queryRunner.query(`ALTER TABLE "transaction_histories" DROP COLUMN "consignment_id"`);
    }

}
