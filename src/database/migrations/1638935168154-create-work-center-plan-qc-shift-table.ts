import {MigrationInterface, QueryRunner} from "typeorm";

export class createWorkCenterPlanQcShiftTable1638935168154 implements MigrationInterface {
    name = 'createWorkCenterPlanQcShiftTable1638935168154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "work_center_plan_qc_shifts" ("id" SERIAL NOT NULL, "work_order_id" integer NOT NULL, "work_center_id" integer NOT NULL, "execution_day" TIMESTAMP WITH TIME ZONE NOT NULL, "plan_quantity" numeric(10,2) DEFAULT '0', "actual_quantity" numeric(10,2) DEFAULT '0', "moderation_quantity" numeric(10,2) DEFAULT '0', "number_of_shift" integer NOT NULL, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_21f5e752d2165709b20ce89f187" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "work_center_plan_qc_shifts"`);
    }

}
