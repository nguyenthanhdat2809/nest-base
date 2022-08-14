import {MigrationInterface, QueryRunner} from "typeorm";

export class refactorPlanAndCreateIoqcPlanTable1637216162359 implements MigrationInterface {
    name = 'refactorPlanAndCreateIoqcPlanTable1637216162359'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_plans" RENAME COLUMN "mo_id" TO "type"`);
        await queryRunner.query(`CREATE TABLE "quality_plan_ioqc_quality_point_users" ("id" SERIAL NOT NULL, "quality_plan_i_oqc_id" integer NOT NULL, "user_id" integer NOT NULL, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_dda46d7ea8b34d239741e6de3af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quality_plan_ioqcs" ("id" SERIAL NOT NULL, "quality_plan_id" integer NOT NULL, "order_id" integer NOT NULL, "warehouse_id" integer NOT NULL, "item_id" integer NOT NULL, "quality_point_id" integer NOT NULL, "plan_error_rate" numeric(10,2) DEFAULT '0', "plan_from" TIMESTAMP WITH TIME ZONE NOT NULL, "plan_to" TIMESTAMP WITH TIME ZONE NOT NULL, "plan_qc_quantity" integer NOT NULL DEFAULT '0', "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_65e38601c6c2c342df176361717" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quality_plans" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "quality_plans_type_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "quality_plans" ADD "type" "quality_plans_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_quality_point_users" ADD CONSTRAINT "FK_3514a378d0fdadc2104cf2f978c" FOREIGN KEY ("quality_plan_i_oqc_id") REFERENCES "quality_plan_ioqcs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD CONSTRAINT "FK_ea06fdf6816baf8a8d8df3caaa3" FOREIGN KEY ("quality_plan_id") REFERENCES "quality_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP CONSTRAINT "FK_ea06fdf6816baf8a8d8df3caaa3"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_quality_point_users" DROP CONSTRAINT "FK_3514a378d0fdadc2104cf2f978c"`);
        await queryRunner.query(`ALTER TABLE "quality_plans" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "quality_plans_type_enum"`);
        await queryRunner.query(`ALTER TABLE "quality_plans" ADD "type" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE "quality_plan_ioqcs"`);
        await queryRunner.query(`DROP TABLE "quality_plan_ioqc_quality_point_users"`);
        await queryRunner.query(`ALTER TABLE "quality_plans" RENAME COLUMN "type" TO "mo_id"`);
    }

}
