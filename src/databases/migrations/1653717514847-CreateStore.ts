import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStore1653717514847 implements MigrationInterface {
  name = 'CreateStore1653717514847';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "book" DROP CONSTRAINT "FK_2d61d6f9356858f5e051305b647"
        `);
    await queryRunner.query(`
            ALTER TABLE "book" DROP COLUMN "store_id_id"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "book"
            ADD "store_id_id" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "book"
            ADD CONSTRAINT "FK_2d61d6f9356858f5e051305b647" FOREIGN KEY ("store_id_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
