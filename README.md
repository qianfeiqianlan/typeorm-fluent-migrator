<div align="center">
  <img src="logo.png" alt="typeorm-fluent-migrator logo" width="200">
  
  # typeorm-fluent-migrator
  
  ### The most elegant way to write migrations for TypeORM
  
  > A fluent, type-safe migration wrapper that eliminates boilerplate code and makes database migrations as readable as English sentences.
  
  [![Build Status](https://img.shields.io/github/actions/workflow/status/qianfeiqianlan/typeorm-fluent-migrator/ci.yml)](https://github.com/qianfeiqianlan/typeorm-fluent-migrator/actions)
  [![codecov](https://codecov.io/github/qianfeiqianlan/typeorm-fluent-migrator/graph/badge.svg?token=WD0IUH9NDP)](https://codecov.io/github/qianfeiqianlan/typeorm-fluent-migrator)
  [![NPM Version](https://img.shields.io/npm/v/typeorm-fluent-migrator.svg)](https://www.npmjs.com/package/typeorm-fluent-migrator)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

## ✨ Features

- 🎯 **Fluent API** - Write migrations like natural language with chainable methods
- 🔒 **Type-Safe** - Full TypeScript support with IntelliSense autocomplete
- 🚀 **Less Boilerplate** - Reduce migration code by 50-70% compared to native TypeORM
- 🗄️ **Database Agnostic** - Write once, run on PostgreSQL, MySQL, SQLite, and more
- 🔄 **Alter Table Support** - Add, drop, and modify columns with ease
- 🎨 **Clean Syntax** - Readable, maintainable, and self-documenting code

## 📦 Installation

```bash
npm install typeorm-fluent-migrator
```

**Note:** This library requires `typeorm` as a peer dependency:

```bash
npm install typeorm
```

## 🚀 Quick Start

### Create a Table

```typescript
import { MigrationInterface, QueryRunner } from "typeorm";
import { FL } from "typeorm-fluent-migrator";

export class CreateUsersTable1623456789000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await FL.use(queryRunner)
      .create.table("users")
      .column("id").int.primary.autoIncrement
      .column("name").varchar(255).notNull
      .column("email").varchar(255).unique.notNull
      .column("age").int.nullable
      .execute();
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await FL.use(queryRunner).drop.table("users");
  }
}
```

### Alter a Table

```typescript
export class AddPhoneColumn1623456790000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await FL.use(queryRunner)
      .alter.table("users")
      .addColumn("phone").varchar(20).nullable
      .dropColumn("oldStatus")
      .alterColumn("name").varchar(100).notNull
      .execute();
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await FL.use(queryRunner)
      .alter.table("users")
      .dropColumn("phone")
      .addColumn("oldStatus").varchar(50).nullable
      .alterColumn("name").varchar(255).notNull
      .execute();
  }
}
```

### Foreign Keys

```typescript
export class CreatePostsTable1623456791000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await FL.use(queryRunner)
      .create.table("posts")
      .column("id").int.primary.autoIncrement
      .column("title").varchar(100).notNull
      .column("content").text.nullable
      .column("authorId").int.notNull
        .references("users", "id")
        .onDelete("CASCADE")
        .onUpdate("RESTRICT")
      .execute();
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await FL.use(queryRunner).drop.table("posts");
  }
}
```

## 📚 API Reference

### Column Types

- `.int` - Integer type
- `.bigint` - Big integer type
- `.varchar(length?)` - Variable character string
- `.text` - Text type
- `.boolean` - Boolean type
- `.datetime` - DateTime type
- `.date` - Date type
- `.decimal(precision?, scale?)` - Decimal type

### Column Constraints

- `.primary` - Primary key constraint
- `.autoIncrement` - Auto increment
- `.nullable` - Allow NULL values
- `.notNull` - Disallow NULL values
- `.unique` - Unique constraint
- `.default(value)` - Default value

### Foreign Keys

- `.references(table, column)` - Reference another table
- `.onDelete(action)` - On delete action (CASCADE, SET NULL, RESTRICT, NO ACTION)
- `.onUpdate(action)` - On update action (CASCADE, SET NULL, RESTRICT, NO ACTION)

### Table Operations

- `FL.use(queryRunner).create.table(name)` - Create a new table
- `FL.use(queryRunner).alter.table(name)` - Alter an existing table
- `FL.use(queryRunner).drop.table(name)` - Drop a table

### Alter Table Operations

- `.addColumn(name)` - Add a new column
- `.dropColumn(name)` - Drop a column
- `.alterColumn(name)` - Modify an existing column

## 🎯 Comparison

| Aspect | Native TypeORM | typeorm-fluent-migrator |
|--------|----------------|------------------------|
| **Code Length** | Verbose, manual `new Table()` | Concise, 50-70% reduction |
| **Readability** | Deep nesting, scattered properties | Linear, reads like English |
| **Type Safety** | Runtime errors possible | Compile-time checks |
| **IDE Support** | Limited autocomplete | Full IntelliSense |
| **Maintainability** | High cognitive load | Low, structured clearly |

### Example Comparison

**Native TypeORM:**
```typescript
await queryRunner.createTable(
  new Table({
    name: "users",
    columns: [
      {
        name: "id",
        type: "int",
        isPrimary: true,
        isGenerated: true,
        generationStrategy: "increment",
      },
      {
        name: "name",
        type: "varchar",
        length: "255",
        isNullable: false,
      },
    ],
  }),
  true
);
```

**typeorm-fluent-migrator:**
```typescript
await FL.use(queryRunner)
  .create.table("users")
  .column("id").int.primary.autoIncrement
  .column("name").varchar(255).notNull
  .execute();
```

## 🗺️ Roadmap

### ✅ Completed (v0.2.0)

- ✅ Core fluent API with `FL.use(queryRunner)`
- ✅ `create.table()` with all column types
- ✅ `alter.table()` with `addColumn`, `dropColumn`, `alterColumn`
- ✅ Foreign key support with `references()`, `onDelete()`, `onUpdate()`
- ✅ Full TypeScript type safety
- ✅ SQLite compatibility with automatic type conversion

### 🚧 Coming Soon

- 🔲 **Index Support** - Quick index creation: `.index('idx_name')`
- 🔲 **Rename Column** - `.renameColumn('old', 'new')`
- 🔲 **Auto Down Logic** - Automatic generation of `down()` from `up()` operations
- 🔲 **Enum Support** - Native enum support for databases that support it
- 🔲 **Migration CLI** - Standalone CLI tool for running migrations
- 🔲 **Migration Generator** - Scaffold new migrations with templates

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build
npm run build

# Spell check
npm run spellcheck
```

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/qianfeiqianlan/typeorm-fluent-migrator)
- [Issue Tracker](https://github.com/qianfeiqianlan/typeorm-fluent-migrator/issues)
- [npm Package](https://www.npmjs.com/package/typeorm-fluent-migrator)

## 🙏 Acknowledgments

Inspired by .NET's FluentMigrator and designed to bring the same developer experience to TypeORM migrations.
