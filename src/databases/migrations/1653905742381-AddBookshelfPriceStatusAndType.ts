import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookshelfPriceStatusAndType1653905742381 implements MigrationInterface {
  name = 'AddBookshelfPriceStatusAndType1653905742381';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "bookshelf"
            ADD "sale_price" integer NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "bookshelf"
            ADD "rent_price" integer NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "bookshelf"
            ADD "status" character varying NOT NULL DEFAULT 'pending'
        `);
    await queryRunner.query(`
            ALTER TABLE "bookshelf"
            ADD "type" character varying NOT NULL DEFAULT 'unknown'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "bookshelf" DROP COLUMN "type"
        `);
    await queryRunner.query(`
            ALTER TABLE "bookshelf" DROP COLUMN "status"
        `);
    await queryRunner.query(`
            ALTER TABLE "bookshelf" DROP COLUMN "rent_price"
        `);
    await queryRunner.query(`
            ALTER TABLE "bookshelf" DROP COLUMN "sale_price"
        `);
  }
}
