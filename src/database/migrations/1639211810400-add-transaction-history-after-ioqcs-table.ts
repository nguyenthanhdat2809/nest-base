import {MigrationInterface, QueryRunner} from "typeorm";

export class addTransactionHistoryAfterIoqcsTable1639211810400 implements MigrationInterface {
    name = 'addTransactionHistoryAfterIoqcsTable1639211810400'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction_history_after_ioqcs" ("id" SERIAL NOT NULL, "transaction_history_id" integer, "import_quantity" numeric(10,2) DEFAULT '0', "qc_reject_quantity" numeric(10,2) DEFAULT '0', "qc_need_quantity" numeric(10,2) DEFAULT '0', "qc_quantity" numeric(10,2) DEFAULT '0', "qc_plan_quantity" numeric(10,2) DEFAULT '0', "qc_pass_quantity" numeric(10,2) DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "REL_aec8abe9b7e23164a6f22d4673" UNIQUE ("transaction_history_id"), CONSTRAINT "PK_f4025ef05e24b2fca12a091519b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction_history_after_ioqcs" ADD CONSTRAINT "FK_aec8abe9b7e23164a6f22d46730" FOREIGN KEY ("transaction_history_id") REFERENCES "transaction_histories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_history_after_ioqcs" DROP CONSTRAINT "FK_aec8abe9b7e23164a6f22d46730"`);
        await queryRunner.query(`DROP TABLE "transaction_history_after_ioqcs"`);
    }

}
