import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateBookDefaultNumOfCopies1654474882800 implements MigrationInterface {
  name = 'UpdateBookDefaultNumOfCopies1654474882800';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "book"
            ALTER COLUMN "num_of_copies"
            SET DEFAULT '0'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "book"
            ALTER COLUMN "num_of_copies" DROP DEFAULT
        `);
  }
}
