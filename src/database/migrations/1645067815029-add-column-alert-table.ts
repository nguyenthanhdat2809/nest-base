import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnAlertTable1645067815029 implements MigrationInterface {
    name = 'addColumnAlertTable1645067815029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alerts" ADD "product_type" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alerts" DROP COLUMN "product_type"`);
    }

}
