import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserCoin1656913324173 implements MigrationInterface {
  name = 'AddUserCoin1656913324173';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "coin" numeric NOT NULL DEFAULT '0'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "coin"
        `);
  }
}
