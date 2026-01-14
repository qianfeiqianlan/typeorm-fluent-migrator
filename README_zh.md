<div align="center">
  <img src="logo.png" alt="typeorm-fluent-migrator logo" width="200">
  
  # typeorm-fluent-migrator
  
  ### The most elegant way to write migrations for TypeORM
  
  > 一个流畅、类型安全的 TypeORM 迁移封装库，消除样板代码，让数据库迁移像英文句子一样易读。
  
  [![Build Status](https://img.shields.io/github/actions/workflow/status/qianfeiqianlan/typeorm-fluent-migrator/ci.yml)](https://github.com/qianfeiqianlan/typeorm-fluent-migrator/actions)
  [![Coverage](https://img.shields.io/codecov/c/github/qianfeiqianlan/typeorm-fluent-migrator)](https://codecov.io/gh/qianfeiqianlan/typeorm-fluent-migrator)
  [![NPM Version](https://img.shields.io/npm/v/typeorm-fluent-migrator.svg)](https://www.npmjs.com/package/typeorm-fluent-migrator)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

## ✨ 特性

- 🎯 **流畅 API** - 使用链式方法编写像自然语言一样的迁移
- 🔒 **类型安全** - 完整的 TypeScript 支持，提供 IntelliSense 自动补全
- 🚀 **更少样板代码** - 相比原生 TypeORM 减少 50-70% 的代码量
- 🗄️ **数据库无关** - 编写一次，可在 PostgreSQL、MySQL、SQLite 等数据库上运行
- 🔄 **修改表支持** - 轻松添加、删除和修改列
- 🎨 **简洁语法** - 可读、可维护、自文档化的代码

## 📦 安装

```bash
npm install typeorm-fluent-migrator
```

**注意：** 本库需要 `typeorm` 作为对等依赖：

```bash
npm install typeorm
```

## 🚀 快速开始

### 创建表

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

### 修改表

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

### 外键

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

## 📚 API 参考

### 列类型

- `.int` - 整数类型
- `.bigint` - 大整数类型
- `.varchar(length?)` - 可变长度字符串
- `.text` - 文本类型
- `.boolean` - 布尔类型
- `.datetime` - 日期时间类型
- `.date` - 日期类型
- `.decimal(precision?, scale?)` - 小数类型

### 列约束

- `.primary` - 主键约束
- `.autoIncrement` - 自增
- `.nullable` - 允许 NULL 值
- `.notNull` - 不允许 NULL 值
- `.unique` - 唯一约束
- `.default(value)` - 默认值

### 外键

- `.references(table, column)` - 引用另一个表
- `.onDelete(action)` - 删除时的操作（CASCADE, SET NULL, RESTRICT, NO ACTION）
- `.onUpdate(action)` - 更新时的操作（CASCADE, SET NULL, RESTRICT, NO ACTION）

### 表操作

- `FL.use(queryRunner).create.table(name)` - 创建新表
- `FL.use(queryRunner).alter.table(name)` - 修改现有表
- `FL.use(queryRunner).drop.table(name)` - 删除表

### 修改表操作

- `.addColumn(name)` - 添加新列
- `.dropColumn(name)` - 删除列
- `.alterColumn(name)` - 修改现有列

## 🎯 对比

| 维度 | 原生 TypeORM | typeorm-fluent-migrator |
|------|-------------|------------------------|
| **代码量** | 冗长，需手动 `new Table()` | 精简，减少 50-70% |
| **可读性** | 嵌套深，属性分散 | 线性，像读英文句子 |
| **类型安全** | 可能运行时错误 | 编译期检查 |
| **IDE 支持** | 有限的自动补全 | 完整的 IntelliSense |
| **可维护性** | 高认知负担 | 低，结构清晰 |

### 示例对比

**原生 TypeORM:**
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

## 🗺️ 路线图

### ✅ 已完成 (v0.2.0)

- ✅ 核心流畅 API `FL.use(queryRunner)`
- ✅ `create.table()` 支持所有列类型
- ✅ `alter.table()` 支持 `addColumn`、`dropColumn`、`alterColumn`
- ✅ 外键支持 `references()`、`onDelete()`、`onUpdate()`
- ✅ 完整的 TypeScript 类型安全
- ✅ SQLite 兼容性，自动类型转换

### 🚧 即将推出

- 🔲 **索引支持** - 快速创建索引：`.index('idx_name')`
- 🔲 **重命名列** - `.renameColumn('old', 'new')`
- 🔲 **自动 Down 逻辑** - 根据 `up()` 操作自动生成 `down()` 方法
- 🔲 **枚举支持** - 为支持枚举的数据库提供原生支持
- 🔲 **迁移 CLI** - 独立的 CLI 工具用于运行迁移
- 🔲 **迁移生成器** - 使用模板快速生成新迁移

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

### 开发

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 构建
npm run build

# 拼写检查
npm run spellcheck
```

## 📄 许可证

MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 链接

- [GitHub 仓库](https://github.com/qianfeiqianlan/typeorm-fluent-migrator)
- [问题追踪](https://github.com/qianfeiqianlan/typeorm-fluent-migrator/issues)
- [npm 包](https://www.npmjs.com/package/typeorm-fluent-migrator)

## 🙏 致谢

灵感来源于 .NET 的 FluentMigrator，旨在为 TypeORM 迁移带来相同的开发体验。
