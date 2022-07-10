import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookDescription1657476961979 implements MigrationInterface {
  name = 'AddBookDescription1657476961979';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "book"
            ADD "description" character varying
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "book" DROP COLUMN "description"
        `);
  }
}
