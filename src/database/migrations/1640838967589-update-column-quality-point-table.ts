import {MigrationInterface, QueryRunner} from "typeorm";

export class updateColumnQualityPointTable1640838967589 implements MigrationInterface {
    name = 'updateColumnQualityPointTable1640838967589'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_points" ALTER COLUMN "item_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quality_points" ALTER COLUMN "stage" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_points" ALTER COLUMN "stage" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quality_points" ALTER COLUMN "item_id" SET NOT NULL`);
    }

}
