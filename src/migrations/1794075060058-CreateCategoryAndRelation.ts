
import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey
} from "typeorm";

export class CreateCategoryAndRelation1794072213485 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: "category",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "name",
                        type: "varchar",
                        isUnique: true
                    }
                ]
            })
        );

        await queryRunner.addColumn(
            "tasks",
            new TableColumn({
                name: "categoryId",
                type: "int",
                isNullable: true
            })
        );

        await queryRunner.createForeignKey(
            "tasks",
            new TableForeignKey({
                columnNames: ["categoryId"],
                referencedColumnNames: ["id"],
                referencedTableName: "category",
                onDelete: "SET NULL"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        const table = await queryRunner.getTable("tasks");

        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.includes("categoryId")
        );

        if (foreignKey) {
            await queryRunner.dropForeignKey("tasks", foreignKey);
        }

        await queryRunner.dropColumn("tasks", "categoryId");

        await queryRunner.dropTable("category");
    }
}
