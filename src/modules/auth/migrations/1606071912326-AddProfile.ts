import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfile1606071912326 implements MigrationInterface {
  name = "AddProfile1606071912326";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "profiles" ("id" character varying NOT NULL, "username" character varying NOT NULL, CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "profiles"`, undefined);
  }
}
