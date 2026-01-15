import { QueryRunner, TableIndex } from 'typeorm';

export class IndexBuilder {
    private tableName?: string;
    private columnNames: string[] = [];
    private isUnique = false;

    constructor(
        private indexName: string,
        private queryRunner: QueryRunner
    ) {}

    on(tableName: string): this {
        this.tableName = tableName;
        return this;
    }

    column(columnName: string): this {
        this.columnNames.push(columnName);
        return this;
    }

    columns(...columnNames: string[]): this {
        this.columnNames.push(...columnNames);
        return this;
    }

    get unique(): this {
        this.isUnique = true;
        return this;
    }

    async execute(): Promise<void> {
        if (!this.tableName) {
            throw new Error("Table name is required. Use .on('tableName') to specify the table.");
        }

        if (this.columnNames.length === 0) {
            throw new Error("At least one column is required. Use .column('columnName') to specify columns.");
        }

        const index = new TableIndex({
            name: this.indexName,
            columnNames: this.columnNames,
            isUnique: this.isUnique,
        });

        await this.queryRunner.createIndex(this.tableName, index);
    }
}
