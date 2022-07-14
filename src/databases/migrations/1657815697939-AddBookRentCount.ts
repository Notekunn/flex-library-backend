import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookRentCount1657815697939 implements MigrationInterface {
  name = 'AddBookRentCount1657815697939';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "book"
            ADD "rent_count" integer NOT NULL DEFAULT '0'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "book" DROP COLUMN "rent_count"
        `);
  }
}
