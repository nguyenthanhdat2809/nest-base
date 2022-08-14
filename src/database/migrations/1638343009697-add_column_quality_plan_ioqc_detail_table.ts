import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnQualityPlanIoqcDetailTable1638343009697 implements MigrationInterface {
    name = 'addColumnQualityPlanIoqcDetailTable1638343009697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_details" ADD "qc_done_quantity" numeric(10,2) DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqc_details" DROP COLUMN "qc_done_quantity"`);
    }

}
