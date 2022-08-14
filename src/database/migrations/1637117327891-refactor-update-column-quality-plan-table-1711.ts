import {MigrationInterface, QueryRunner} from "typeorm";

export class refactorUpdateColumnQualityPlanTable17111637117327891 implements MigrationInterface {
    name = 'refactorUpdateColumnQualityPlanTable17111637117327891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_plan_boms" ADD "key_bom_tree" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quality_plan_boms" ALTER COLUMN "bom_id" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_plan_boms" ALTER COLUMN "bom_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quality_plan_boms" DROP COLUMN "key_bom_tree"`);
    }

}
