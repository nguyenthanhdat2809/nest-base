import {MigrationInterface, QueryRunner} from "typeorm";

export class addNumberOfTimeQcUserPlan1642578005837 implements MigrationInterface {
    name = 'addNumberOfTimeQcUserPlan1642578005837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."quality_plan_ioqc_quality_point_users_number_of_time_qc_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_quality_point_users" ADD "number_of_time_qc" "public"."quality_plan_ioqc_quality_point_users_number_of_time_qc_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."quality_plan_bom_quality_point_users_number_of_time_qc_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`ALTER TABLE "quality_plan_bom_quality_point_users" ADD "number_of_time_qc" "public"."quality_plan_bom_quality_point_users_number_of_time_qc_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_plan_bom_quality_point_users" DROP COLUMN "number_of_time_qc"`);
        await queryRunner.query(`DROP TYPE "public"."quality_plan_bom_quality_point_users_number_of_time_qc_enum"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_quality_point_users" DROP COLUMN "number_of_time_qc"`);
        await queryRunner.query(`DROP TYPE "public"."quality_plan_ioqc_quality_point_users_number_of_time_qc_enum"`);
    }

}
