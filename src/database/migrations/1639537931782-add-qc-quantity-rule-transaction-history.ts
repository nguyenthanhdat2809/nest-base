import {MigrationInterface, QueryRunner} from "typeorm";

export class addQcQuantityRuleTransactionHistory1639537931782 implements MigrationInterface {
    name = 'addQcQuantityRuleTransactionHistory1639537931782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories" ADD "qc_quantity_rule" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories" DROP COLUMN "qc_quantity_rule"`);
    }

}
