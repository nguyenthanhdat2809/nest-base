import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnsActualQuantityImportHistoriesTable1646212598347 implements MigrationInterface {
    name = 'addColumnsActualQuantityImportHistoriesTable1646212598347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "actual_quantity_import_histories" ADD "mo_id" integer`);
        await queryRunner.query(`ALTER TABLE "actual_quantity_import_histories" ADD "producing_step_id" integer`);
        await queryRunner.query(`ALTER TABLE "actual_quantity_import_histories" ALTER COLUMN "warehouse_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "actual_quantity_import_histories" ALTER COLUMN "item_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "actual_quantity_import_histories" ALTER COLUMN "item_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "actual_quantity_import_histories" ALTER COLUMN "warehouse_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "actual_quantity_import_histories" DROP COLUMN "producing_step_id"`);
        await queryRunner.query(`ALTER TABLE "actual_quantity_import_histories" DROP COLUMN "mo_id"`);
    }

}
