import {MigrationInterface, QueryRunner} from "typeorm";

export class refactorQualityPlanTable1637639317747 implements MigrationInterface {
    name = 'refactorQualityPlanTable1637639317747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "actual_quantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "quantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "qc_reject_quantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "qc_pass_quantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "error_quantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE TYPE "public"."quality_plan_ioqcs_qc_check_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "qc_check" "public"."quality_plan_ioqcs_qc_check_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "qc_check"`);
        await queryRunner.query(`DROP TYPE "public"."quality_plan_ioqcs_qc_check_enum"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "error_quantity"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "qc_pass_quantity"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "qc_reject_quantity"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "actual_quantity"`);
    }

}
