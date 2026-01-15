import type { TableBuilder } from './TableBuilder';
import type { AlterTableBuilder } from './AlterTableBuilder';
import { BaseColumnBuilder } from './BaseColumnBuilder';

export class ColumnBuilder extends BaseColumnBuilder {
    private foreignKeyInfo?: {
        referencedTable: string;
        referencedColumn: string;
        onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
        onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    };

    constructor(
        name: string,
        private parent: TableBuilder | AlterTableBuilder
    ) {
        super(name);
    }

    get autoIncrement() {
        this.options.isGenerated = true;
        this.options.generationStrategy = 'increment';
        if (this.options.type === 'int') {
        }
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

    getForeignKeyInfo() {
        return this.foreignKeyInfo;
    }
}
