import { MigrationInterface, QueryRunner } from "typeorm";

export class UserDetails1560941780244 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "UserRoles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_a44a2382829972daa2a31345f56" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "UserDetails" ("id" character varying NOT NULL, "lastLogin" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "roleId" uuid, CONSTRAINT "REL_ab78d8466a48ba220965b62485" UNIQUE ("roleId"), CONSTRAINT "PK_18c1cf20ac1c7995315f3f656bb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserDetails" ADD CONSTRAINT "FK_ab78d8466a48ba220965b624853" FOREIGN KEY ("roleId") REFERENCES "UserRoles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "UserDetails" DROP CONSTRAINT "FK_ab78d8466a48ba220965b624853"`,
    );
    await queryRunner.query(`DROP TABLE "UserDetails"`);
    await queryRunner.query(`DROP TABLE "UserRoles"`);
  }
}
