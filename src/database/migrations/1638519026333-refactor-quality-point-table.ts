import {MigrationInterface, QueryRunner} from "typeorm";

export class refactorQualityPointTable1638519026333 implements MigrationInterface {
    name = 'refactorQualityPointTable1638519026333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_points" ADD "error_acceptance_rate" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_points" DROP COLUMN "error_acceptance_rate"`);
    }

}
