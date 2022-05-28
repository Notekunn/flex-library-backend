import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStore1653752863327 implements MigrationInterface {
  name = 'CreateStore1653752863327';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "category" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "store" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying NOT NULL,
                "address" character varying NOT NULL,
                CONSTRAINT "PK_f3172007d4de5ae8e7692759d79" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "store_book" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "barcode" character varying NOT NULL,
                "store_id" integer,
                "book_id" integer,
                CONSTRAINT "PK_d58d9bfd52ec34da502ec3ab321" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "book" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying NOT NULL,
                "price" integer NOT NULL,
                "image_url" character varying NOT NULL DEFAULT false,
                "quantity" integer NOT NULL DEFAULT '0',
                CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "store_book"
            ADD CONSTRAINT "FK_17f80b28290c169d4bb8dc1893f" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "store_book"
            ADD CONSTRAINT "FK_23588fd2b8637a053208a4d16bb" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "store_book" DROP CONSTRAINT "FK_23588fd2b8637a053208a4d16bb"
        `);
    await queryRunner.query(`
            ALTER TABLE "store_book" DROP CONSTRAINT "FK_17f80b28290c169d4bb8dc1893f"
        `);
    await queryRunner.query(`
            DROP TABLE "book"
        `);
    await queryRunner.query(`
            DROP TABLE "store_book"
        `);
    await queryRunner.query(`
            DROP TABLE "store"
        `);
    await queryRunner.query(`
            DROP TABLE "category"
        `);
  }
}
