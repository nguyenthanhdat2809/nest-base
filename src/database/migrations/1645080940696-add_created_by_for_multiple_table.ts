import {MigrationInterface, QueryRunner} from "typeorm";

export class addCreatedByForMultipleTable1645080940696 implements MigrationInterface {
    name = 'addCreatedByForMultipleTable1645080940696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_points" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "check_lists" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "error_groups" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "cause_groups" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "action_categories" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "work_center_plan_qc_shifts" ADD "created_by" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_center_plan_qc_shifts" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "action_categories" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "cause_groups" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "error_groups" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "check_lists" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "quality_points" DROP COLUMN "created_by"`);
    }

}
