import {MigrationInterface, QueryRunner} from "typeorm";

export class refractorColumnTransactionHistoryLogTimesTable1637552378889 implements MigrationInterface {
    name = 'refractorColumnTransactionHistoryLogTimesTable1637552378889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" DROP COLUMN "is_completed"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_history_log_times_is_completed_enum"`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" DROP COLUMN "is_auto"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_history_log_times_is_auto_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_history_log_times_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" ADD "status" "public"."transaction_history_log_times_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_history_log_times_type_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" ADD "type" "public"."transaction_history_log_times_type_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_history_log_times_type_enum"`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_history_log_times_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_history_log_times_is_auto_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" ADD "is_auto" "public"."transaction_history_log_times_is_auto_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_history_log_times_is_completed_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" ADD "is_completed" "public"."transaction_history_log_times_is_completed_enum"`);
    }

}
