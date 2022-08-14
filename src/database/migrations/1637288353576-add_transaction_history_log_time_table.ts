import {MigrationInterface, QueryRunner} from "typeorm";

export class addTransactionHistoryLogTimeTable1637288353576 implements MigrationInterface {
    name = 'addTransactionHistoryLogTimeTable1637288353576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "transaction_history_log_times_is_completed_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TYPE "transaction_history_log_times_is_auto_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "transaction_history_log_times" ("id" SERIAL NOT NULL, "start_time" TIMESTAMP WITH TIME ZONE, "end_time" TIMESTAMP WITH TIME ZONE, "duration" numeric(4,2), "is_completed" "transaction_history_log_times_is_completed_enum", "is_auto" "transaction_history_log_times_is_auto_enum", "transaction_history_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_81aef2d9a2706995e34e3ffffc" UNIQUE ("transaction_history_id"), CONSTRAINT "PK_b9e3931eb0b25becc3d95b0b764" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" ADD CONSTRAINT "FK_81aef2d9a2706995e34e3ffffcd" FOREIGN KEY ("transaction_history_id") REFERENCES "transaction_histories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" DROP CONSTRAINT "FK_81aef2d9a2706995e34e3ffffcd"`);
        await queryRunner.query(`DROP TABLE "transaction_history_log_times"`);
        await queryRunner.query(`DROP TYPE "transaction_history_log_times_is_auto_enum"`);
        await queryRunner.query(`DROP TYPE "transaction_history_log_times_is_completed_enum"`);
    }

}
