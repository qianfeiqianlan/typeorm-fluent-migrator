import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DataSource } from 'typeorm';
import { FL, ColumnTypes } from '../../src';

describe('BaseColumnBuilder - type() method', () => {
    let dataSource: DataSource;
    let queryRunner: any;

    beforeAll(async () => {
        dataSource = new DataSource({
            type: 'better-sqlite3',
            database: ':memory:',
            synchronize: false,
            logging: false,
        });

        await dataSource.initialize();
        queryRunner = dataSource.createQueryRunner();
    });

    afterAll(async () => {
        if (queryRunner) {
            await queryRunner.release();
        }
        if (dataSource && dataSource.isInitialized) {
            await dataSource.destroy();
        }
    });

    describe('Create Table with type() method', () => {
        it('should create a table column using ColumnTypes.MYSQL.INT', async () => {
            await FL.use(queryRunner)
                .create.table('test_mysql_int')
                .column('id')
                .type(ColumnTypes.MYSQL.INT)
                .primary.autoIncrement
                .execute();

            const tables = await queryRunner.getTables();
            const table = tables.find((t: any) => t.name === 'test_mysql_int');
            expect(table).toBeDefined();

            const idColumn = table?.columns.find((c: any) => c.name === 'id');
            expect(idColumn?.type.toLowerCase()).toContain('int');
            expect(idColumn?.isPrimary).toBe(true);
        });

        it('should create a table column using ColumnTypes.POSTGRES.VARCHAR', async () => {
            await FL.use(queryRunner)
                .create.table('test_postgres_varchar')
                .column('name')
                .type(ColumnTypes.POSTGRES.VARCHAR)
                .notNull
                .execute();

            const tables = await queryRunner.getTables();
            const table = tables.find((t: any) => t.name === 'test_postgres_varchar');
            expect(table).toBeDefined();

            const nameColumn = table?.columns.find((c: any) => c.name === 'name');
            expect(nameColumn?.type.toLowerCase()).toBe('varchar');
            expect(nameColumn?.isNullable).toBe(false);
        });

        it('should create a table column using ColumnTypes.SQL_SERVER.DECIMAL', async () => {
            await FL.use(queryRunner)
                .create.table('test_sqlserver_decimal')
                .column('price')
                .type(ColumnTypes.SQL_SERVER.DECIMAL)
                .nullable
                .execute();

            const tables = await queryRunner.getTables();
            const table = tables.find((t: any) => t.name === 'test_sqlserver_decimal');
            expect(table).toBeDefined();

            const priceColumn = table?.columns.find((c: any) => c.name === 'price');
            expect(priceColumn?.type.toLowerCase()).toBe('decimal');
            expect(priceColumn?.isNullable).toBe(true);
        });

        it('should create a table column using ColumnTypes.SQLITE.TEXT', async () => {
            await FL.use(queryRunner)
                .create.table('test_sqlite_text')
                .column('content')
                .type(ColumnTypes.SQLITE.TEXT)
                .nullable
                .execute();

            const tables = await queryRunner.getTables();
            const table = tables.find((t: any) => t.name === 'test_sqlite_text');
            expect(table).toBeDefined();

            const contentColumn = table?.columns.find((c: any) => c.name === 'content');
            expect(contentColumn?.type.toLowerCase()).toBe('text');
        });

        it('should create a table column using ColumnTypes.ORACLE.NUMBER', async () => {
            await FL.use(queryRunner)
                .create.table('test_oracle_number')
                .column('value')
                .type(ColumnTypes.ORACLE.NUMBER)
                .nullable
                .execute();

            const tables = await queryRunner.getTables();
            const table = tables.find((t: any) => t.name === 'test_oracle_number');
            expect(table).toBeDefined();

            const valueColumn = table?.columns.find((c: any) => c.name === 'value');
            expect(valueColumn?.type.toLowerCase()).toBe('number');
        });

        it('should create a table column using ColumnTypes.COCKROACHDB.JSONB', async () => {
            await FL.use(queryRunner)
                .create.table('test_cockroach_jsonb')
                .column('data')
                .type(ColumnTypes.COCKROACHDB.JSONB)
                .nullable
                .execute();

            const tables = await queryRunner.getTables();
            const table = tables.find((t: any) => t.name === 'test_cockroach_jsonb');
            expect(table).toBeDefined();

            const dataColumn = table?.columns.find((c: any) => c.name === 'data');
            expect(dataColumn?.type.toLowerCase()).toBe('jsonb');
        });

        it('should create a table with multiple columns using different ColumnTypes', async () => {
            await FL.use(queryRunner)
                .create.table('test_mixed_types')
                .column('id').type(ColumnTypes.MYSQL.INT).primary.autoIncrement
                .column('name').type(ColumnTypes.POSTGRES.TEXT).notNull
                .column('price').type(ColumnTypes.SQL_SERVER.DECIMAL).nullable
                .column('createdAt').type(ColumnTypes.SQLITE.DATETIME).default('CURRENT_TIMESTAMP')
                .execute();

            const tables = await queryRunner.getTables();
            const table = tables.find((t: any) => t.name === 'test_mixed_types');
            expect(table).toBeDefined();
            expect(table?.columns.length).toBe(4);

            const idColumn = table?.columns.find((c: any) => c.name === 'id');
            expect(idColumn?.type.toLowerCase()).toContain('int');
            expect(idColumn?.isPrimary).toBe(true);

            const nameColumn = table?.columns.find((c: any) => c.name === 'name');
            expect(nameColumn?.type.toLowerCase()).toBe('text');
            expect(nameColumn?.isNullable).toBe(false);

            const priceColumn = table?.columns.find((c: any) => c.name === 'price');
            expect(priceColumn?.type.toLowerCase()).toBe('decimal');

            const createdAtColumn = table?.columns.find((c: any) => c.name === 'createdAt');
            expect(createdAtColumn?.type.toLowerCase()).toBe('datetime');
        });
    });

    describe('Alter Table with type() method', () => {
        it('should alter a column using ColumnTypes.MYSQL.VARCHAR', async () => {
            await FL.use(queryRunner)
                .create.table('test_alter_type')
                .column('id').int.primary.autoIncrement
                .column('name').varchar(50).notNull
                .execute();

            await FL.use(queryRunner)
                .alter.table('test_alter_type')
                .alterColumn('name')
                .type(ColumnTypes.MYSQL.VARCHAR)
                .notNull
                .execute();

            const tables = await queryRunner.getTables();
            const table = tables.find((t: any) => t.name === 'test_alter_type');
            const nameColumn = table?.columns.find((c: any) => c.name === 'name');
            expect(nameColumn?.type.toLowerCase()).toBe('varchar');
        });

        it('should add a column using ColumnTypes.POSTGRES.JSON', async () => {
            await FL.use(queryRunner)
                .create.table('test_add_type')
                .column('id')
                .int.primary.autoIncrement
                .execute();

            await FL.use(queryRunner)
                .alter.table('test_add_type')
                .addColumn('metadata')
                .type(ColumnTypes.POSTGRES.JSON)
                .nullable
                .execute();

            const tables = await queryRunner.getTables();
            const table = tables.find((t: any) => t.name === 'test_add_type');
            const metadataColumn = table?.columns.find((c: any) => c.name === 'metadata');
            expect(metadataColumn?.type.toLowerCase()).toBe('json');
            expect(metadataColumn?.isNullable).toBe(true);
        });

        it('should alter a column using ColumnTypes.SQL_SERVER.NVARCHAR', async () => {
            await FL.use(queryRunner)
                .create.table('test_nvarchar')
                .column('id').int.primary.autoIncrement
                .column('title').varchar(100).notNull
                .execute();

            await FL.use(queryRunner)
                .alter.table('test_nvarchar')
                .alterColumn('title')
                .type(ColumnTypes.SQL_SERVER.NVARCHAR)
                .notNull
                .execute();

            const tables = await queryRunner.getTables();
            const table = tables.find((t: any) => t.name === 'test_nvarchar');
            const titleColumn = table?.columns.find((c: any) => c.name === 'title');
            expect(titleColumn?.type.toLowerCase()).toBe('nvarchar');
        });
    });

    describe('type() method with constraints', () => {
        it('should combine type() with primary and autoIncrement', async () => {
            await FL.use(queryRunner)
                .create.table('test_type_primary')
                .column('id')
                .type(ColumnTypes.MYSQL.INT)
                .primary.autoIncrement
                .execute();

            const tables = await queryRunner.getTables();
            const table = tables.find((t: any) => t.name === 'test_type_primary');
            const idColumn = table?.columns.find((c: any) => c.name === 'id');
            expect(idColumn?.type.toLowerCase()).toContain('int');
            expect(idColumn?.isPrimary).toBe(true);
            expect(idColumn?.isGenerated).toBe(true);
        });

        it('should combine type() with unique constraint', async () => {
            await FL.use(queryRunner)
                .create.table('test_type_unique')
                .column('id').int.primary.autoIncrement
                .column('email').type(ColumnTypes.POSTGRES.VARCHAR).unique.notNull
                .execute();

            const tables = await queryRunner.getTables();
            const table = tables.find((t: any) => t.name === 'test_type_unique');
            const emailColumn = table?.columns.find((c: any) => c.name === 'email');
            expect(emailColumn?.type.toLowerCase()).toBe('varchar');
            expect(emailColumn?.isUnique).toBe(true);
            expect(emailColumn?.isNullable).toBe(false);
        });

        it('should combine type() with default value', async () => {
            await FL.use(queryRunner)
                .create.table('test_type_default')
                .column('id').int.primary.autoIncrement
                .column('status').type(ColumnTypes.SQL_SERVER.INT).default(1).notNull
                .execute();

            const tables = await queryRunner.getTables();
            const table = tables.find((t: any) => t.name === 'test_type_default');
            const statusColumn = table?.columns.find((c: any) => c.name === 'status');
            expect(statusColumn?.type.toLowerCase()).toContain('int');
            expect(statusColumn?.default === 1 || statusColumn?.default === '1').toBe(true);
            expect(statusColumn?.isNullable).toBe(false);
        });
    });

    describe('type() method chaining', () => {
        it('should support chaining type() with other column methods', async () => {
            await FL.use(queryRunner)
                .create.table('test_type_chain')
                .column('id').type(ColumnTypes.MYSQL.INT).primary.autoIncrement
                .column('name').type(ColumnTypes.POSTGRES.TEXT).notNull
                .column('age').type(ColumnTypes.SQL_SERVER.SMALLINT).nullable
                .execute();

            const tables = await queryRunner.getTables();
            const table = tables.find((t: any) => t.name === 'test_type_chain');
            expect(table?.columns.length).toBe(3);

            const idColumn = table?.columns.find((c: any) => c.name === 'id');
            expect(idColumn?.type.toLowerCase()).toContain('int');

            const nameColumn = table?.columns.find((c: any) => c.name === 'name');
            expect(nameColumn?.type.toLowerCase()).toBe('text');

            const ageColumn = table?.columns.find((c: any) => c.name === 'age');
            expect(ageColumn?.type.toLowerCase()).toBe('smallint');
        });
    });
});
