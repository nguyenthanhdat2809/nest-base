import {MigrationInterface, QueryRunner} from "typeorm";

export class addItemTypeQcHistory1640427751927 implements MigrationInterface {
    name = 'addItemTypeQcHistory1640427751927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."transaction_histories_item_type_enum" RENAME TO "transaction_histories_item_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_histories_item_type_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "transaction_histories" ALTER COLUMN "item_type" TYPE "public"."transaction_histories_item_type_enum" USING "item_type"::"text"::"public"."transaction_histories_item_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_histories_item_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_histories_item_type_enum_old" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "transaction_histories" ALTER COLUMN "item_type" TYPE "public"."transaction_histories_item_type_enum_old" USING "item_type"::"text"::"public"."transaction_histories_item_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_histories_item_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_histories_item_type_enum_old" RENAME TO "transaction_histories_item_type_enum"`);
    }

}
