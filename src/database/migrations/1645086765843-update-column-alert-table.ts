import {MigrationInterface, QueryRunner} from "typeorm";

export class updateColumnAlertTable1645086765843 implements MigrationInterface {
    name = 'updateColumnAlertTable1645086765843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alerts" DROP COLUMN "product_type"`);
        await queryRunner.query(`CREATE TYPE "public"."alerts_product_type_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`ALTER TABLE "alerts" ADD "product_type" "public"."alerts_product_type_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alerts" DROP COLUMN "product_type"`);
        await queryRunner.query(`DROP TYPE "public"."alerts_product_type_enum"`);
        await queryRunner.query(`ALTER TABLE "alerts" ADD "product_type" json`);
    }

}
