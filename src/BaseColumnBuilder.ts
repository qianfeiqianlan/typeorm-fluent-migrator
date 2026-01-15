import { TableColumnOptions } from 'typeorm';

export abstract class BaseColumnBuilder {
    protected options: Partial<TableColumnOptions> = {};

    constructor(protected name: string) {
        this.options.name = name;
    }

    get int() {
        this.options.type = 'int';
        return this;
    }

    get integer() {
        this.options.type = 'integer';
        return this;
    }

    get smallint() {
        this.options.type = 'smallint';
        return this;
    }

    get bigint() {
        this.options.type = 'bigint';
        return this;
    }

    get float() {
        this.options.type = 'float';
        return this;
    }

    get real() {
        this.options.type = 'real';
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

    numeric(precision?: number, scale?: number) {
        this.options.type = 'numeric';
        if (precision !== undefined) {
            this.options.precision = precision;
        }
        if (scale !== undefined) {
            this.options.scale = scale;
        }
        return this;
    }

    char(length?: number | string) {
        this.options.type = 'char';
        if (length !== undefined) {
            this.options.length = length.toString();
        }
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

    get json() {
        this.options.type = 'json';
        return this;
    }

    get date() {
        this.options.type = 'date';
        return this;
    }

    get time() {
        this.options.type = 'time';
        return this;
    }

    get timestamp() {
        this.options.type = 'timestamp';
        return this;
    }

    get primary() {
        this.options.isPrimary = true;
        return this;
    }

    get autoIncrement() {
        this.options.isGenerated = true;
        this.options.generationStrategy = 'increment';
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

    build(): TableColumnOptions {
        return this.options as TableColumnOptions;
    }

    getColumnName() {
        return this.name;
    }
}
