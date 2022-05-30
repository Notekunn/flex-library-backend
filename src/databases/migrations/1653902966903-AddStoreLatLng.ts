import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStoreLatLng1653902966903 implements MigrationInterface {
  name = 'AddStoreLatLng1653902966903';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "store"
            ADD "latitude" double precision
        `);
    await queryRunner.query(`
            ALTER TABLE "store"
            ADD "longitude" double precision
        `);
    await queryRunner.query(`
            ALTER TABLE "store"
            ADD "province_id" integer
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_66df34da7fb037e24fc7fee642" ON "store" ("name")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_8513cec8fd3b653fdba31ae4cc" ON "store" ("latitude")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_57d923a32b9401f3616ae9bc14" ON "store" ("longitude")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_57d923a32b9401f3616ae9bc14"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_8513cec8fd3b653fdba31ae4cc"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_66df34da7fb037e24fc7fee642"
        `);
    await queryRunner.query(`
            ALTER TABLE "store" DROP COLUMN "province_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "store" DROP COLUMN "longitude"
        `);
    await queryRunner.query(`
            ALTER TABLE "store" DROP COLUMN "latitude"
        `);
  }
}
