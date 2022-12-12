import { MigrationInterface, QueryRunner } from "typeorm";

export class default1664153249772 implements MigrationInterface {
    name = 'default1664153249772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "equipment_acquisition" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_af44dd2f07b332cb004b806dad9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "equipment_brand" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_ba1f5659893d908eaabb38453a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "equipment_snapshot" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "equipmentId" uuid, CONSTRAINT "REL_613a88237253398395ad197fbf" UNIQUE ("equipmentId"), CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "unit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "localization" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4252c4be609041e559f0c80f58a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_service" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "description" character varying, "author_id" uuid NOT NULL, "receiver_name" character varying NOT NULL, "sender" character varying NOT NULL, "equipment_snapshot" jsonb NOT NULL, "sender_functional_number" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "equipmentId" uuid, "historyId" uuid, "destinationId" uuid, CONSTRAINT "PK_d33d62cc4f08f6bd10dd7a68f65" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."equipment_type_enum" AS ENUM('CPU', 'NOBREAK', 'SCANNER', 'WEBCAM', 'MONITOR', 'STABILIZER')`);
        await queryRunner.query(`CREATE TYPE "public"."equipment_status_enum" AS ENUM('ACTIVE', 'ACTIVE_LOAN', 'DOWNGRADED', 'MAINTENANCE', 'TECHNICAL_RESERVE')`); // Removido "INACTIVE"
        await queryRunner.query(`CREATE TYPE "public"."equipment_screen_type_enum" AS ENUM('LCD', 'OLED', 'LED', 'TN', 'VA', 'IPS')`);
        await queryRunner.query(`CREATE TYPE "public"."equipment_storage_type_enum" AS ENUM('HD', 'SSD')`);
        await queryRunner.query(`CREATE TABLE "equipment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tipping_number" character varying NOT NULL, "serial_number" character varying NOT NULL, "type" "public"."equipment_type_enum" NOT NULL, "status" "public"."equipment_status_enum" NOT NULL, "model" character varying NOT NULL, "description" character varying NOT NULL, "initial_use_date" character varying NOT NULL, "acquisition_date" date NOT NULL, "screen_size" character varying, "invoice_number" character varying NOT NULL, "power" character varying, "screen_type" "public"."equipment_screen_type_enum", "processor" character varying, "storage_type" "public"."equipment_storage_type_enum", "storage_amount" character varying, "ram_size" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "brandId" uuid, "acquisitionId" uuid, "unitId" uuid, CONSTRAINT "UQ_fbc3cbdf5d7779c6aa431183ba2" UNIQUE ("tipping_number"), CONSTRAINT "PK_0722e1b9d6eb19f5874c1678740" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dismissed" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "description" character varying NOT NULL, "author_id" uuid NOT NULL, "equipment_snapshot" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "equipmentId" uuid, "historyId" uuid, "destinationId" uuid, CONSTRAINT "REL_6cdcb1ed8c88c7b1299450d19e" UNIQUE ("destinationId"), CONSTRAINT "PK_d57cb086a6c4bbf87275979da24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "history" ADD CONSTRAINT "FK_613a88237253398395ad197fbf9" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_service" ADD CONSTRAINT "FK_ee907a13181fa865e143f945271" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_service" ADD CONSTRAINT "FK_7dcf9045e5d2c98d16d2835a932" FOREIGN KEY ("historyId") REFERENCES "history"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_service" ADD CONSTRAINT "FK_204a4d8643816109bde984d5b82" FOREIGN KEY ("destinationId") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_8ff24b5f8b355f88ae94b7e1a22" FOREIGN KEY ("brandId") REFERENCES "equipment_brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_3b1c9bbdf5b1da019f27fb2070f" FOREIGN KEY ("acquisitionId") REFERENCES "equipment_acquisition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_cc5fce306a17e42580a34908afc" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dismissed" ADD CONSTRAINT "FK_f87b458fc2dd2843ac47aa2cb43" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dismissed" ADD CONSTRAINT "FK_99350223cbb8b1da6aa4dbb623a" FOREIGN KEY ("historyId") REFERENCES "history"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dismissed" ADD CONSTRAINT "FK_6cdcb1ed8c88c7b1299450d19e0" FOREIGN KEY ("destinationId") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dismissed" DROP CONSTRAINT "FK_6cdcb1ed8c88c7b1299450d19e0"`);
        await queryRunner.query(`ALTER TABLE "dismissed" DROP CONSTRAINT "FK_99350223cbb8b1da6aa4dbb623a"`);
        await queryRunner.query(`ALTER TABLE "dismissed" DROP CONSTRAINT "FK_f87b458fc2dd2843ac47aa2cb43"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_cc5fce306a17e42580a34908afc"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_3b1c9bbdf5b1da019f27fb2070f"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_8ff24b5f8b355f88ae94b7e1a22"`);
        await queryRunner.query(`ALTER TABLE "order_service" DROP CONSTRAINT "FK_204a4d8643816109bde984d5b82"`);
        await queryRunner.query(`ALTER TABLE "order_service" DROP CONSTRAINT "FK_7dcf9045e5d2c98d16d2835a932"`);
        await queryRunner.query(`ALTER TABLE "order_service" DROP CONSTRAINT "FK_ee907a13181fa865e143f945271"`);
        await queryRunner.query(`ALTER TABLE "history" DROP CONSTRAINT "FK_613a88237253398395ad197fbf9"`);
        await queryRunner.query(`DROP TABLE "dismissed"`);
        await queryRunner.query(`DROP TABLE "equipment"`);
        await queryRunner.query(`DROP TYPE "public"."equipment_storage_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."equipment_screen_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."equipment_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."equipment_type_enum"`);
        await queryRunner.query(`DROP TABLE "order_service"`);
        await queryRunner.query(`DROP TABLE "unit"`);
        await queryRunner.query(`DROP TABLE "history"`);
        await queryRunner.query(`DROP TABLE "equipment_brand"`);
        await queryRunner.query(`DROP TABLE "equipment_acquisition"`);
    }

}
