import {MigrationInterface, QueryRunner} from "typeorm";

export class refactorQualityPlanTable1637051672886 implements MigrationInterface {
    name = 'refactorQualityPlanTable1637051672886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_plan_boms" DROP COLUMN "quality_point_user_id"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_boms" DROP COLUMN "plan_error_rate"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_boms" ADD "plan_error_rate" numeric(10,2) DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_plan_boms" DROP COLUMN "plan_error_rate"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_boms" ADD "plan_error_rate" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "quality_plan_boms" ADD "quality_point_user_id" integer NOT NULL`);
    }

}
