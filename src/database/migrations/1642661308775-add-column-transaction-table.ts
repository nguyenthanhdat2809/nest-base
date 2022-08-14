import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnTransactionTable1642661308775 implements MigrationInterface {
    name = 'addColumnTransactionTable1642661308775'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_histories_number_of_time_qc_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`ALTER TABLE "transaction_histories" ADD "number_of_time_qc" "public"."transaction_histories_number_of_time_qc_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories" DROP COLUMN "number_of_time_qc"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_histories_number_of_time_qc_enum"`);
    }

}
