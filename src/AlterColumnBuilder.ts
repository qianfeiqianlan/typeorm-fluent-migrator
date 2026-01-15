import type { AlterTableBuilder } from './AlterTableBuilder';
import { BaseColumnBuilder } from './BaseColumnBuilder';

export class AlterColumnBuilder extends BaseColumnBuilder {
    constructor(
        name: string,
        private parent: AlterTableBuilder
    ) {
        super(name);
    }

    addColumn(name: string) {
        return this.parent.addColumn(name);
    }

    dropColumn(name: string) {
        return this.parent.dropColumn(name);
    }

    alterColumn(name: string) {
        return this.parent.alterColumn(name);
    }

    async execute(): Promise<void> {
        return this.parent.execute();
    }
}
