import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateBookLoanStatus1654361300456 implements MigrationInterface {
  name = 'UpdateBookLoanStatus1654361300456';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "book_loan"
            ADD "status" character varying NOT NULL DEFAULT 'renting'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "book_loan" DROP COLUMN "status"
        `);
  }
}
