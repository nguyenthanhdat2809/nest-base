import {MigrationInterface, QueryRunner} from "typeorm";

export class addStatusTransactionHistoryLogEnum1637564585263 implements MigrationInterface {
    name = 'addStatusTransactionHistoryLogEnum1637564585263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."transaction_history_log_times_status_enum" RENAME TO "transaction_history_log_times_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_history_log_times_status_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" ALTER COLUMN "status" TYPE "public"."transaction_history_log_times_status_enum" USING "status"::"text"::"public"."transaction_history_log_times_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_history_log_times_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_history_log_times_status_enum_old" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" ALTER COLUMN "status" TYPE "public"."transaction_history_log_times_status_enum_old" USING "status"::"text"::"public"."transaction_history_log_times_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_history_log_times_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_history_log_times_status_enum_old" RENAME TO "transaction_history_log_times_status_enum"`);
    }

}
