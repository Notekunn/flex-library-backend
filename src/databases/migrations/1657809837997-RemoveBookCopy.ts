import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveBookCopy1657809837997 implements MigrationInterface {
  name = 'RemoveBookCopy1657809837997';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "book_loan" DROP CONSTRAINT "FK_bc599e13e4ad88a377c89fb538a"
        `);
    await queryRunner.query(`
            ALTER TABLE "book_loan"
                RENAME COLUMN "book_copy_id" TO "book_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "book"
            ADD "barcode" character varying NOT NULL DEFAULT 100
        `);
    await queryRunner.query(`
            ALTER TABLE "book_loan"
            ADD CONSTRAINT "FK_becb3aaca43c9597adc0bcae91e" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`ALTER TABLE "book_copy" DROP CONSTRAINT "FK_a3365d29e50bf551ff93777d4cb"`);
    await queryRunner.query(`DROP TABLE "book_copy"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "book_loan" DROP CONSTRAINT "FK_becb3aaca43c9597adc0bcae91e"
        `);
    await queryRunner.query(`
            ALTER TABLE "book" DROP COLUMN "barcode"
        `);
    await queryRunner.query(`
            ALTER TABLE "book_loan"
                RENAME COLUMN "book_id" TO "book_copy_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "book_loan"
            ADD CONSTRAINT "FK_bc599e13e4ad88a377c89fb538a" FOREIGN KEY ("book_copy_id") REFERENCES "book_copy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
