import {MigrationInterface, QueryRunner} from "typeorm";

export class addActionCategoryIdToErrorReportErrorDetailTable1638177341719 implements MigrationInterface {
    name = 'addActionCategoryIdToErrorReportErrorDetailTable1638177341719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "error_report_error_details" ADD "action_category_id" integer`);
        await queryRunner.query(`ALTER TABLE "error_report_error_details" ADD CONSTRAINT "FK_f10c3b44bd9b52454a1d2295128" FOREIGN KEY ("action_category_id") REFERENCES "action_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "error_report_error_details" DROP CONSTRAINT "FK_f10c3b44bd9b52454a1d2295128"`);
        await queryRunner.query(`ALTER TABLE "error_report_error_details" DROP COLUMN "action_category_id"`);
    }

}
