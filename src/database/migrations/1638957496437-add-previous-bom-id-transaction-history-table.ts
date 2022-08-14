import {MigrationInterface, QueryRunner} from "typeorm";

export class addPreviousBomIdTransactionHistoryTable1638957496437 implements MigrationInterface {
    name = 'addPreviousBomIdTransactionHistoryTable1638957496437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories" ADD "previous_bom_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories" DROP COLUMN "previous_bom_id"`);
    }

}
