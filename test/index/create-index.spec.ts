import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { DataSource } from "typeorm";
import { FL } from "../../src";

describe("FL - Create Index", () => {
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

  it("should create a simple index on a table", async () => {
    await FL.use(queryRunner)
      .create.table("users")
      .column("id").int.primary.autoIncrement
      .column("name").varchar(255).notNull
      .column("email").varchar(255).notNull
      .execute();

    await FL.use(queryRunner)
      .create.index("idx_users_email")
      .on("users")
      .column("email")
      .execute();

    const tables = await queryRunner.getTables();
    const usersTable = tables.find((t: any) => t.name === "users");
    expect(usersTable).toBeDefined();

    const table = await queryRunner.getTable("users");
    const indices = table?.indices || [];
    const emailIndex = indices.find((idx: any) => idx.name === "idx_users_email");
    expect(emailIndex).toBeDefined();
    expect(emailIndex?.columnNames).toEqual(["email"]);
    expect(emailIndex?.isUnique).toBe(false);
  });

  it("should create a unique index", async () => {
    await FL.use(queryRunner)
      .create.table("products")
      .column("id").int.primary.autoIncrement
      .column("sku").varchar(100).notNull
      .execute();

    await FL.use(queryRunner)
      .create.index("idx_products_sku")
      .on("products")
      .column("sku")
      .unique
      .execute();

    const table = await queryRunner.getTable("products");
    const indices = table?.indices || [];
    const skuIndex = indices.find((idx: any) => idx.name === "idx_products_sku");
    expect(skuIndex).toBeDefined();
    expect(skuIndex?.isUnique).toBe(true);
  });

  it("should create a composite index with multiple columns", async () => {
    await FL.use(queryRunner)
      .create.table("orders")
      .column("id").int.primary.autoIncrement
      .column("userId").int.notNull
      .column("status").varchar(50).notNull
      .column("createdAt").datetime.notNull
      .execute();

    await FL.use(queryRunner)
      .create.index("idx_orders_user_status")
      .on("orders")
      .column("userId")
      .column("status")
      .execute();

    const table = await queryRunner.getTable("orders");
    const indices = table?.indices || [];
    const compositeIndex = indices.find((idx: any) => idx.name === "idx_orders_user_status");
    expect(compositeIndex).toBeDefined();
    expect(compositeIndex?.columnNames).toEqual(["userId", "status"]);
  });

  it("should create a composite index using columns() method", async () => {
    await FL.use(queryRunner)
      .create.table("posts")
      .column("id").int.primary.autoIncrement
      .column("authorId").int.notNull
      .column("categoryId").int.notNull
      .column("publishedAt").datetime.nullable
      .execute();

    await FL.use(queryRunner)
      .create.index("idx_posts_author_category")
      .on("posts")
      .columns("authorId", "categoryId")
      .execute();

    const table = await queryRunner.getTable("posts");
    const indices = table?.indices || [];
    const compositeIndex = indices.find((idx: any) => idx.name === "idx_posts_author_category");
    expect(compositeIndex).toBeDefined();
    expect(compositeIndex?.columnNames).toEqual(["authorId", "categoryId"]);
  });

  it("should throw error if table name is not specified", async () => {
    await expect(
      FL.use(queryRunner)
        .create.index("idx_test")
        .column("test")
        .execute()
    ).rejects.toThrow("Table name is required");
  });

  it("should throw error if no columns are specified", async () => {
    await FL.use(queryRunner)
      .create.table("test_table")
      .column("id").int.primary.autoIncrement
      .execute();

    await expect(
      FL.use(queryRunner)
        .create.index("idx_test")
        .on("test_table")
        .execute()
    ).rejects.toThrow("At least one column is required");
  });
});

describe("FL - Drop Index", () => {
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

  it("should drop an index from a table", async () => {
    await FL.use(queryRunner)
      .create.table("users")
      .column("id").int.primary.autoIncrement
      .column("email").varchar(255).notNull
      .execute();

    await FL.use(queryRunner)
      .create.index("idx_users_email")
      .on("users")
      .column("email")
      .execute();

    let table = await queryRunner.getTable("users");
    let indices = table?.indices || [];
    expect(indices.find((idx: any) => idx.name === "idx_users_email")).toBeDefined();

    await FL.use(queryRunner).drop.index("users", "idx_users_email");

    table = await queryRunner.getTable("users");
    indices = table?.indices || [];
    expect(indices.find((idx: any) => idx.name === "idx_users_email")).toBeUndefined();
  });

  it("should handle dropping non-existent index gracefully", async () => {
    await FL.use(queryRunner)
      .create.table("products")
      .column("id").int.primary.autoIncrement
      .column("name").varchar(255).notNull
      .execute();

    await expect(
      FL.use(queryRunner).drop.index("products", "idx_nonexistent")
    ).rejects.toThrow();
  });
});
