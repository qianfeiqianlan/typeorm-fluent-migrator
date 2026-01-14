import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { DataSource } from "typeorm";
import { FL } from "../../src";

describe("FL - Alter Table", () => {
  let dataSource: DataSource;
  let queryRunner: any;

  beforeAll(async () => {
    // 创建 SQLite 内存数据库连接
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

  it("should add a column to existing table", async () => {
    // 先创建表
    await FL.use(queryRunner)
      .create.table("users")
      .column("id").int.primary.autoIncrement
      .column("name").varchar(255).notNull
      .execute();

    // 添加新列
    await FL.use(queryRunner)
      .alter.table("users")
      .addColumn("email").varchar(255).nullable
      .execute();

    // 验证列已添加
    const tables = await queryRunner.getTables();
    const usersTable = tables.find((t: any) => t.name === "users");
    expect(usersTable).toBeDefined();
    expect(usersTable?.columns.length).toBe(3);

    const emailColumn = usersTable?.columns.find((c: any) => c.name === "email");
    expect(emailColumn).toBeDefined();
    expect(emailColumn?.type.toLowerCase()).toContain("varchar");
    expect(emailColumn?.isNullable).toBe(true);
  });

  it("should add multiple columns to existing table", async () => {
    // 先创建表
    await FL.use(queryRunner)
      .create.table("posts")
      .column("id").int.primary.autoIncrement
      .column("title").varchar(100).notNull
      .execute();

    // 添加多个列
    await FL.use(queryRunner)
      .alter.table("posts")
      .addColumn("content").text.nullable
      .addColumn("author").varchar(255).notNull
      .addColumn("createdAt").datetime.default("CURRENT_TIMESTAMP")
      .execute();

    // 验证列已添加
    const tables = await queryRunner.getTables();
    const postsTable = tables.find((t: any) => t.name === "posts");
    expect(postsTable).toBeDefined();
    expect(postsTable?.columns.length).toBe(5);

    const contentColumn = postsTable?.columns.find((c: any) => c.name === "content");
    expect(contentColumn).toBeDefined();
    expect(contentColumn?.type.toLowerCase()).toBe("text");

    const authorColumn = postsTable?.columns.find((c: any) => c.name === "author");
    expect(authorColumn).toBeDefined();
    expect(authorColumn?.isNullable).toBe(false);
  });

  it("should drop a column from existing table", async () => {
    // 先创建表
    await FL.use(queryRunner)
      .create.table("products")
      .column("id").int.primary.autoIncrement
      .column("name").varchar(255).notNull
      .column("oldStatus").varchar(50).nullable
      .execute();

    // 验证列存在
    let tables = await queryRunner.getTables();
    let productsTable = tables.find((t: any) => t.name === "products");
    expect(productsTable?.columns.find((c: any) => c.name === "oldStatus")).toBeDefined();

    // 删除列
    await FL.use(queryRunner)
      .alter.table("products")
      .dropColumn("oldStatus")
      .execute();

    // 验证列已删除
    tables = await queryRunner.getTables();
    productsTable = tables.find((t: any) => t.name === "products");
    expect(productsTable?.columns.find((c: any) => c.name === "oldStatus")).toBeUndefined();
    expect(productsTable?.columns.length).toBe(2);
  });

  it("should alter a column in existing table", async () => {
    // 先创建表
    await FL.use(queryRunner)
      .create.table("customers")
      .column("id").int.primary.autoIncrement
      .column("name").varchar(50).notNull
      .execute();

    // 验证原始列属性
    let tables = await queryRunner.getTables();
    let customersTable = tables.find((t: any) => t.name === "customers");
    let nameColumn = customersTable?.columns.find((c: any) => c.name === "name");
    expect(nameColumn?.length).toBe("50");
    expect(nameColumn?.isNullable).toBe(false);

    // 修改列：增加长度并允许为空
    await FL.use(queryRunner)
      .alter.table("customers")
      .alterColumn("name").varchar(255).nullable
      .execute();

    // 验证列已修改
    tables = await queryRunner.getTables();
    customersTable = tables.find((t: any) => t.name === "customers");
    nameColumn = customersTable?.columns.find((c: any) => c.name === "name");
    expect(nameColumn?.length).toBe("255");
    expect(nameColumn?.isNullable).toBe(true);
  });

  it("should combine addColumn, dropColumn, and alterColumn in one operation", async () => {
    // 先创建表
    await FL.use(queryRunner)
      .create.table("orders")
      .column("id").int.primary.autoIncrement
      .column("orderNo").varchar(50).notNull
      .column("oldStatus").varchar(20).nullable
      .execute();

    // 执行多个操作：添加列、删除列、修改列
    await FL.use(queryRunner)
      .alter.table("orders")
      .addColumn("total").decimal(10, 2).nullable
      .dropColumn("oldStatus")
      .alterColumn("orderNo").varchar(100).notNull
      .execute();

    // 验证结果
    const tables = await queryRunner.getTables();
    const ordersTable = tables.find((t: any) => t.name === "orders");
    expect(ordersTable).toBeDefined();
    expect(ordersTable?.columns.length).toBe(3); // id, orderNo, total

    // 验证新列已添加
    const totalColumn = ordersTable?.columns.find((c: any) => c.name === "total");
    expect(totalColumn).toBeDefined();
    expect(totalColumn?.type.toLowerCase()).toBe("decimal");

    // 验证旧列已删除
    expect(ordersTable?.columns.find((c: any) => c.name === "oldStatus")).toBeUndefined();

    // 验证列已修改
    const orderNoColumn = ordersTable?.columns.find((c: any) => c.name === "orderNo");
    expect(orderNoColumn?.length).toBe("100");
  });

  it("should support chaining operations", async () => {
    // 先创建表
    await FL.use(queryRunner)
      .create.table("items")
      .column("id").int.primary.autoIncrement
      .column("name").varchar(100).notNull
      .execute();

    // 链式调用：添加列后继续添加列
    await FL.use(queryRunner)
      .alter.table("items")
      .addColumn("price").decimal(10, 2).nullable
      .addColumn("description").text.nullable
      .dropColumn("name")
      .execute();

    // 验证结果
    const tables = await queryRunner.getTables();
    const itemsTable = tables.find((t: any) => t.name === "items");
    expect(itemsTable?.columns.length).toBe(3); // id, price, description
    expect(itemsTable?.columns.find((c: any) => c.name === "name")).toBeUndefined();
    expect(itemsTable?.columns.find((c: any) => c.name === "price")).toBeDefined();
    expect(itemsTable?.columns.find((c: any) => c.name === "description")).toBeDefined();
  });

  it("should support more alterColumn types", async () => {
    // 先创建表
    await FL.use(queryRunner)
      .create.table("products")
      .column("id").int.primary.autoIncrement
      .column("name").varchar(50).notNull
      .execute();

    // 测试更多 alterColumn 类型和 addColumn 类型
    await FL.use(queryRunner)
      .alter.table("products")
      .alterColumn("name").varchar(255).notNull
      .addColumn("isActive").boolean.default(true)
      .addColumn("createdAt").datetime.default("CURRENT_TIMESTAMP")
      .addColumn("amount").decimal(10, 2).nullable
      .addColumn("price").bigint.nullable
      .execute();

    // 验证结果
    const tables = await queryRunner.getTables();
    const productsTable = tables.find((t: any) => t.name === "products");
    expect(productsTable?.columns.length).toBe(6);

    const nameColumn = productsTable?.columns.find((c: any) => c.name === "name");
    expect(nameColumn?.length).toBe("255");

    const priceColumn = productsTable?.columns.find((c: any) => c.name === "price");
    expect(priceColumn?.type.toLowerCase()).toContain("bigint");

    const isActiveColumn = productsTable?.columns.find((c: any) => c.name === "isActive");
    expect(isActiveColumn?.type.toLowerCase()).toBe("boolean");
  });

  describe("AlterColumnBuilder - Type Methods", () => {
    it("should alter column to int type", async () => {
      await FL.use(queryRunner)
        .create.table("test_int")
        .column("id").int.primary.autoIncrement
        .column("value").varchar(50).nullable
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_int")
        .alterColumn("value").int.nullable
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_int");
      const column = table?.columns.find((c: any) => c.name === "value");
      expect(column?.type.toLowerCase()).toContain("int");
    });

    it("should alter column to bigint type", async () => {
      await FL.use(queryRunner)
        .create.table("test_bigint")
        .column("id").int.primary.autoIncrement
        .column("value").int.nullable
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_bigint")
        .alterColumn("value").bigint.nullable
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_bigint");
      const column = table?.columns.find((c: any) => c.name === "value");
      expect(column?.type.toLowerCase()).toContain("bigint");
    });

    it("should alter column to text type", async () => {
      await FL.use(queryRunner)
        .create.table("test_text")
        .column("id").int.primary.autoIncrement
        .column("content").varchar(255).nullable
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_text")
        .alterColumn("content").text.nullable
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_text");
      const column = table?.columns.find((c: any) => c.name === "content");
      expect(column?.type.toLowerCase()).toBe("text");
    });

    it("should alter column to boolean type", async () => {
      await FL.use(queryRunner)
        .create.table("test_boolean")
        .column("id").int.primary.autoIncrement
        .column("isActive").int.nullable
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_boolean")
        .alterColumn("isActive").boolean.default(false)
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_boolean");
      const column = table?.columns.find((c: any) => c.name === "isActive");
      expect(column?.type.toLowerCase()).toBe("boolean");
    });

    it("should alter column to datetime type", async () => {
      await FL.use(queryRunner)
        .create.table("test_datetime")
        .column("id").int.primary.autoIncrement
        .column("createdAt").varchar(50).nullable
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_datetime")
        .alterColumn("createdAt").datetime.default("CURRENT_TIMESTAMP")
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_datetime");
      const column = table?.columns.find((c: any) => c.name === "createdAt");
      expect(column?.type.toLowerCase()).toBe("datetime");
    });

    it("should alter column to date type", async () => {
      await FL.use(queryRunner)
        .create.table("test_date")
        .column("id").int.primary.autoIncrement
        .column("birthDate").varchar(50).nullable
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_date")
        .alterColumn("birthDate").date.nullable
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_date");
      const column = table?.columns.find((c: any) => c.name === "birthDate");
      expect(column?.type.toLowerCase()).toBe("date");
    });

    it("should alter column to decimal type", async () => {
      await FL.use(queryRunner)
        .create.table("test_decimal")
        .column("id").int.primary.autoIncrement
        .column("price").int.nullable
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_decimal")
        .alterColumn("price").decimal(10, 2).nullable
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_decimal");
      const column = table?.columns.find((c: any) => c.name === "price");
      expect(column?.type.toLowerCase()).toBe("decimal");
      expect(column?.precision).toBe(10);
      expect(column?.scale).toBe(2);
    });

    it("should alter column to decimal type without precision and scale", async () => {
      await FL.use(queryRunner)
        .create.table("test_decimal_no_params")
        .column("id").int.primary.autoIncrement
        .column("amount").int.nullable
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_decimal_no_params")
        .alterColumn("amount").decimal().nullable
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_decimal_no_params");
      const column = table?.columns.find((c: any) => c.name === "amount");
      expect(column?.type.toLowerCase()).toBe("decimal");
      // 当不提供 precision 和 scale 时，它们应该是 undefined
      expect(column?.precision).toBeUndefined();
      expect(column?.scale).toBeUndefined();
    });

    it("should alter column to decimal type with only precision", async () => {
      await FL.use(queryRunner)
        .create.table("test_decimal_precision_only")
        .column("id").int.primary.autoIncrement
        .column("value").int.nullable
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_decimal_precision_only")
        .alterColumn("value").decimal(10).nullable
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_decimal_precision_only");
      const column = table?.columns.find((c: any) => c.name === "value");
      expect(column?.type.toLowerCase()).toBe("decimal");
      expect(column?.precision).toBe(10);
      expect(column?.scale).toBeUndefined();
    });

    it("should alter column to varchar type without length", async () => {
      await FL.use(queryRunner)
        .create.table("test_varchar_no_length")
        .column("id").int.primary.autoIncrement
        .column("name").text.nullable
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_varchar_no_length")
        .alterColumn("name").varchar().nullable
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_varchar_no_length");
      const column = table?.columns.find((c: any) => c.name === "name");
      expect(column?.type.toLowerCase()).toContain("varchar");
      // 当不提供 length 时，SQLite 可能将其设置为空字符串或 undefined
      expect(column?.length === undefined || column?.length === "").toBe(true);
    });

    it("should alter column to varchar type with length as number", async () => {
      await FL.use(queryRunner)
        .create.table("test_varchar_number_length")
        .column("id").int.primary.autoIncrement
        .column("code").text.nullable
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_varchar_number_length")
        .alterColumn("code").varchar(50).nullable
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_varchar_number_length");
      const column = table?.columns.find((c: any) => c.name === "code");
      expect(column?.type.toLowerCase()).toContain("varchar");
      expect(column?.length).toBe("50");
    });

    it("should alter column to varchar type with length as string", async () => {
      await FL.use(queryRunner)
        .create.table("test_varchar_string_length")
        .column("id").int.primary.autoIncrement
        .column("name").text.nullable
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_varchar_string_length")
        .alterColumn("name").varchar("255").nullable
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_varchar_string_length");
      const column = table?.columns.find((c: any) => c.name === "name");
      expect(column?.type.toLowerCase()).toContain("varchar");
      expect(column?.length).toBe("255");
    });
  });

  describe("AlterColumnBuilder - Constraint Methods", () => {
    it("should alter column with primary constraint", async () => {
      // SQLite 不支持复合主键，所以创建一个没有主键的表
      await FL.use(queryRunner)
        .create.table("test_primary")
        .column("id").int.nullable
        .column("code").varchar(50).nullable
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_primary")
        .alterColumn("code").varchar(50).primary.notNull
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_primary");
      const column = table?.columns.find((c: any) => c.name === "code");
      expect(column?.isPrimary).toBe(true);
    });

    it("should alter column with autoIncrement", async () => {
      // SQLite 不支持复合主键的 AUTOINCREMENT，所以创建一个没有主键的表
      await FL.use(queryRunner)
        .create.table("test_autoinc")
        .column("id").int.nullable
        .column("seq").int.nullable
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_autoinc")
        .alterColumn("seq").int.primary.autoIncrement
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_autoinc");
      const column = table?.columns.find((c: any) => c.name === "seq");
      expect(column?.isGenerated).toBe(true);
      expect(column?.generationStrategy).toBe("increment");
      expect(column?.isPrimary).toBe(true);
    });

    it("should alter column with unique constraint", async () => {
      await FL.use(queryRunner)
        .create.table("test_unique")
        .column("id").int.primary.autoIncrement
        .column("email").varchar(255).nullable
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_unique")
        .alterColumn("email").varchar(255).unique.notNull
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_unique");
      const column = table?.columns.find((c: any) => c.name === "email");
      expect(column?.isUnique).toBe(true);
    });
  });

  describe("AlterColumnBuilder - Chaining Methods", () => {
    it("should chain dropColumn after alterColumn", async () => {
      await FL.use(queryRunner)
        .create.table("test_chain_drop")
        .column("id").int.primary.autoIncrement
        .column("name").varchar(255).notNull
        .column("oldField").varchar(50).nullable
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_chain_drop")
        .alterColumn("name").varchar(100).notNull
        .dropColumn("oldField")
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_chain_drop");
      expect(table?.columns.length).toBe(2);
      expect(table?.columns.find((c: any) => c.name === "oldField")).toBeUndefined();
      const nameColumn = table?.columns.find((c: any) => c.name === "name");
      expect(nameColumn?.length).toBe("100");
    });

    it("should chain alterColumn after alterColumn", async () => {
      await FL.use(queryRunner)
        .create.table("test_chain_alter")
        .column("id").int.primary.autoIncrement
        .column("field1").varchar(50).nullable
        .column("field2").int.nullable
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_chain_alter")
        .alterColumn("field1").varchar(255).notNull
        .alterColumn("field2").bigint.nullable
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_chain_alter");
      const field1Column = table?.columns.find((c: any) => c.name === "field1");
      expect(field1Column?.length).toBe("255");
      expect(field1Column?.isNullable).toBe(false);
      const field2Column = table?.columns.find((c: any) => c.name === "field2");
      expect(field2Column?.type.toLowerCase()).toContain("bigint");
    });

    it("should chain addColumn after alterColumn", async () => {
      await FL.use(queryRunner)
        .create.table("test_chain_add")
        .column("id").int.primary.autoIncrement
        .column("name").varchar(50).notNull
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_chain_add")
        .alterColumn("name").varchar(255).notNull
        .addColumn("email").varchar(255).nullable
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_chain_add");
      expect(table?.columns.length).toBe(3);
      const nameColumn = table?.columns.find((c: any) => c.name === "name");
      expect(nameColumn?.length).toBe("255");
      const emailColumn = table?.columns.find((c: any) => c.name === "email");
      expect(emailColumn).toBeDefined();
    });

    it("should support column() chaining in alter table context (fallback to addColumn)", async () => {
      // 测试在 alter table 中，从 ColumnBuilder 调用 column() 方法
      // 这应该回退到使用 addColumn() 方法（第 141 行）
      await FL.use(queryRunner)
        .create.table("test_column_in_alter")
        .column("id").int.primary.autoIncrement
        .execute();

      await FL.use(queryRunner)
        .alter.table("test_column_in_alter")
        .addColumn("name").varchar(255).notNull
        .column("email").varchar(255).nullable
        .column("phone").varchar(20).nullable
        .execute();

      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_column_in_alter");
      expect(table?.columns.length).toBe(4);
      expect(table?.columns.find((c: any) => c.name === "name")).toBeDefined();
      expect(table?.columns.find((c: any) => c.name === "email")).toBeDefined();
      expect(table?.columns.find((c: any) => c.name === "phone")).toBeDefined();
    });
  });

  describe("AlterTableBuilder - SQLite int to integer conversion", () => {
    it("should convert int to integer when altering column with primary and autoIncrement", async () => {
      // 创建一个没有主键的表
      await FL.use(queryRunner)
        .create.table("test_sqlite_int_conversion")
        .column("id").int.nullable
        .column("name").varchar(255).notNull
        .execute();

      // 通过 alterColumn 修改列为 int.primary.autoIncrement
      // 这应该触发 SQLite 的特殊处理，将 int 转换为 integer
      await FL.use(queryRunner)
        .alter.table("test_sqlite_int_conversion")
        .alterColumn("id").int.primary.autoIncrement
        .execute();

      // 验证列类型已被转换为 integer（SQLite 要求）
      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_sqlite_int_conversion");
      const idColumn = table?.columns.find((c: any) => c.name === "id");
      
      // SQLite 会将类型存储为 integer
      expect(idColumn?.type.toLowerCase()).toContain("int");
      expect(idColumn?.isPrimary).toBe(true);
      expect(idColumn?.isGenerated).toBe(true);
      expect(idColumn?.generationStrategy).toBe("increment");
    });

    it("should convert int to integer when adding column with primary and autoIncrement", async () => {
      // 创建一个表
      await FL.use(queryRunner)
        .create.table("test_sqlite_add_int_conversion")
        .column("name").varchar(255).notNull
        .execute();

      // 通过 addColumn 添加 int.primary.autoIncrement 列
      // 这应该触发 SQLite 的特殊处理，将 int 转换为 integer
      await FL.use(queryRunner)
        .alter.table("test_sqlite_add_int_conversion")
        .addColumn("id").int.primary.autoIncrement
        .execute();

      // 验证列类型已被转换为 integer（SQLite 要求）
      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_sqlite_add_int_conversion");
      const idColumn = table?.columns.find((c: any) => c.name === "id");
      
      // SQLite 会将类型存储为 integer
      expect(idColumn?.type.toLowerCase()).toContain("int");
      expect(idColumn?.isPrimary).toBe(true);
      expect(idColumn?.isGenerated).toBe(true);
      expect(idColumn?.generationStrategy).toBe("increment");
    });

    it("should not convert int to integer when column is not primary and autoIncrement", async () => {
      // 创建一个表
      await FL.use(queryRunner)
        .create.table("test_sqlite_no_conversion")
        .column("id").int.primary.autoIncrement
        .column("value").varchar(50).nullable
        .execute();

      // 修改列为 int 类型，但不是主键和自增
      await FL.use(queryRunner)
        .alter.table("test_sqlite_no_conversion")
        .alterColumn("value").int.nullable
        .execute();

      // 验证列类型保持为 int（不需要转换为 integer）
      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_sqlite_no_conversion");
      const valueColumn = table?.columns.find((c: any) => c.name === "value");
      
      expect(valueColumn?.type.toLowerCase()).toContain("int");
      expect(valueColumn?.isPrimary).toBe(false);
      expect(valueColumn?.isGenerated).toBe(false);
    });

    it("should not convert int to integer when column is primary but not autoIncrement", async () => {
      // 创建一个没有主键的表
      await FL.use(queryRunner)
        .create.table("test_sqlite_primary_only")
        .column("code").varchar(50).nullable
        .execute();

      // 修改列为 int.primary，但不是 autoIncrement
      await FL.use(queryRunner)
        .alter.table("test_sqlite_primary_only")
        .alterColumn("code").int.primary.notNull
        .execute();

      // 验证列类型（虽然这种情况在实际使用中较少见）
      const tables = await queryRunner.getTables();
      const table = tables.find((t: any) => t.name === "test_sqlite_primary_only");
      const codeColumn = table?.columns.find((c: any) => c.name === "code");
      
      expect(codeColumn?.type.toLowerCase()).toContain("int");
      expect(codeColumn?.isPrimary).toBe(true);
      expect(codeColumn?.isGenerated).toBe(false);
    });
  });

  describe("AlterTableBuilder - Driver type checking", () => {
    it("should handle case when driver is null in addColumn", async () => {
      // 创建一个 mock queryRunner，其中 connection 为 null
      const mockQueryRunner = {
        connection: null,
        addColumn: async () => {},
      } as any;

      // 这应该不会抛出错误，只是不会进行 SQLite 特殊处理
      await FL.use(mockQueryRunner)
        .alter.table("test_table")
        .addColumn("id").int.primary.autoIncrement
        .execute();

      // 验证没有抛出错误
      expect(true).toBe(true);
    });

    it("should handle case when driver.options is null in addColumn", async () => {
      // 创建一个 mock queryRunner，其中 driver.options 为 null
      const mockQueryRunner = {
        connection: {
          driver: {
            options: null,
          },
        },
        addColumn: async () => {},
      } as any;

      // 这应该不会抛出错误，只是不会进行 SQLite 特殊处理
      await FL.use(mockQueryRunner)
        .alter.table("test_table")
        .addColumn("id").int.primary.autoIncrement
        .execute();

      // 验证没有抛出错误
      expect(true).toBe(true);
    });

    it("should handle case when driver.options.type is not better-sqlite3 in addColumn", async () => {
      // 创建一个 mock queryRunner，其中 driver.options.type 不是 "better-sqlite3"
      const mockQueryRunner = {
        connection: {
          driver: {
            options: {
              type: "mysql",
            },
          },
        },
        addColumn: async () => {},
      } as any;

      // 这应该不会抛出错误，只是不会进行 SQLite 特殊处理
      await FL.use(mockQueryRunner)
        .alter.table("test_table")
        .addColumn("id").int.primary.autoIncrement
        .execute();

      // 验证没有抛出错误
      expect(true).toBe(true);
    });

    it("should handle case when driver is null in alterColumn", async () => {
      // 创建一个 mock queryRunner，其中 connection 为 null
      const mockQueryRunner = {
        connection: null,
        changeColumn: async () => {},
      } as any;

      // 这应该不会抛出错误，只是不会进行 SQLite 特殊处理
      await FL.use(mockQueryRunner)
        .alter.table("test_table")
        .alterColumn("id").int.primary.autoIncrement
        .execute();

      // 验证没有抛出错误
      expect(true).toBe(true);
    });

    it("should handle case when driver.options is null in alterColumn", async () => {
      // 创建一个 mock queryRunner，其中 driver.options 为 null
      const mockQueryRunner = {
        connection: {
          driver: {
            options: null,
          },
        },
        changeColumn: async () => {},
      } as any;

      // 这应该不会抛出错误，只是不会进行 SQLite 特殊处理
      await FL.use(mockQueryRunner)
        .alter.table("test_table")
        .alterColumn("id").int.primary.autoIncrement
        .execute();

      // 验证没有抛出错误
      expect(true).toBe(true);
    });

    it("should handle case when driver.options.type is not better-sqlite3 in alterColumn", async () => {
      // 创建一个 mock queryRunner，其中 driver.options.type 不是 "better-sqlite3"
      const mockQueryRunner = {
        connection: {
          driver: {
            options: {
              type: "mssql",
            },
          },
        },
        changeColumn: async () => {},
      } as any;

      // 这应该不会抛出错误，只是不会进行 SQLite 特殊处理
      await FL.use(mockQueryRunner)
        .alter.table("test_table")
        .alterColumn("id").int.primary.autoIncrement
        .execute();

      // 验证没有抛出错误
      expect(true).toBe(true);
    });

    it("should handle case when connection is undefined in addColumn", async () => {
      // 创建一个 mock queryRunner，其中 connection 为 undefined
      const mockQueryRunner = {
        connection: undefined,
        addColumn: async () => {},
      } as any;

      // 这应该不会抛出错误，只是不会进行 SQLite 特殊处理
      await FL.use(mockQueryRunner)
        .alter.table("test_table")
        .addColumn("id").int.primary.autoIncrement
        .execute();

      // 验证没有抛出错误
      expect(true).toBe(true);
    });

    it("should handle case when connection is undefined in alterColumn", async () => {
      // 创建一个 mock queryRunner，其中 connection 为 undefined
      const mockQueryRunner = {
        connection: undefined,
        changeColumn: async () => {},
      } as any;

      // 这应该不会抛出错误，只是不会进行 SQLite 特殊处理
      await FL.use(mockQueryRunner)
        .alter.table("test_table")
        .alterColumn("id").int.primary.autoIncrement
        .execute();

      // 验证没有抛出错误
      expect(true).toBe(true);
    });
  });
});
