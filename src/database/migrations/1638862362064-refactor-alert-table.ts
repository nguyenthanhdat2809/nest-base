import {MigrationInterface, QueryRunner} from "typeorm";

export class refactorAlertTable1638862362064 implements MigrationInterface {
    name = 'refactorAlertTable1638862362064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alerts" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "alerts" ADD "name" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alerts" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "alerts" ADD "name" character varying(50) NOT NULL`);
    }

}
