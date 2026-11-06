import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneNumberToUser1792656302965 implements MigrationInterface {
    name = 'AddPhoneNumberToUser1792656302965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phoneNumber\` varchar(20) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phoneNumber\``);
    }

}
