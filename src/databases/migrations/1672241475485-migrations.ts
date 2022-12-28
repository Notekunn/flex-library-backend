import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1672241475485 implements MigrationInterface {
  name = 'migrations1672241475485';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "payment-package" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "price" integer NOT NULL,
                "coin" integer NOT NULL,
                "image_url" character varying NOT NULL,
                CONSTRAINT "PK_2a29735de62be6a46afa72ac349" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "book"
            ALTER COLUMN "barcode" DROP DEFAULT
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "book"
            ALTER COLUMN "barcode"
            SET DEFAULT '100'
        `);
    await queryRunner.query(`
            DROP TABLE "payment-package"
        `);
  }
}
