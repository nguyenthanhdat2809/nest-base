import {MigrationInterface, QueryRunner} from "typeorm";

export class addWorkOrderIdQualityPlanBomTable1638847897282 implements MigrationInterface {
    name = 'addWorkOrderIdQualityPlanBomTable1638847897282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_plan_boms" ADD "work_order_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_plan_boms" DROP COLUMN "work_order_id"`);
    }

}
