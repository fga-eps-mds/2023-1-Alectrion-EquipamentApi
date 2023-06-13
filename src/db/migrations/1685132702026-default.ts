import { MigrationInterface, QueryRunner } from 'typeorm'

export class default1674611694082 implements MigrationInterface {
  name = 'default1674611694082'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "equipment_brand" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_ba1f5659893d908eaabb38453a6" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "equipment_snapshot" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "equipmentId" uuid, CONSTRAINT "REL_613a88237253398395ad197fbf" UNIQUE ("equipmentId"), CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."movement_type_enum" AS ENUM('0', '1', '2')`
    )
    await queryRunner.query(
      `CREATE TABLE "movement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" uuid NOT NULL, "type" "public"."movement_type_enum" NOT NULL, "description" character varying, "inChargeName" character varying NOT NULL, "inChargeRole" character varying NOT NULL, "chiefName" character varying NOT NULL, "chiefRole" character varying NOT NULL, "equipmentSnapshots" jsonb, "destinationId" uuid, CONSTRAINT "PK_079f005d01ebda984e75c2d67ee" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "unit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "localization" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4252c4be609041e559f0c80f58a" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."order_service_type_enum" AS ENUM('MAINTENANCE', 'WARRANTY', 'CONCLUDED', 'CANCELED')`
    )
    await queryRunner.query(
      `CREATE TABLE "order_service" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(),"sender_phone" character varying, "date" date NOT NULL, "description" character varying, "author_id" uuid, "author_functional_number" character varying, "receiver_name" character varying NOT NULL, "sender" character varying NOT NULL, "equipment_snapshot" jsonb NOT NULL, "sender_functional_number" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "equipmentId" uuid, "historyId" uuid, "receiver_functional_number" character varying, "status" "public"."order_service_type_enum", "technicians" character varying [], "receiver_date" date,  CONSTRAINT "PK_d33d62cc4f08f6bd10dd7a68f65" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."equipment_type_enum" AS ENUM('CPU', 'Escaneador', 'Estabilizador', 'Monitor', 'Nobreak', 'Webcam', 'Hub', 'Switch', 'Notebook', 'Datashow', 'Scanner', 'Impressora', 'Roteador', 'Tablet', 'Tv', 'Fax', 'Telefone', 'Smartphone', 'Projetor', 'Tela de Projeção', 'Camera', 'Caixa de som', 'Impressora térmica', 'Leitor de codigo de barras', 'Mesa Digitalizadora', 'Leitor biométrico', 'Receptor', 'Extrator de dados', 'Transformador', 'Coletor de Assinatura', 'Kit cenário', 'Dispositivo de biometria facial', 'Servidor de rede', 'Hd Externo', 'Protetor eletrônico')`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."equipment_situacao_enum" AS ENUM('Ativo', 'Ativo Empréstimo', 'Baixado', 'Manutenção', 'Reserva Técnica')`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."equipment_estado_enum" AS ENUM('Novo', 'Usado')`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."equipment_screen_type_enum" AS ENUM('IPS', 'LCD', 'LED', 'OLED', 'TN', 'VA')`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."equipment_storage_type_enum" AS ENUM('HD', 'SSD')`
    )
    await queryRunner.query(
      `CREATE TABLE "equipment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tipping_number" character varying NOT NULL, "serial_number" character varying NOT NULL, "type" "public"."equipment_type_enum" NOT NULL, "situacao" "public"."equipment_situacao_enum" NOT NULL, "estado" "public"."equipment_estado_enum" NOT NULL, "model" character varying NOT NULL, "description" character varying NOT NULL, "acquisition_date" date NOT NULL, "screen_size" character varying, "power" character varying, "screen_type" "public"."equipment_screen_type_enum", "processor" character varying, "storage_type" "public"."equipment_storage_type_enum", "storage_amount" character varying, "ram_size" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "brandId" uuid, "acquisitionId" uuid, "unitId" uuid, CONSTRAINT "UQ_fbc3cbdf5d7779c6aa431183ba2" UNIQUE ("tipping_number"), CONSTRAINT "PK_0722e1b9d6eb19f5874c1678740" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "equipment_acquisition" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_af44dd2f07b332cb004b806dad9" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "movement_equipments_equipment" ("movementId" uuid NOT NULL, "equipmentId" uuid NOT NULL, CONSTRAINT "PK_002d49b95100bea79ab29ffa240" PRIMARY KEY ("movementId", "equipmentId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_241ae443e5a9511f2dd6088151" ON "movement_equipments_equipment" ("movementId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_76a5e7965b2cf32412c6996a53" ON "movement_equipments_equipment" ("equipmentId") `
    )
    await queryRunner.query(
      `ALTER TABLE "history" ADD CONSTRAINT "FK_613a88237253398395ad197fbf9" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "movement" ADD CONSTRAINT "FK_23d372d42af40fd0fab57ea2c37" FOREIGN KEY ("destinationId") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "order_service" ADD CONSTRAINT "FK_ee907a13181fa865e143f945271" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "order_service" ADD CONSTRAINT "FK_7dcf9045e5d2c98d16d2835a932" FOREIGN KEY ("historyId") REFERENCES "history"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "equipment" ADD CONSTRAINT "FK_8ff24b5f8b355f88ae94b7e1a22" FOREIGN KEY ("brandId") REFERENCES "equipment_brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "equipment" ADD CONSTRAINT "FK_3b1c9bbdf5b1da019f27fb2070f" FOREIGN KEY ("acquisitionId") REFERENCES "equipment_acquisition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "equipment" ADD CONSTRAINT "FK_cc5fce306a17e42580a34908afc" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "movement_equipments_equipment" ADD CONSTRAINT "FK_241ae443e5a9511f2dd6088151f" FOREIGN KEY ("movementId") REFERENCES "movement"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "movement_equipments_equipment" ADD CONSTRAINT "FK_76a5e7965b2cf32412c6996a537" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movement_equipments_equipment" DROP CONSTRAINT "FK_76a5e7965b2cf32412c6996a537"`
    )
    await queryRunner.query(
      `ALTER TABLE "movement_equipments_equipment" DROP CONSTRAINT "FK_241ae443e5a9511f2dd6088151f"`
    )
    await queryRunner.query(
      `ALTER TABLE "equipment" DROP CONSTRAINT "FK_cc5fce306a17e42580a34908afc"`
    )
    await queryRunner.query(
      `ALTER TABLE "equipment" DROP CONSTRAINT "FK_3b1c9bbdf5b1da019f27fb2070f"`
    )
    await queryRunner.query(
      `ALTER TABLE "equipment" DROP CONSTRAINT "FK_8ff24b5f8b355f88ae94b7e1a22"`
    )
    await queryRunner.query(
      `ALTER TABLE "order_service" DROP CONSTRAINT "FK_7dcf9045e5d2c98d16d2835a932"`
    )
    await queryRunner.query(
      `ALTER TABLE "order_service" DROP CONSTRAINT "FK_ee907a13181fa865e143f945271"`
    )
    await queryRunner.query(
      `ALTER TABLE "movement" DROP CONSTRAINT "FK_23d372d42af40fd0fab57ea2c37"`
    )
    await queryRunner.query(
      `ALTER TABLE "history" DROP CONSTRAINT "FK_613a88237253398395ad197fbf9"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_76a5e7965b2cf32412c6996a53"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_241ae443e5a9511f2dd6088151"`
    )
    await queryRunner.query(`DROP TABLE "movement_equipments_equipment"`)
    await queryRunner.query(`DROP TABLE "equipment_acquisition"`)
    await queryRunner.query(`DROP TABLE "equipment"`)
    await queryRunner.query(`DROP TYPE "public"."equipment_storage_type_enum"`)
    await queryRunner.query(`DROP TYPE "public"."equipment_screen_type_enum"`)
    await queryRunner.query(`DROP TYPE "public"."equipment_estado_enum"`)
    await queryRunner.query(`DROP TYPE "public"."equipment_situacao_enum"`)
    await queryRunner.query(`DROP TYPE "public"."equipment_type_enum"`)
    await queryRunner.query(`DROP TABLE "order_service"`)
    await queryRunner.query(`DROP TABLE "unit"`)
    await queryRunner.query(`DROP TABLE "movement"`)
    await queryRunner.query(`DROP TYPE "public"."movement_type_enum"`)
    await queryRunner.query(`DROP TABLE "history"`)
    await queryRunner.query(`DROP TABLE "equipment_brand"`)
  }
}
