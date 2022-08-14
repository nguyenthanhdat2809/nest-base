import {MigrationInterface, QueryRunner} from "typeorm";

export class addTransactionHistoryTypeEnum1638593858032 implements MigrationInterface {
    name = 'addTransactionHistoryTypeEnum1638593858032'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."transaction_histories_type_enum" RENAME TO "transaction_histories_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_histories_type_enum" AS ENUM('0', '2', '3', '5', '8', '9')`);
        await queryRunner.query(`ALTER TABLE "transaction_histories" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "transaction_histories" ALTER COLUMN "type" TYPE "public"."transaction_histories_type_enum" USING "type"::"text"::"public"."transaction_histories_type_enum"`);
        await queryRunner.query(`ALTER TABLE "transaction_histories" ALTER COLUMN "type" SET DEFAULT '8'`);
        await queryRunner.query(`DROP TYPE "public"."transaction_histories_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_histories_type_enum_old" AS ENUM('0', '2', '3', '5', '8')`);
        await queryRunner.query(`ALTER TABLE "transaction_histories" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "transaction_histories" ALTER COLUMN "type" TYPE "public"."transaction_histories_type_enum_old" USING "type"::"text"::"public"."transaction_histories_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "transaction_histories" ALTER COLUMN "type" SET DEFAULT '8'`);
        await queryRunner.query(`DROP TYPE "public"."transaction_histories_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_histories_type_enum_old" RENAME TO "transaction_histories_type_enum"`);
    }

}
