import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnQualityPointTable1645435913756 implements MigrationInterface {
    name = 'addColumnQualityPointTable1645435913756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_points" ADD "product_type" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_points" DROP COLUMN "product_type"`);
    }

}
