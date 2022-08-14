import {MigrationInterface, QueryRunner} from "typeorm";

export class updateEnumTypeReportErrorReport14121639456830348 implements MigrationInterface {
    name = 'updateEnumTypeReportErrorReport14121639456830348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."error_reports_report_type_enum" RENAME TO "error_reports_report_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."error_reports_report_type_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "error_reports" ALTER COLUMN "report_type" TYPE "public"."error_reports_report_type_enum" USING "report_type"::"text"::"public"."error_reports_report_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."error_reports_report_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."error_reports_report_type_enum_old" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "error_reports" ALTER COLUMN "report_type" TYPE "public"."error_reports_report_type_enum_old" USING "report_type"::"text"::"public"."error_reports_report_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."error_reports_report_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."error_reports_report_type_enum_old" RENAME TO "error_reports_report_type_enum"`);
    }

}
