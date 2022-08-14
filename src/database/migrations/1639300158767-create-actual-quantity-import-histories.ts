import {MigrationInterface, QueryRunner} from "typeorm";

export class createActualQuantityImportHistories1639300158767 implements MigrationInterface {
    name = 'createActualQuantityImportHistories1639300158767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "actual_quantity_import_histories" ("id" SERIAL NOT NULL, "qc_stage_id" integer NOT NULL, "order_id" integer NOT NULL, "warehouse_id" integer NOT NULL, "item_id" integer NOT NULL, "actual_quantity" numeric(10,2) DEFAULT '0', "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_d50ccb2bba0ba026c63a744f46d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "actual_quantity_import_histories"`);
    }

}
