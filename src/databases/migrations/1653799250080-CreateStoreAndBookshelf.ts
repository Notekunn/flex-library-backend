import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStoreAndBookshelf1653799250080 implements MigrationInterface {
  name = 'CreateStoreAndBookshelf1653799250080';

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
            CREATE TABLE "store" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "address" character varying NOT NULL,
                "owner_id" integer,
                CONSTRAINT "PK_f3172007d4de5ae8e7692759d79" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "bookshelf" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" SERIAL NOT NULL,
                "barcode" character varying NOT NULL,
                "store_id" integer,
                "book_id" integer,
                CONSTRAINT "PK_4f83bc8f46bc42b64a15a74ed91" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "book" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "price" integer NOT NULL,
                "image_url" character varying NOT NULL DEFAULT false,
                "quantity" integer NOT NULL DEFAULT '0',
                CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id")
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
            ALTER TABLE "store"
            ADD CONSTRAINT "FK_8ce7c0371b6fca43a17f523ce44" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "bookshelf"
            ADD CONSTRAINT "FK_b79a2e26e7b82421c7b97aac549" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "bookshelf"
            ADD CONSTRAINT "FK_32228a59121bff3f0fb688af590" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "bookshelf" DROP CONSTRAINT "FK_32228a59121bff3f0fb688af590"
        `);
    await queryRunner.query(`
            ALTER TABLE "bookshelf" DROP CONSTRAINT "FK_b79a2e26e7b82421c7b97aac549"
        `);
    await queryRunner.query(`
            ALTER TABLE "store" DROP CONSTRAINT "FK_8ce7c0371b6fca43a17f523ce44"
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
            DROP TABLE "book"
        `);
    await queryRunner.query(`
            DROP TABLE "bookshelf"
        `);
    await queryRunner.query(`
            DROP TABLE "store"
        `);
    await queryRunner.query(`
            DROP TABLE "category"
        `);
  }
}
