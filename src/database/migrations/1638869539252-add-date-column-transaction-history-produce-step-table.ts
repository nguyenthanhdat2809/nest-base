import {MigrationInterface, QueryRunner} from "typeorm";

export class addDateColumnTransactionHistoryProduceStepTable1638869539252 implements MigrationInterface {
    name = 'addDateColumnTransactionHistoryProduceStepTable1638869539252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories_produce_steps" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "transaction_histories_produce_steps" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "transaction_histories_produce_steps" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories_produce_steps" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "transaction_histories_produce_steps" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "transaction_histories_produce_steps" DROP COLUMN "created_at"`);
    }

}
