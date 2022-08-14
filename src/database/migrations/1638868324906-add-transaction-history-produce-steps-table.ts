import {MigrationInterface, QueryRunner} from "typeorm";

export class addTransactionHistoryProduceStepsTable1638868324906 implements MigrationInterface {
    name = 'addTransactionHistoryProduceStepsTable1638868324906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction_histories_produce_steps" ("id" SERIAL NOT NULL, "transaction_history_id" integer NOT NULL, "total_plan_quantity" numeric(10,2) DEFAULT '0', "total_import_quantity" numeric(10,2) DEFAULT '0', "total_qc_pass_quantity" numeric(10,2) DEFAULT '0', "total_qc_reject_quantity" numeric(10,2) DEFAULT '0', "total_un_qc_quantity" numeric(10,2) DEFAULT '0', "total_qc_quantity" numeric(10,2) DEFAULT '0', "input_quantity" numeric(10,2) DEFAULT '0', "produced_quantity" numeric(10,2) DEFAULT '0', CONSTRAINT "REL_885bc550969d481675d625ed0b" UNIQUE ("transaction_history_id"), CONSTRAINT "PK_493654d65ee6af3f2594831fecc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction_histories_produce_steps" ADD CONSTRAINT "FK_885bc550969d481675d625ed0b5" FOREIGN KEY ("transaction_history_id") REFERENCES "transaction_histories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_histories_produce_steps" DROP CONSTRAINT "FK_885bc550969d481675d625ed0b5"`);
        await queryRunner.query(`DROP TABLE "transaction_histories_produce_steps"`);
    }

}
