import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { DataSource } from "typeorm";
import { FL } from "../../src";

describe("FL - Create Table", () => {
  let dataSource: DataSource;
  let queryRunner: any;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "better-sqlite3",
      database: ":memory:",
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

  it("should create a simple table with basic columns", async () => {
    await FL.use(queryRunner)
      .create.table("users")
      .column("id").int.primary.autoIncrement
      .column("name").varchar(255).notNull
      .column("age").int.nullable
      .execute();

    const tables = await queryRunner.getTables();
    const usersTable = tables.find((t: any) => t.name === "users");
    expect(usersTable).toBeDefined();
    expect(usersTable?.columns.length).toBe(3);

    const idColumn = usersTable?.columns.find((c: any) => c.name === "id");
    expect(idColumn?.type.toLowerCase()).toContain("int");
    expect(idColumn?.isPrimary).toBe(true);
    expect(idColumn?.isGenerated).toBe(true);

    const nameColumn = usersTable?.columns.find((c: any) => c.name === "name");
    expect(nameColumn?.type.toLowerCase()).toContain("varchar");
    expect(nameColumn?.length).toBe("255");
    expect(nameColumn?.isNullable).toBe(false);

    const ageColumn = usersTable?.columns.find((c: any) => c.name === "age");
    expect(ageColumn?.type.toLowerCase()).toContain("int");
    expect(ageColumn?.isNullable).toBe(true);
  });

  it("should create a table with various column types", async () => {
    await FL.use(queryRunner)
      .create.table("posts")
      .column("id").int.primary.autoIncrement
      .column("title").varchar(100).notNull
      .column("content").text.nullable
      .column("isPublished").smallint.default(0)
      .column("createdAt").timestamp.default("CURRENT_TIMESTAMP")
      .column("price").decimal(10, 2).nullable
      .execute();

    const tables = await queryRunner.getTables();
    const postsTable = tables.find((t: any) => t.name === "posts");
    expect(postsTable).toBeDefined();
    expect(postsTable?.columns.length).toBe(6);

    const contentColumn = postsTable?.columns.find((c: any) => c.name === "content");
    expect(contentColumn?.type.toLowerCase()).toBe("text");

    const isPublishedColumn = postsTable?.columns.find((c: any) => c.name === "isPublished");
    expect(isPublishedColumn?.type.toLowerCase()).toBe("smallint");
    expect(isPublishedColumn?.default === 0 || isPublishedColumn?.default === "0").toBe(true);
  });

  it("should create a table with foreign key", async () => {
    await FL.use(queryRunner)
      .create.table("organizations")
      .column("id").int.primary.autoIncrement
      .column("name").varchar(255).notNull
      .execute();

    await FL.use(queryRunner)
      .create.table("employees")
      .column("id").int.primary.autoIncrement
      .column("name").varchar(255).notNull
      .column("orgId").int.notNull.references("organizations", "id")
      .onDelete("CASCADE")
      .execute();

    const tables = await queryRunner.getTables();
    const employeesTable = tables.find((t: any) => t.name === "employees");
    expect(employeesTable).toBeDefined();

    const foreignKeys = employeesTable?.foreignKeys || [];
    expect(foreignKeys.length).toBeGreaterThan(0);
    const fk = foreignKeys.find(
      (fk: any) =>
        fk.columnNames.includes("orgId") &&
        fk.referencedTableName === "organizations" &&
        fk.referencedColumnNames.includes("id")
    );
    expect(fk).toBeDefined();
    expect(fk?.onDelete).toBe("CASCADE");
  });

  it("should drop a table", async () => {
    await FL.use(queryRunner)
      .create.table("temp_table")
      .column("id").int.primary
      .execute();

    let tables = await queryRunner.getTables();
    expect(tables.find((t: any) => t.name === "temp_table")).toBeDefined();

    await FL.use(queryRunner).drop.table("temp_table");

    tables = await queryRunner.getTables();
    expect(tables.find((t: any) => t.name === "temp_table")).toBeUndefined();
  });

  describe("ColumnBuilder - Additional Features", () => {
    it("should create a table with date type column", async () => {
      await FL.use(queryRunner)
        .create.table("events")
        .column("id").int.primary.autoIncrement
        .column("eventDate").date.nullable
        .execute();

      const tables = await queryRunner.getTables();
      const eventsTable = tables.find((t: any) => t.name === "events");
      expect(eventsTable).toBeDefined();

      const eventDateColumn = eventsTable?.columns.find((c: any) => c.name === "eventDate");
      expect(eventDateColumn?.type.toLowerCase()).toBe("date");
      expect(eventDateColumn?.isNullable).toBe(true);
    });

    it("should create a table with unique constraint", async () => {
      await FL.use(queryRunner)
        .create.table("users_unique")
        .column("id").int.primary.autoIncrement
        .column("email").varchar(255).unique.notNull
        .column("username").varchar(100).unique.notNull
        .execute();

      const tables = await queryRunner.getTables();
      const usersTable = tables.find((t: any) => t.name === "users_unique");
      expect(usersTable).toBeDefined();

      const emailColumn = usersTable?.columns.find((c: any) => c.name === "email");
      expect(emailColumn?.isUnique).toBe(true);

      const usernameColumn = usersTable?.columns.find((c: any) => c.name === "username");
      expect(usernameColumn?.isUnique).toBe(true);
    });

    it("should create a table with foreign key and onUpdate", async () => {
      await FL.use(queryRunner)
        .create.table("categories")
        .column("id").int.primary.autoIncrement
        .column("name").varchar(255).notNull
        .execute();

      await FL.use(queryRunner)
        .create.table("products")
        .column("id").int.primary.autoIncrement
        .column("name").varchar(255).notNull
        .column("categoryId").int.notNull.references("categories", "id")
        .onUpdate("CASCADE")
        .execute();

      const tables = await queryRunner.getTables();
      const productsTable = tables.find((t: any) => t.name === "products");
      expect(productsTable).toBeDefined();

      const foreignKeys = productsTable?.foreignKeys || [];
      expect(foreignKeys.length).toBeGreaterThan(0);
      const fk = foreignKeys.find(
        (fk: any) =>
          fk.columnNames.includes("categoryId") &&
          fk.referencedTableName === "categories" &&
          fk.referencedColumnNames.includes("id")
      );
      expect(fk).toBeDefined();
      expect(fk?.onUpdate).toBe("CASCADE");
    });

    it("should create a table with foreign key using both onDelete and onUpdate", async () => {
      await FL.use(queryRunner)
        .create.table("departments")
        .column("id").int.primary.autoIncrement
        .column("name").varchar(255).notNull
        .execute();

      await FL.use(queryRunner)
        .create.table("employees_fk")
        .column("id").int.primary.autoIncrement
        .column("name").varchar(255).notNull
        .column("deptId").int.notNull.references("departments", "id")
        .onDelete("CASCADE")
        .onUpdate("RESTRICT")
        .execute();

      const tables = await queryRunner.getTables();
      const employeesTable = tables.find((t: any) => t.name === "employees_fk");
      expect(employeesTable).toBeDefined();

      const foreignKeys = employeesTable?.foreignKeys || [];
      expect(foreignKeys.length).toBeGreaterThan(0);
      const fk = foreignKeys.find(
        (fk: any) =>
          fk.columnNames.includes("deptId") &&
          fk.referencedTableName === "departments" &&
          fk.referencedColumnNames.includes("id")
      );
      expect(fk).toBeDefined();
      expect(fk?.onDelete).toBe("CASCADE");
      expect(fk?.onUpdate).toBe("RESTRICT");
    });

    it("should support alterColumn chaining in alter table context", async () => {
      await FL.use(queryRunner)
        .create.table("test_alter_chain")
        .column("id").int.primary.autoIncrement
        .column("name").varchar(50).notNull
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_alter_chain")
        .addColumn("email").varchar(255).nullable
        .alterColumn("name").varchar(100).notNull
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_alter_chain");
      expect(table?.columns.length).toBe(3);

      const nameColumn = table?.columns.find((c: any) => c.name === "name");
      expect(nameColumn?.length).toBe("100");

      const emailColumn = table?.columns.find((c: any) => c.name === "email");
      expect(emailColumn).toBeDefined();
    });

    it("should throw error when alterColumn is called in create table context", () => {
      const tableBuilder = FL.use(queryRunner).create.table("test_error");
      const columnBuilder = tableBuilder.column("id").int.primary.autoIncrement;
      
      expect(() => {
        columnBuilder.alterColumn("name");
      }).toThrow("alterColumn is only available in alter table context");
    });

    it("should support date type with default value", async () => {
      await FL.use(queryRunner)
        .create.table("schedules")
        .column("id").int.primary.autoIncrement
        .column("startDate").date.default("CURRENT_DATE")
        .column("endDate").date.nullable
        .execute();

      const tables = await queryRunner.getTables();
      const schedulesTable = tables.find((t: any) => t.name === "schedules");
      expect(schedulesTable).toBeDefined();

      const startDateColumn = schedulesTable?.columns.find((c: any) => c.name === "startDate");
      expect(startDateColumn?.type.toLowerCase()).toBe("date");
      expect(startDateColumn?.default).toBe("CURRENT_DATE");

      const endDateColumn = schedulesTable?.columns.find((c: any) => c.name === "endDate");
      expect(endDateColumn?.type.toLowerCase()).toBe("date");
      expect(endDateColumn?.isNullable).toBe(true);
    });

    it("should support unique constraint with nullable", async () => {
      await FL.use(queryRunner)
        .create.table("users_optional_unique")
        .column("id").int.primary.autoIncrement
        .column("email").varchar(255).unique.nullable
        .execute();

      const tables = await queryRunner.getTables();
      const usersTable = tables.find((t: any) => t.name === "users_optional_unique");
      expect(usersTable).toBeDefined();

      const emailColumn = usersTable?.columns.find((c: any) => c.name === "email");
      expect(emailColumn?.isUnique).toBe(true);
      expect(emailColumn?.isNullable).toBe(true);
    });

    it("should support column() chaining in create table context", async () => {
      await FL.use(queryRunner)
        .create.table("test_column_chain")
        .column("id").int.primary.autoIncrement
        .column("name").varchar(255).notNull
        .column("email").varchar(255).nullable
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_column_chain");
      expect(table?.columns.length).toBe(3);
    });

    it("should support addColumn() in create table context (fallback to column)", async () => {
      await FL.use(queryRunner)
        .create.table("test_addcolumn_fallback")
        .column("id").int.primary.autoIncrement
        .addColumn("name").varchar(255).notNull
        .addColumn("email").varchar(255).nullable
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_addcolumn_fallback");
      expect(table?.columns.length).toBe(3);
    });

    it("should throw error when dropColumn is called in create table context", () => {
      const tableBuilder = FL.use(queryRunner).create.table("test_error_drop");
      const columnBuilder = tableBuilder.column("id").int.primary.autoIncrement;

      expect(() => {
        columnBuilder.dropColumn("name");
      }).toThrow("dropColumn is only available in alter table context");
    });

    it("should create a table with varchar type without length", async () => {
      await FL.use(queryRunner)
        .create.table("test_varchar_no_length")
        .column("id").int.primary.autoIncrement
        .column("name").varchar().nullable
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_varchar_no_length");
      const column = table?.columns.find((c: any) => c.name === "name");
      expect(column?.type.toLowerCase()).toContain("varchar");
      expect(column?.length === undefined || column?.length === "").toBe(true);
    });

    it("should create a table with varchar type with length as number", async () => {
      await FL.use(queryRunner)
        .create.table("test_varchar_number_length")
        .column("id").int.primary.autoIncrement
        .column("code").varchar(50).notNull
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_varchar_number_length");
      const column = table?.columns.find((c: any) => c.name === "code");
      expect(column?.type.toLowerCase()).toContain("varchar");
      expect(column?.length).toBe("50");
    });

    it("should create a table with varchar type with length as string", async () => {
      await FL.use(queryRunner)
        .create.table("test_varchar_string_length")
        .column("id").int.primary.autoIncrement
        .column("name").varchar("255").notNull
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_varchar_string_length");
      const column = table?.columns.find((c: any) => c.name === "name");
      expect(column?.type.toLowerCase()).toContain("varchar");
      expect(column?.length).toBe("255");
    });

    it("should create a table with decimal type without precision and scale", async () => {
      await FL.use(queryRunner)
        .create.table("test_decimal_no_params")
        .column("id").int.primary.autoIncrement
        .column("amount").decimal().nullable
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_decimal_no_params");
      const column = table?.columns.find((c: any) => c.name === "amount");
      expect(column?.type.toLowerCase()).toBe("decimal");
      expect(column?.precision).toBeUndefined();
      expect(column?.scale).toBeUndefined();
    });

    it("should create a table with decimal type with only precision", async () => {
      await FL.use(queryRunner)
        .create.table("test_decimal_precision_only")
        .column("id").int.primary.autoIncrement
        .column("value").decimal(10).nullable
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_decimal_precision_only");
      const column = table?.columns.find((c: any) => c.name === "value");
      expect(column?.type.toLowerCase()).toBe("decimal");
      expect(column?.precision).toBe(10);
      expect(column?.scale).toBeUndefined();
    });

    it("should create a table with decimal type with precision and scale", async () => {
      await FL.use(queryRunner)
        .create.table("test_decimal_full")
        .column("id").int.primary.autoIncrement
        .column("price").decimal(10, 2).notNull
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_decimal_full");
      const column = table?.columns.find((c: any) => c.name === "price");
      expect(column?.type.toLowerCase()).toBe("decimal");
      expect(column?.precision).toBe(10);
      expect(column?.scale).toBe(2);
    });
  });

  describe("TableBuilder - Driver type checking", () => {
    it("should handle case when driver is null", async () => {
      const mockQueryRunner = {
        connection: null,
        createTable: async () => {},
      } as any;

      await FL.use(mockQueryRunner)
        .create.table("test_no_driver")
        .column("id").int.primary.autoIncrement
        .execute();

      expect(true).toBe(true);
    });

    it("should handle case when driver.options is null", async () => {
      const mockQueryRunner = {
        connection: {
          driver: {
            options: null,
          },
        },
        createTable: async () => {},
      } as any;

      await FL.use(mockQueryRunner)
        .create.table("test_no_driver_options")
        .column("id").int.primary.autoIncrement
        .execute();

      expect(true).toBe(true);
    });

    it("should handle case when driver.options.type is not better-sqlite3", async () => {
      const mockQueryRunner = {
        connection: {
          driver: {
            options: {
              type: "postgres",
            },
          },
        },
        createTable: async () => {},
      } as any;

      await FL.use(mockQueryRunner)
        .create.table("test_non_sqlite")
        .column("id").int.primary.autoIncrement
        .execute();

      expect(true).toBe(true);
    });

    it("should handle case when connection is undefined", async () => {
      const mockQueryRunner = {
        connection: undefined,
        createTable: async () => {},
      } as any;

      await FL.use(mockQueryRunner)
        .create.table("test_undefined_connection")
        .column("id").int.primary.autoIncrement
        .execute();

      expect(true).toBe(true);
    });
  });

  describe("ColumnBuilder - Conditional branches", () => {
    it("should handle onDelete when foreignKeyInfo is undefined", async () => {
      await FL.use(queryRunner)
        .create.table("test_ondelete_no_fk")
        .column("id").int.primary.autoIncrement
        .column("name").varchar(255).notNull
        .onDelete("CASCADE") // 没有先调用 references
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_ondelete_no_fk");
      expect(table).toBeDefined();
      expect(table?.columns.length).toBe(2);
    });

    it("should handle onUpdate when foreignKeyInfo is undefined", async () => {
      await FL.use(queryRunner)
        .create.table("test_onupdate_no_fk")
        .column("id").int.primary.autoIncrement
        .column("name").varchar(255).notNull
        .onUpdate("CASCADE") // 没有先调用 references
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_onupdate_no_fk");
      expect(table).toBeDefined();
      expect(table?.columns.length).toBe(2);
    });

    it("should handle autoIncrement when type is not int", async () => {
      const mockQueryRunner = {
        connection: {
          driver: {
            options: {
              type: "postgres", // 使用非 SQLite 数据库，避免 SQLite 限制
            },
          },
        },
        createTable: async () => {},
      } as any;

      await FL.use(mockQueryRunner)
        .create.table("test_autoinc_bigint")
        .column("id").bigint.primary.autoIncrement
        .column("name").varchar(255).notNull
        .execute();

      expect(true).toBe(true);
    });

    it("should handle autoIncrement when type is int", async () => {
      await FL.use(queryRunner)
        .create.table("test_autoinc_int")
        .column("id").int.primary.autoIncrement
        .column("name").varchar(255).notNull
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_autoinc_int");
      expect(table).toBeDefined();

      const idColumn = table?.columns.find((c: any) => c.name === "id");
      expect(idColumn?.type.toLowerCase()).toContain("int");
      expect(idColumn?.isPrimary).toBe(true);
      expect(idColumn?.isGenerated).toBe(true);
    });

    it("should handle onDelete and onUpdate when foreignKeyInfo exists", async () => {
      await FL.use(queryRunner)
        .create.table("test_fk_with_actions")
        .column("id").int.primary.autoIncrement
        .column("name").varchar(255).notNull
        .execute();

      await FL.use(queryRunner)
        .create.table("test_fk_child")
        .column("id").int.primary.autoIncrement
        .column("parentId").int.notNull.references("test_fk_with_actions", "id")
        .onDelete("CASCADE")
        .onUpdate("RESTRICT")
        .execute();

      const tables = await queryRunner.getTables();
      const childTable = tables.find((t: any) => t.name === "test_fk_child");
      expect(childTable).toBeDefined();

      const foreignKeys = childTable?.foreignKeys || [];
      expect(foreignKeys.length).toBeGreaterThan(0);
      const fk = foreignKeys.find(
        (fk: any) =>
          fk.columnNames.includes("parentId") &&
          fk.referencedTableName === "test_fk_with_actions"
      );
      expect(fk).toBeDefined();
      expect(fk?.onDelete).toBe("CASCADE");
      expect(fk?.onUpdate).toBe("RESTRICT");
    });
  });
});
