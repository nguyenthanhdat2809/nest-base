import {MigrationInterface, QueryRunner} from "typeorm";

export class createTransactionHistoryIoqcTableAndUpdatePlanIoqcTable1638164352380 implements MigrationInterface {
    name = 'createTransactionHistoryIoqcTableAndUpdatePlanIoqcTable1638164352380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction_histories_ioqcs" ("id" SERIAL NOT NULL, "transaction_history_id" integer NOT NULL, "plan_quantity" numeric(10,2) DEFAULT '0', "qc_need_quantity" numeric(10,2) DEFAULT '0', "qc_done_quantity" numeric(10,2) DEFAULT '0', "qc_pass_quantity" numeric(10,2) DEFAULT '0', "qc_reject_quantity" numeric(10,2) DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "REL_1eb922a94b24fa1e4a2ce83a15" UNIQUE ("transaction_history_id"), CONSTRAINT "PK_0160b38effb8df064c1dfc928cf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" ADD "play_time" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_details" ADD "qc_pass_quantity" numeric(10,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_details" ADD "qc_reject_quantity" numeric(10,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "plan_quantity" numeric(10,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_details" DROP COLUMN "plan_qc_quantity"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_details" ADD "plan_qc_quantity" numeric(10,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "actual_quantity"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "actual_quantity" numeric(10,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "qc_reject_quantity"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "qc_reject_quantity" numeric(10,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "qc_pass_quantity"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "qc_pass_quantity" numeric(10,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "error_quantity"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "error_quantity" numeric(10,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "transaction_histories_ioqcs" ADD CONSTRAINT "FK_1eb922a94b24fa1e4a2ce83a153" FOREIGN KEY ("transaction_history_id") REFERENCES "transaction_histories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories_ioqcs" DROP CONSTRAINT "FK_1eb922a94b24fa1e4a2ce83a153"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "error_quantity"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "error_quantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "qc_pass_quantity"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "qc_pass_quantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "qc_reject_quantity"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "qc_reject_quantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "actual_quantity"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "actual_quantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_details" DROP COLUMN "plan_qc_quantity"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_details" ADD "plan_qc_quantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "plan_quantity"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_details" DROP COLUMN "qc_reject_quantity"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_details" DROP COLUMN "qc_pass_quantity"`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" DROP COLUMN "play_time"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "quantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE "transaction_histories_ioqcs"`);
    }

}
