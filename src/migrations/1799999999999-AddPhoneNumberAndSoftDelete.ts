import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPhoneNumberAndSoftDelete1799999999999 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasPhoneNumber = await queryRunner.hasColumn('users', 'phoneNumber');
        if (!hasPhoneNumber) {
            await queryRunner.addColumn(
                'users',
                new TableColumn({
                    name: 'phoneNumber',
                    type: 'varchar',
                    length: '20',
                    isNullable: true,
                })
            );
        }

        const hasSoftDelete = await queryRunner.hasColumn('tasks', 'isDeleted');
        if (!hasSoftDelete) {
            await queryRunner.addColumn(
                'tasks',
                new TableColumn({
                    name: 'isDeleted',
                    type: 'boolean',
                    default: false,
                })
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const hasSoftDelete = await queryRunner.hasColumn('tasks', 'isDeleted');
        if (hasSoftDelete) {
            await queryRunner.dropColumn('tasks', 'isDeleted');
        }

        const hasPhoneNumber = await queryRunner.hasColumn('users', 'phoneNumber');
        if (hasPhoneNumber) {
            await queryRunner.dropColumn('users', 'phoneNumber');
        }
    }
}
