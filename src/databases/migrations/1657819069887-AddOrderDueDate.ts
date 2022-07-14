import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderDueDate1657819069887 implements MigrationInterface {
  name = 'AddOrderDueDate1657819069887';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "order"
            ADD "due_date" TIMESTAMP WITH TIME ZONE NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "order" DROP COLUMN "due_date"
        `);
  }
}
