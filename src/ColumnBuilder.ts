import { TableColumnOptions } from 'typeorm';
import type { TableBuilder } from './TableBuilder';
import type { AlterTableBuilder } from './AlterTableBuilder';

export class ColumnBuilder {
    private options: Partial<TableColumnOptions> = {};
    private foreignKeyInfo?: {
        referencedTable: string;
        referencedColumn: string;
        onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
        onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    };

    constructor(
        private name: string,
        private parent: TableBuilder | AlterTableBuilder
    ) {
        this.options.name = name;
    }

    get int() {
        this.options.type = 'int';
        return this;
    }

    get bigint() {
        this.options.type = 'bigint';
        return this;
    }

    varchar(length?: number | string) {
        this.options.type = 'varchar';
        if (length !== undefined) {
            this.options.length = length.toString();
        }
        return this;
    }

    get text() {
        this.options.type = 'text';
        return this;
    }

    get boolean() {
        this.options.type = 'boolean';
        return this;
    }

    get datetime() {
        this.options.type = 'datetime';
        return this;
    }

    get date() {
        this.options.type = 'date';
        return this;
    }

    decimal(precision?: number, scale?: number) {
        this.options.type = 'decimal';
        if (precision !== undefined) {
            this.options.precision = precision;
        }
        if (scale !== undefined) {
            this.options.scale = scale;
        }
        return this;
    }

    get primary() {
        this.options.isPrimary = true;
        return this;
    }

    get autoIncrement() {
        this.options.isGenerated = true;
        this.options.generationStrategy = 'increment';
        if (this.options.type === 'int') {
        }
        return this;
    }

    get nullable() {
        this.options.isNullable = true;
        return this;
    }

    get notNull() {
        this.options.isNullable = false;
        return this;
    }

    get unique() {
        this.options.isUnique = true;
        return this;
    }

    default(value: string | number | boolean) {
        this.options.default = value;
        return this;
    }

    references(table: string, column: string) {
        this.foreignKeyInfo = {
            referencedTable: table,
            referencedColumn: column,
        };
        return this;
    }

    onDelete(action: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION') {
        if (this.foreignKeyInfo) {
            this.foreignKeyInfo.onDelete = action;
        }
        return this;
    }

    onUpdate(action: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION') {
        if (this.foreignKeyInfo) {
            this.foreignKeyInfo.onUpdate = action;
        }
        return this;
    }

    column(name: string): ColumnBuilder {
        if ('column' in this.parent) {
            return this.parent.column(name);
        }
        return this.parent.addColumn(name);
    }

    addColumn(name: string): ColumnBuilder {
        if ('addColumn' in this.parent) {
            return this.parent.addColumn(name);
        }
        return this.parent.column(name);
    }

    dropColumn(name: string) {
        if ('dropColumn' in this.parent) {
            return this.parent.dropColumn(name);
        }
        throw new Error('dropColumn is only available in alter table context');
    }

    alterColumn(name: string) {
        if ('alterColumn' in this.parent) {
            return this.parent.alterColumn(name);
        }
        throw new Error('alterColumn is only available in alter table context');
    }

    async execute(): Promise<void> {
        return this.parent.execute();
    }

    build(): TableColumnOptions {
        return this.options as TableColumnOptions;
    }

    getForeignKeyInfo() {
        return this.foreignKeyInfo;
    }

    getColumnName() {
        return this.name;
    }
}
