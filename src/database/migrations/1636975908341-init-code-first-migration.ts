import { MigrationInterface, QueryRunner } from 'typeorm';

export class initCodeFirstMigration1636975908341 implements MigrationInterface {
  name = 'initCodeFirstMigration1636975908341';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "action_categories" ("id" SERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(255) NOT NULL, "description" character varying(255), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_b14728c9c06460b0cf6ddde60a0" UNIQUE ("code"), CONSTRAINT "UQ_44d7b4ca756a1ac0526326552fe" UNIQUE ("name"), CONSTRAINT "PK_a83da2c640168d35be0032938c5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "alerts_status_enum" AS ENUM('1', '0')`,
    );
    await queryRunner.query(
      `CREATE TYPE "alerts_type_alert_enum" AS ENUM('1', '2', '3')`,
    );
    await queryRunner.query(
      `CREATE TABLE "alerts" ("id" SERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(50) NOT NULL, "description" character varying(255), "stage" integer NOT NULL, "item_id" integer NOT NULL, "status" "alerts_status_enum" NOT NULL DEFAULT '0', "type_alert" "alerts_type_alert_enum" NOT NULL, "user_id" integer NOT NULL, "manufacturing_order_id" integer, "routing_id" integer, "producing_step_id" integer, "purchased_order_id" integer, "warehouse_id" integer, "error_report_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_6237d8ef31eac77d9ed61fba99e" UNIQUE ("code"), CONSTRAINT "PK_60f895662df096bfcdfab7f4b96" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "alert_related_users" ("id" SERIAL NOT NULL, "alert_id" integer NOT NULL, "user_id" integer NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3463ec1471d24f798612fe2cf32" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "error_report_ioqc_details" ("id" SERIAL NOT NULL, "error_report_id" integer NOT NULL, "item_id" integer NOT NULL, "customer_id" integer, "order_id" integer NOT NULL, "warehouse_id" integer NOT NULL, "delivered_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_7f6f6a680f5edfb5538c732e1b" UNIQUE ("error_report_id"), CONSTRAINT "PK_350e6ba3b74c42c683d02022571" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quality_point_user1s" ("id" SERIAL NOT NULL, "quality_point_id" integer NOT NULL, "user_id" integer NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6edaf84e8135aaabab95dffc09c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quality_point_user2s" ("id" SERIAL NOT NULL, "quality_point_id" integer NOT NULL, "user_id" integer NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_167baea90fdf5360c9126c2d82f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "quality_points_formality_enum" AS ENUM('0', '1')`,
    );
    await queryRunner.query(
      `CREATE TYPE "quality_points_number_of_time_enum" AS ENUM('0', '1')`,
    );
    await queryRunner.query(
      `CREATE TYPE "quality_points_status_enum" AS ENUM('1', '0')`,
    );
    await queryRunner.query(
      `CREATE TABLE "quality_points" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "code" character varying(50) NOT NULL, "item_id" integer NOT NULL, "stage" integer, "check_list_id" integer NOT NULL, "formality" "quality_points_formality_enum" NOT NULL, "number_of_time" "quality_points_number_of_time_enum" NOT NULL, "quantity" integer, "description" character varying(255), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "status" "quality_points_status_enum" NOT NULL DEFAULT '0', CONSTRAINT "PK_2a91b825e3eb8b9e86b468b1eef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "check_lists_status_enum" AS ENUM('1', '0')`,
    );
    await queryRunner.query(
      `CREATE TABLE "check_lists" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "code" character varying(50) NOT NULL, "description" character varying(255), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "status" "check_lists_status_enum" NOT NULL DEFAULT '0', CONSTRAINT "PK_63fb5f5cb0969398d1c5fc7be7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "error_groups" ("id" SERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(255) NOT NULL, "description" character varying(255), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_a9e89e9bf6b7646706f32b3fa6a" UNIQUE ("code"), CONSTRAINT "UQ_fc251a0789d1054701a263a2ec6" UNIQUE ("name"), CONSTRAINT "PK_75f3d2ade79d16975fb3b39352c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "check_list_details" ("id" SERIAL NOT NULL, "check_list_id" integer NOT NULL, "title" character varying(50) NOT NULL, "description_content" character varying(255) NOT NULL, "check_type" integer NOT NULL, "norm" integer, "value_top" integer, "value_bottom" integer, "error_group_id" integer NOT NULL, "item_unit_id" integer, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a0ca97154778fc395633af1ca77" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_histories_check_list_details" ("id" SERIAL NOT NULL, "transaction_history_id" integer NOT NULL, "check_list_detail_id" integer NOT NULL, "qc_pass_quantity" integer NOT NULL, "qc_reject_quantity" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_55bf88baadce88bda16cc3e1647" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "transaction_histories_type_enum" AS ENUM('0', '2', '3', '5', '8')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_histories" ("id" SERIAL NOT NULL, "order_id" integer NOT NULL, "warehouse_id" integer, "item_id" integer, "created_by_user_id" integer NOT NULL, "code" character varying(50), "qc_pass_quantity" numeric(10,2) DEFAULT '0', "qc_reject_quantity" numeric(10,2) DEFAULT '0', "qc_quantity" numeric(10,2) DEFAULT '0', "note" character varying(255), "type" "transaction_histories_type_enum" NOT NULL DEFAULT '8', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_20a6530a95a39f16f2fc90efdfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "error_reports_status_enum" AS ENUM('0', '1', '2', '3')`,
    );
    await queryRunner.query(
      `CREATE TYPE "error_reports_report_type_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "error_reports" ("id" SERIAL NOT NULL, "code" character varying(50), "name" character varying(255) NOT NULL, "qc_stage_id" integer NOT NULL, "created_by" integer NOT NULL, "status" "error_reports_status_enum" NOT NULL, "confirmed_by" integer, "confirmed_at" TIMESTAMP WITH TIME ZONE, "rejected_by" integer, "rejected_at" TIMESTAMP WITH TIME ZONE, "report_type" "error_reports_report_type_enum", "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "transaction_history_id" integer, CONSTRAINT "UQ_edd511dbb93c504b1ad37563d7b" UNIQUE ("code"), CONSTRAINT "REL_82a4b1c90d16381b712c68e3d5" UNIQUE ("transaction_history_id"), CONSTRAINT "PK_7ad997b17e029b745874a1a1eac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "error_report_stage_details" ("id" SERIAL NOT NULL, "error_report_id" integer NOT NULL, "item_id" integer NOT NULL, "routing_id" integer NOT NULL, "producing_step_id" integer NOT NULL, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "work_order_id" integer, "mo_id" integer, "mo_detail_id" integer, CONSTRAINT "REL_67b3c57e9379f5227063557a4f" UNIQUE ("error_report_id"), CONSTRAINT "PK_778dcbadb0b6c09620401f53dae" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "error_report_error_lists_priority_enum" AS ENUM('1', '2', '3')`,
    );
    await queryRunner.query(
      `CREATE TABLE "error_report_error_lists" ("id" SERIAL NOT NULL, "error_report_stage_detail_id" integer, "error_report_ioqc_detail_id" integer, "assigned_to" integer NOT NULL, "error_description" character varying(255) NOT NULL, "priority" "error_report_error_lists_priority_enum" NOT NULL, "repair_deadline" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_43220b939855de44140230b70a" UNIQUE ("error_report_stage_detail_id"), CONSTRAINT "REL_6a7236772495eb50b278c8fe71" UNIQUE ("error_report_ioqc_detail_id"), CONSTRAINT "PK_465e69493ee50c8487b180f5c88" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "error_report_error_details" ("id" SERIAL NOT NULL, "error_report_error_list_id" integer NOT NULL, "error_group_id" integer NOT NULL, "cause_group_id" integer NOT NULL, "error_item_quantity" integer NOT NULL, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "repair_item_quantity" integer, CONSTRAINT "PK_5381d70ef9fc38405363ffde8ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cause_groups" ("id" SERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_34add1bcfdc72925c26edce9fc2" UNIQUE ("code"), CONSTRAINT "UQ_5fa67afdc9547020fef6a0db31d" UNIQUE ("name"), CONSTRAINT "PK_b61a1fbaf6080c2f90a30916546" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "quality_plans_status_enum" AS ENUM('0', '1', '2', '3')`,
    );
    await queryRunner.query(
      `CREATE TABLE "quality_plans" ("id" SERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(255) NOT NULL, "description" character varying(255), "mo_id" integer NOT NULL, "qc_stage_id" integer NOT NULL, "status" "quality_plans_status_enum" NOT NULL, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_ddfba5dde99508774957b4754f9" UNIQUE ("code"), CONSTRAINT "PK_8a0e0bbbe83c8b655a950699175" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quality_plan_details" ("id" SERIAL NOT NULL, "quality_plan_id" integer NOT NULL, "mo_id" integer NOT NULL, "mo_plan_id" integer NOT NULL, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_d4052219e6066f0c69ef1575a2" UNIQUE ("quality_plan_id"), CONSTRAINT "PK_a8ad8450dcf327a4f335f65dab5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quality_plan_boms" ("id" SERIAL NOT NULL, "quality_plan_detail_id" integer NOT NULL, "bom_id" integer, "producing_step_id" integer NOT NULL, "plan_from" TIMESTAMP WITH TIME ZONE NOT NULL, "plan_to" TIMESTAMP WITH TIME ZONE NOT NULL, "plan_error_rate" integer NOT NULL DEFAULT '0', "plan_qc_quantity" integer NOT NULL DEFAULT '0', "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "quality_point_user_id" integer NOT NULL, CONSTRAINT "PK_be4d29f261c526f92dd967b0791" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quality_plan_bom_quality_point_users" ("id" SERIAL NOT NULL, "quality_plan_bom_id" integer NOT NULL, "user_id" integer NOT NULL, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7a38125e6e71c625e72fcb26161" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "alert_related_users" ADD CONSTRAINT "FK_5b790d36292ff4b49ac24272e10" FOREIGN KEY ("alert_id") REFERENCES "alerts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "error_report_ioqc_details" ADD CONSTRAINT "FK_7f6f6a680f5edfb5538c732e1b7" FOREIGN KEY ("error_report_id") REFERENCES "error_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quality_point_user1s" ADD CONSTRAINT "FK_93d00fd783541a42c1e70366142" FOREIGN KEY ("quality_point_id") REFERENCES "quality_points"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quality_point_user2s" ADD CONSTRAINT "FK_cce00f2c5134a59434a47ceec9d" FOREIGN KEY ("quality_point_id") REFERENCES "quality_points"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quality_points" ADD CONSTRAINT "FK_cfbf7ffe281f2dc227a8a5326a2" FOREIGN KEY ("check_list_id") REFERENCES "check_lists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_list_details" ADD CONSTRAINT "FK_5e5b231ca3874968d5fa8d93031" FOREIGN KEY ("error_group_id") REFERENCES "error_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_list_details" ADD CONSTRAINT "FK_898e4abe515737b2e44096086c6" FOREIGN KEY ("check_list_id") REFERENCES "check_lists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_histories_check_list_details" ADD CONSTRAINT "FK_6cbf8d30b7c466d5b5681990b1d" FOREIGN KEY ("transaction_history_id") REFERENCES "transaction_histories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_histories_check_list_details" ADD CONSTRAINT "FK_f9380ec80bcbe348ef41c3968d1" FOREIGN KEY ("check_list_detail_id") REFERENCES "check_list_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "error_reports" ADD CONSTRAINT "FK_82a4b1c90d16381b712c68e3d51" FOREIGN KEY ("transaction_history_id") REFERENCES "transaction_histories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "error_report_stage_details" ADD CONSTRAINT "FK_67b3c57e9379f5227063557a4f7" FOREIGN KEY ("error_report_id") REFERENCES "error_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "error_report_error_lists" ADD CONSTRAINT "FK_43220b939855de44140230b70a0" FOREIGN KEY ("error_report_stage_detail_id") REFERENCES "error_report_stage_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "error_report_error_lists" ADD CONSTRAINT "FK_6a7236772495eb50b278c8fe71f" FOREIGN KEY ("error_report_ioqc_detail_id") REFERENCES "error_report_ioqc_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "error_report_error_details" ADD CONSTRAINT "FK_8733442ea26f76f8e7cc36e9335" FOREIGN KEY ("error_group_id") REFERENCES "error_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "error_report_error_details" ADD CONSTRAINT "FK_28544fe0cf3f31d9c6e4752edfd" FOREIGN KEY ("cause_group_id") REFERENCES "cause_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "error_report_error_details" ADD CONSTRAINT "FK_4c7a5005677c4419256f48ea3f2" FOREIGN KEY ("error_report_error_list_id") REFERENCES "error_report_error_lists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quality_plan_details" ADD CONSTRAINT "FK_d4052219e6066f0c69ef1575a23" FOREIGN KEY ("quality_plan_id") REFERENCES "quality_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quality_plan_boms" ADD CONSTRAINT "FK_0a85475da98d5134bc4b06601ac" FOREIGN KEY ("quality_plan_detail_id") REFERENCES "quality_plan_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quality_plan_bom_quality_point_users" ADD CONSTRAINT "FK_8328901ef525bc675a7da491e6c" FOREIGN KEY ("quality_plan_bom_id") REFERENCES "quality_plan_boms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quality_plan_bom_quality_point_users" DROP CONSTRAINT "FK_8328901ef525bc675a7da491e6c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quality_plan_boms" DROP CONSTRAINT "FK_0a85475da98d5134bc4b06601ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quality_plan_details" DROP CONSTRAINT "FK_d4052219e6066f0c69ef1575a23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "error_report_error_details" DROP CONSTRAINT "FK_4c7a5005677c4419256f48ea3f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "error_report_error_details" DROP CONSTRAINT "FK_28544fe0cf3f31d9c6e4752edfd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "error_report_error_details" DROP CONSTRAINT "FK_8733442ea26f76f8e7cc36e9335"`,
    );
    await queryRunner.query(
      `ALTER TABLE "error_report_error_lists" DROP CONSTRAINT "FK_6a7236772495eb50b278c8fe71f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "error_report_error_lists" DROP CONSTRAINT "FK_43220b939855de44140230b70a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "error_report_stage_details" DROP CONSTRAINT "FK_67b3c57e9379f5227063557a4f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "error_reports" DROP CONSTRAINT "FK_82a4b1c90d16381b712c68e3d51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_histories_check_list_details" DROP CONSTRAINT "FK_f9380ec80bcbe348ef41c3968d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_histories_check_list_details" DROP CONSTRAINT "FK_6cbf8d30b7c466d5b5681990b1d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_list_details" DROP CONSTRAINT "FK_898e4abe515737b2e44096086c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_list_details" DROP CONSTRAINT "FK_5e5b231ca3874968d5fa8d93031"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quality_points" DROP CONSTRAINT "FK_cfbf7ffe281f2dc227a8a5326a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quality_point_user2s" DROP CONSTRAINT "FK_cce00f2c5134a59434a47ceec9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quality_point_user1s" DROP CONSTRAINT "FK_93d00fd783541a42c1e70366142"`,
    );
    await queryRunner.query(
      `ALTER TABLE "error_report_ioqc_details" DROP CONSTRAINT "FK_7f6f6a680f5edfb5538c732e1b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "alert_related_users" DROP CONSTRAINT "FK_5b790d36292ff4b49ac24272e10"`,
    );
    await queryRunner.query(
      `DROP TABLE "quality_plan_bom_quality_point_users"`,
    );
    await queryRunner.query(`DROP TABLE "quality_plan_boms"`);
    await queryRunner.query(`DROP TABLE "quality_plan_details"`);
    await queryRunner.query(`DROP TABLE "quality_plans"`);
    await queryRunner.query(`DROP TYPE "quality_plans_status_enum"`);
    await queryRunner.query(`DROP TABLE "cause_groups"`);
    await queryRunner.query(`DROP TABLE "error_report_error_details"`);
    await queryRunner.query(`DROP TABLE "error_report_error_lists"`);
    await queryRunner.query(
      `DROP TYPE "error_report_error_lists_priority_enum"`,
    );
    await queryRunner.query(`DROP TABLE "error_report_stage_details"`);
    await queryRunner.query(`DROP TABLE "error_reports"`);
    await queryRunner.query(`DROP TYPE "error_reports_report_type_enum"`);
    await queryRunner.query(`DROP TYPE "error_reports_status_enum"`);
    await queryRunner.query(`DROP TABLE "transaction_histories"`);
    await queryRunner.query(`DROP TYPE "transaction_histories_type_enum"`);
    await queryRunner.query(
      `DROP TABLE "transaction_histories_check_list_details"`,
    );
    await queryRunner.query(`DROP TABLE "check_list_details"`);
    await queryRunner.query(`DROP TABLE "error_groups"`);
    await queryRunner.query(`DROP TABLE "check_lists"`);
    await queryRunner.query(`DROP TYPE "check_lists_status_enum"`);
    await queryRunner.query(`DROP TABLE "quality_points"`);
    await queryRunner.query(`DROP TYPE "quality_points_status_enum"`);
    await queryRunner.query(`DROP TYPE "quality_points_number_of_time_enum"`);
    await queryRunner.query(`DROP TYPE "quality_points_formality_enum"`);
    await queryRunner.query(`DROP TABLE "quality_point_user2s"`);
    await queryRunner.query(`DROP TABLE "quality_point_user1s"`);
    await queryRunner.query(`DROP TABLE "error_report_ioqc_details"`);
    await queryRunner.query(`DROP TABLE "alert_related_users"`);
    await queryRunner.query(`DROP TABLE "alerts"`);
    await queryRunner.query(`DROP TYPE "alerts_type_alert_enum"`);
    await queryRunner.query(`DROP TYPE "alerts_status_enum"`);
    await queryRunner.query(`DROP TABLE "action_categories"`);
  }
}
