import {MigrationInterface, QueryRunner} from "typeorm";

export class refractorTransactionHistoryQcLogTimeAndAddition1637739398207 implements MigrationInterface {
    name = 'refractorTransactionHistoryQcLogTimeAndAddition1637739398207'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction_history_log_time_additions" ("id" SERIAL NOT NULL, "start_time" TIMESTAMP WITH TIME ZONE, "end_time" TIMESTAMP WITH TIME ZONE, "duration" numeric(30,2) DEFAULT '0', "transaction_history_log_time_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8255ee703c3f58c2874b79e0875" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" ALTER COLUMN "duration" TYPE numeric(30,2)`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" ALTER COLUMN "duration" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_time_additions" ADD CONSTRAINT "FK_20783ab38d1395ba2164530a1f7" FOREIGN KEY ("transaction_history_log_time_id") REFERENCES "transaction_history_log_times"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_history_log_time_additions" DROP CONSTRAINT "FK_20783ab38d1395ba2164530a1f7"`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" ALTER COLUMN "duration" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "transaction_history_log_times" ALTER COLUMN "duration" TYPE numeric(4,2)`);
        await queryRunner.query(`DROP TABLE "transaction_history_log_time_additions"`);
    }

}
