import { QueryRunner } from "typeorm";
import { TableBuilder } from "./TableBuilder";
import { AlterTableBuilder } from "./AlterTableBuilder";

export class FL {
  constructor(private queryRunner: QueryRunner) {}

  static use(queryRunner: QueryRunner): FL {
    return new FL(queryRunner);
  }

  get create() {
    return {
      table: (name: string) => new TableBuilder(name, this.queryRunner),
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
    };
  }
}
