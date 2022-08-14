import {MigrationInterface, QueryRunner} from "typeorm";

export class refactorUpdatePlanIoqcTable231111637662539457 implements MigrationInterface {
    name = 'refactorUpdatePlanIoqcTable231111637662539457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_quality_point_users" DROP CONSTRAINT "FK_3514a378d0fdadc2104cf2f978c"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_quality_point_users" RENAME COLUMN "quality_plan_i_oqc_id" TO "quality_plan_i_oqc_detail_id"`);
        await queryRunner.query(`CREATE TABLE "quality_plan_ioqc_details" ("id" SERIAL NOT NULL, "quality_plan_i_oqc_id" integer NOT NULL, "ordinal_number" integer NOT NULL, "plan_error_rate" numeric(10,2) DEFAULT '0', "plan_from" TIMESTAMP WITH TIME ZONE NOT NULL, "plan_to" TIMESTAMP WITH TIME ZONE NOT NULL, "plan_qc_quantity" integer NOT NULL DEFAULT '0', "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2bacf5a8e641ec84e9c79529028" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "plan_error_rate"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "ordinal_number"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "plan_qc_quantity"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "plan_to"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "plan_from"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_quality_point_users" ADD CONSTRAINT "FK_69438d8d860bc1fb62c4bf0ac38" FOREIGN KEY ("quality_plan_i_oqc_detail_id") REFERENCES "quality_plan_ioqc_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_details" ADD CONSTRAINT "FK_274ce373bd068ffe152bdfc71a4" FOREIGN KEY ("quality_plan_i_oqc_id") REFERENCES "quality_plan_ioqcs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_details" DROP CONSTRAINT "FK_274ce373bd068ffe152bdfc71a4"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_quality_point_users" DROP CONSTRAINT "FK_69438d8d860bc1fb62c4bf0ac38"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "plan_from" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "plan_to" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "plan_qc_quantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "ordinal_number" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "plan_error_rate" numeric(10,2) DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE "quality_plan_ioqc_details"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_quality_point_users" RENAME COLUMN "quality_plan_i_oqc_detail_id" TO "quality_plan_i_oqc_id"`);
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_quality_point_users" ADD CONSTRAINT "FK_3514a378d0fdadc2104cf2f978c" FOREIGN KEY ("quality_plan_i_oqc_id") REFERENCES "quality_plan_ioqcs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
