import {MigrationInterface, QueryRunner} from "typeorm";

export class addNulllableTransactionHistoryIdLogTime1637288631484 implements MigrationInterface {
    name = 'addNulllableTransactionHistoryIdLogTime1637288631484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" DROP CONSTRAINT "FK_81aef2d9a2706995e34e3ffffcd"`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" ALTER COLUMN "transaction_history_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" ADD CONSTRAINT "FK_81aef2d9a2706995e34e3ffffcd" FOREIGN KEY ("transaction_history_id") REFERENCES "transaction_histories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" DROP CONSTRAINT "FK_81aef2d9a2706995e34e3ffffcd"`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" ALTER COLUMN "transaction_history_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" ADD CONSTRAINT "FK_81aef2d9a2706995e34e3ffffcd" FOREIGN KEY ("transaction_history_id") REFERENCES "transaction_histories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
