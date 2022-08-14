import {MigrationInterface, QueryRunner} from "typeorm";

export class refactorColumnCheckListTable1640575834964 implements MigrationInterface {
    name = 'refactorColumnCheckListTable1640575834964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "check_list_details" DROP COLUMN "norm"`);
        await queryRunner.query(`ALTER TABLE "check_list_details" ADD "norm" numeric(10,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "check_list_details" DROP COLUMN "value_top"`);
        await queryRunner.query(`ALTER TABLE "check_list_details" ADD "value_top" numeric(10,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "check_list_details" DROP COLUMN "value_bottom"`);
        await queryRunner.query(`ALTER TABLE "check_list_details" ADD "value_bottom" numeric(10,2) DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "check_list_details" DROP COLUMN "value_bottom"`);
        await queryRunner.query(`ALTER TABLE "check_list_details" ADD "value_bottom" integer`);
        await queryRunner.query(`ALTER TABLE "check_list_details" DROP COLUMN "value_top"`);
        await queryRunner.query(`ALTER TABLE "check_list_details" ADD "value_top" integer`);
        await queryRunner.query(`ALTER TABLE "check_list_details" DROP COLUMN "norm"`);
        await queryRunner.query(`ALTER TABLE "check_list_details" ADD "norm" integer`);
    }

}
