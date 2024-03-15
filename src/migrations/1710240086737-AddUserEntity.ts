import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserEntity1710240086737 implements MigrationInterface {
    name = 'AddUserEntity1710240086737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`INSERT INTO "user" (first_name, last_name, email) VALUES ('John', 'Doe', 'john@doe.com'), ('Mark', 'Smith', 'mark@smith.com')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
