import { QueryRunner, Table, TableForeignKeyOptions } from 'typeorm';
import { ColumnBuilder } from './ColumnBuilder';

export class TableBuilder {
    private columns: ColumnBuilder[] = [];

    constructor(
        private tableName: string,
        private queryRunner: QueryRunner
    ) {}

    column(name: string): ColumnBuilder {
        const builder = new ColumnBuilder(name, this);
        this.columns.push(builder);
        return builder;
    }

    async execute(): Promise<void> {
        let columnOptions = this.columns.map((c) => c.build());

        const driver = this.queryRunner.connection?.driver;
        if (driver && driver.options?.type === 'better-sqlite3') {
            columnOptions = columnOptions.map((col) => {
                if (col.type === 'int' && col.isPrimary && col.isGenerated && col.generationStrategy === 'increment') {
                    return { ...col, type: 'integer' };
                }
                return col;
            });
        }

        const foreignKeys: TableForeignKeyOptions[] = [];
        for (const column of this.columns) {
            const fkInfo = column.getForeignKeyInfo();
            if (fkInfo) {
                foreignKeys.push({
                    columnNames: [column.getColumnName()],
                    referencedTableName: fkInfo.referencedTable,
                    referencedColumnNames: [fkInfo.referencedColumn],
                    onDelete: fkInfo.onDelete,
                    onUpdate: fkInfo.onUpdate,
                });
            }
        }

        const table = new Table({
            name: this.tableName,
            columns: columnOptions,
            foreignKeys: foreignKeys.length > 0 ? foreignKeys : undefined,
        });
        await this.queryRunner.createTable(table, true);
    }
}
