import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStoreAvatar1657032667762 implements MigrationInterface {
  name = 'AddStoreAvatar1657032667762';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "store"
            ADD "avatar_url" character varying
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "store" DROP COLUMN "avatar_url"
        `);
  }
}
