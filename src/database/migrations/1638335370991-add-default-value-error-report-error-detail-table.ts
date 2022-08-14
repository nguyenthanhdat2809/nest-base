import {MigrationInterface, QueryRunner} from "typeorm";

export class addDefaultValueErrorReportErrorDetailTable1638335370991 implements MigrationInterface {
    name = 'addDefaultValueErrorReportErrorDetailTable1638335370991'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "error_report_error_details" ALTER COLUMN "error_item_quantity" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "error_report_error_details" ALTER COLUMN "error_item_quantity" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "error_report_error_details" ALTER COLUMN "repair_item_quantity" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "error_report_error_details" ALTER COLUMN "repair_item_quantity" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "error_report_error_details" ALTER COLUMN "error_item_quantity" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "error_report_error_details" ALTER COLUMN "error_item_quantity" SET NOT NULL`);
    }

}
