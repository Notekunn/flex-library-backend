import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrderUserRelation1656520689798 implements MigrationInterface {
  name = 'UpdateOrderUserRelation1656520689798';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "order" DROP CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd"
        `);
    await queryRunner.query(`
            ALTER TABLE "order" DROP CONSTRAINT "REL_199e32a02ddc0f47cd93181d8f"
        `);
    await queryRunner.query(`
            ALTER TABLE "book"
            ALTER COLUMN "num_of_copies"
            SET DEFAULT '1'
        `);
    await queryRunner.query(`
            ALTER TABLE "order"
            ADD CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "order" DROP CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd"
        `);
    await queryRunner.query(`
            ALTER TABLE "book"
            ALTER COLUMN "num_of_copies"
            SET DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "order"
            ADD CONSTRAINT "REL_199e32a02ddc0f47cd93181d8f" UNIQUE ("user_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "order"
            ADD CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
