import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnQualityPlanTable1644813803929 implements MigrationInterface {
    name = 'addColumnQualityPlanTable1644813803929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_plans" ADD "created_by" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_plans" DROP COLUMN "created_by"`);
    }

}
