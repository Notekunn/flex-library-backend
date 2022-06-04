import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialDatabase1654359456119 implements MigrationInterface {
  name = 'InitialDatabase1654359456119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "category" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "book" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "author" character varying,
                "images" text NOT NULL,
                "sale_price" integer NOT NULL,
                "rent_price" integer NOT NULL,
                "num_of_copies" integer NOT NULL,
                "store_id" integer,
                CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" SERIAL NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "name" character varying NOT NULL,
                "role" character varying NOT NULL DEFAULT 'member',
                "avatar" character varying,
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email")
        `);
    await queryRunner.query(`
            CREATE TABLE "store" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "address" character varying NOT NULL,
                "latitude" double precision,
                "longitude" double precision,
                "province_id" integer,
                "owner_id" integer,
                CONSTRAINT "REL_8ce7c0371b6fca43a17f523ce4" UNIQUE ("owner_id"),
                CONSTRAINT "PK_f3172007d4de5ae8e7692759d79" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_66df34da7fb037e24fc7fee642" ON "store" ("name")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_8513cec8fd3b653fdba31ae4cc" ON "store" ("latitude")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_57d923a32b9401f3616ae9bc14" ON "store" ("longitude")
        `);
    await queryRunner.query(`
            CREATE TABLE "order" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" SERIAL NOT NULL,
                "status" character varying NOT NULL DEFAULT 'created',
                "owner_id" integer,
                "store_id" integer,
                CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "book_loan" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" SERIAL NOT NULL,
                "due_date" TIMESTAMP WITH TIME ZONE NOT NULL,
                "order_id" integer,
                "book_copy_id" integer,
                CONSTRAINT "PK_99a3c860cd982070f1bc51a9951" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "book_copy" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" SERIAL NOT NULL,
                "barcode" character varying NOT NULL,
                "status" character varying NOT NULL DEFAULT 'pending',
                "type" character varying NOT NULL DEFAULT 'unknown',
                "book_id" integer,
                CONSTRAINT "PK_ef16f7a75bc656c5486264959bb" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "order_detail" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" SERIAL NOT NULL,
                "quantity" integer NOT NULL DEFAULT '1',
                "order_id" integer,
                "book_id" integer,
                CONSTRAINT "PK_0afbab1fa98e2fb0be8e74f6b38" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "book_category" (
                "book_id" integer NOT NULL,
                "category_id" integer NOT NULL,
                CONSTRAINT "PK_72c8df7e26fb00bd4a699f8ceeb" PRIMARY KEY ("book_id", "category_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_0ec321d0940e2eac32698e854a" ON "book_category" ("book_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_1289ac9b250e11b050b3bd2f6d" ON "book_category" ("category_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "book"
            ADD CONSTRAINT "FK_f1d2d2186aa819d95f5ce0b30f7" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "store"
            ADD CONSTRAINT "FK_8ce7c0371b6fca43a17f523ce44" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "order"
            ADD CONSTRAINT "FK_d9181c2d154dfb71af0e18d9669" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "order"
            ADD CONSTRAINT "FK_49bee6b626107c19a15c3cf039e" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "book_loan"
            ADD CONSTRAINT "FK_b5c995faf3c5f52b6b3a3bdc3cf" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "book_loan"
            ADD CONSTRAINT "FK_bc599e13e4ad88a377c89fb538a" FOREIGN KEY ("book_copy_id") REFERENCES "book_copy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "book_copy"
            ADD CONSTRAINT "FK_a3365d29e50bf551ff93777d4cb" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "order_detail"
            ADD CONSTRAINT "FK_a6ac5c99b8c02bd4ee53d3785be" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "order_detail"
            ADD CONSTRAINT "FK_3d855f5483990f14739c8c09ec0" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "book_category"
            ADD CONSTRAINT "FK_0ec321d0940e2eac32698e854a0" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "book_category"
            ADD CONSTRAINT "FK_1289ac9b250e11b050b3bd2f6d5" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "book_category" DROP CONSTRAINT "FK_1289ac9b250e11b050b3bd2f6d5"
        `);
    await queryRunner.query(`
            ALTER TABLE "book_category" DROP CONSTRAINT "FK_0ec321d0940e2eac32698e854a0"
        `);
    await queryRunner.query(`
            ALTER TABLE "order_detail" DROP CONSTRAINT "FK_3d855f5483990f14739c8c09ec0"
        `);
    await queryRunner.query(`
            ALTER TABLE "order_detail" DROP CONSTRAINT "FK_a6ac5c99b8c02bd4ee53d3785be"
        `);
    await queryRunner.query(`
            ALTER TABLE "book_copy" DROP CONSTRAINT "FK_a3365d29e50bf551ff93777d4cb"
        `);
    await queryRunner.query(`
            ALTER TABLE "book_loan" DROP CONSTRAINT "FK_bc599e13e4ad88a377c89fb538a"
        `);
    await queryRunner.query(`
            ALTER TABLE "book_loan" DROP CONSTRAINT "FK_b5c995faf3c5f52b6b3a3bdc3cf"
        `);
    await queryRunner.query(`
            ALTER TABLE "order" DROP CONSTRAINT "FK_49bee6b626107c19a15c3cf039e"
        `);
    await queryRunner.query(`
            ALTER TABLE "order" DROP CONSTRAINT "FK_d9181c2d154dfb71af0e18d9669"
        `);
    await queryRunner.query(`
            ALTER TABLE "store" DROP CONSTRAINT "FK_8ce7c0371b6fca43a17f523ce44"
        `);
    await queryRunner.query(`
            ALTER TABLE "book" DROP CONSTRAINT "FK_f1d2d2186aa819d95f5ce0b30f7"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_1289ac9b250e11b050b3bd2f6d"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_0ec321d0940e2eac32698e854a"
        `);
    await queryRunner.query(`
            DROP TABLE "book_category"
        `);
    await queryRunner.query(`
            DROP TABLE "order_detail"
        `);
    await queryRunner.query(`
            DROP TABLE "book_copy"
        `);
    await queryRunner.query(`
            DROP TABLE "book_loan"
        `);
    await queryRunner.query(`
            DROP TABLE "order"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_57d923a32b9401f3616ae9bc14"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_8513cec8fd3b653fdba31ae4cc"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_66df34da7fb037e24fc7fee642"
        `);
    await queryRunner.query(`
            DROP TABLE "store"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            DROP TABLE "book"
        `);
    await queryRunner.query(`
            DROP TABLE "category"
        `);
  }
}
