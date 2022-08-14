import {MigrationInterface, QueryRunner} from "typeorm";

export class addExecutionDateByPlanColumnTransactionHistoryTable1639822264346 implements MigrationInterface {
    name = 'addExecutionDateByPlanColumnTransactionHistoryTable1639822264346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories" ADD "execution_date_by_plan" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories" DROP COLUMN "execution_date_by_plan"`);
    }

}
