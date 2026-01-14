import { TableColumnOptions } from "typeorm";
import type { AlterTableBuilder } from "./AlterTableBuilder";

export class AlterColumnBuilder {
  private options: Partial<TableColumnOptions> = {};

  constructor(
    private name: string,
    private parent: AlterTableBuilder
  ) {
    this.options.name = name;
  }

  get int() {
    this.options.type = "int";
    return this;
  }

  get bigint() {
    this.options.type = "bigint";
    return this;
  }

  varchar(length?: number | string) {
    this.options.type = "varchar";
    if (length !== undefined) {
      this.options.length = length.toString();
    }
    return this;
  }

  get text() {
    this.options.type = "text";
    return this;
  }

  get boolean() {
    this.options.type = "boolean";
    return this;
  }

  get datetime() {
    this.options.type = "datetime";
    return this;
  }

  get date() {
    this.options.type = "date";
    return this;
  }

  decimal(precision?: number, scale?: number) {
    this.options.type = "decimal";
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
    this.options.generationStrategy = "increment";
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

  build(): TableColumnOptions {
    return this.options as TableColumnOptions;
  }

  getColumnName() {
    return this.name;
  }
}
