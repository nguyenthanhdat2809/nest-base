import {MigrationInterface, QueryRunner} from "typeorm";

export class addMoIdAndProducingStepIdTransactionHistoriesTable1646640304656 implements MigrationInterface {
    name = 'addMoIdAndProducingStepIdTransactionHistoriesTable1646640304656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories" ADD "mo_id" integer`);
        await queryRunner.query(`ALTER TABLE "transaction_histories" ADD "producing_step_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories" DROP COLUMN "producing_step_id"`);
        await queryRunner.query(`ALTER TABLE "transaction_histories" DROP COLUMN "mo_id"`);
    }

}
