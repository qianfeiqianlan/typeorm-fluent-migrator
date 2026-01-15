import { QueryRunner } from 'typeorm';
import { TableBuilder } from './TableBuilder';
import { AlterTableBuilder } from './AlterTableBuilder';
import { IndexBuilder } from './IndexBuilder';

export class FL {
    constructor(private queryRunner: QueryRunner) {}

    static use(queryRunner: QueryRunner): FL {
        return new FL(queryRunner);
    }

    get create() {
        return {
            table: (name: string) => new TableBuilder(name, this.queryRunner),
            index: (name: string) => new IndexBuilder(name, this.queryRunner),
        };
    }

    get alter() {
        return {
            table: (name: string) => new AlterTableBuilder(name, this.queryRunner),
        };
    }

    get drop() {
        return {
            table: async (name: string) => {
                await this.queryRunner.dropTable(name, true);
            },
            index: async (tableName: string, indexName: string) => {
                await this.queryRunner.dropIndex(tableName, indexName);
            },
        };
    }
}
