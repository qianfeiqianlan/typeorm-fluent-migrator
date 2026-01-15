import { QueryRunner, TableColumn } from 'typeorm';
import { ColumnBuilder } from './ColumnBuilder';
import { AlterColumnBuilder } from './AlterColumnBuilder';

export class AlterTableBuilder {
    private addColumns: ColumnBuilder[] = [];
    private dropColumns: string[] = [];
    private alterColumns: AlterColumnBuilder[] = [];

    constructor(
        private tableName: string,
        private queryRunner: QueryRunner
    ) {}

    addColumn(name: string): ColumnBuilder {
        const builder = new ColumnBuilder(name, this);
        this.addColumns.push(builder);
        return builder;
    }

    dropColumn(name: string): AlterTableBuilder {
        this.dropColumns.push(name);
        return this;
    }

    alterColumn(name: string): AlterColumnBuilder {
        const builder = new AlterColumnBuilder(name, this);
        this.alterColumns.push(builder);
        return builder;
    }

    async execute(): Promise<void> {
        for (const column of this.addColumns) {
            const columnOptions = column.build();
            const driver = this.queryRunner.connection?.driver;
            if (driver && driver.options?.type === 'better-sqlite3') {
                if (
                    columnOptions.type === 'int' &&
                    columnOptions.isPrimary &&
                    columnOptions.isGenerated &&
                    columnOptions.generationStrategy === 'increment'
                ) {
                    columnOptions.type = 'integer';
                }
            }
            await this.queryRunner.addColumn(this.tableName, new TableColumn(columnOptions));
        }

        for (const columnName of this.dropColumns) {
            await this.queryRunner.dropColumn(this.tableName, columnName);
        }

        for (const column of this.alterColumns) {
            const columnOptions = column.build();
            const driver = this.queryRunner.connection?.driver;
            if (driver && driver.options?.type === 'better-sqlite3') {
                if (
                    columnOptions.type === 'int' &&
                    columnOptions.isPrimary &&
                    columnOptions.isGenerated &&
                    columnOptions.generationStrategy === 'increment'
                ) {
                    columnOptions.type = 'integer';
                }
            }
            await this.queryRunner.changeColumn(this.tableName, column.getColumnName(), new TableColumn(columnOptions));
        }
    }
}
