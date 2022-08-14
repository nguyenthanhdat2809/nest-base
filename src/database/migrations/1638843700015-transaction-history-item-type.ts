import {MigrationInterface, QueryRunner} from "typeorm";

export class transactionHistoryItemType1638843700015 implements MigrationInterface {
    name = 'transactionHistoryItemType1638843700015'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_histories_item_type_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "transaction_histories" ADD "item_type" "public"."transaction_histories_item_type_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories" DROP COLUMN "item_type"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_histories_item_type_enum"`);
    }

}
