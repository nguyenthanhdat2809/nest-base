import {MigrationInterface, QueryRunner} from "typeorm";

export class refactorMigrationPlanIoqcTable21111637485352592 implements MigrationInterface {
    name = 'refactorMigrationPlanIoqcTable21111637485352592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" ADD "ordinal_number" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quality_plan_ioqcs" DROP COLUMN "ordinal_number"`);
    }

}
