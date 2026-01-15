/**
 * MySQL / Aurora MySQL 支持的数据类型
 */
export enum MysqlDataTypes {
    // numeric types
    BIT = 'bit',
    INT = 'int',
    INTEGER = 'integer',
    TINYINT = 'tinyint',
    SMALLINT = 'smallint',
    MEDIUMINT = 'mediumint',
    BIGINT = 'bigint',
    FLOAT = 'float',
    DOUBLE = 'double',
    DOUBLE_PRECISION = 'double precision',
    REAL = 'real',
    DECIMAL = 'decimal',
    DEC = 'dec',
    NUMERIC = 'numeric',
    FIXED = 'fixed',
    BOOL = 'bool',
    BOOLEAN = 'boolean',

    // date and time types
    DATE = 'date',
    DATETIME = 'datetime',
    TIMESTAMP = 'timestamp',
    TIME = 'time',
    YEAR = 'year',

    // string types
    CHAR = 'char',
    NCHAR = 'nchar',
    NATIONAL_CHAR = 'national char',
    VARCHAR = 'varchar',
    NVARCHAR = 'nvarchar',
    NATIONAL_VARCHAR = 'national varchar',
    BLOB = 'blob',
    TEXT = 'text',
    TINYBLOB = 'tinyblob',
    TINYTEXT = 'tinytext',
    MEDIUMBLOB = 'mediumblob',
    MEDIUMTEXT = 'mediumtext',
    LONGBLOB = 'longblob',
    LONGTEXT = 'longtext',
    ENUM = 'enum',
    SET = 'set',
    BINARY = 'binary',
    VARBINARY = 'varbinary',

    // json data type
    JSON = 'json',

    // spatial data types
    GEOMETRY = 'geometry',
    POINT = 'point',
    LINESTRING = 'linestring',
    POLYGON = 'polygon',
    MULTIPOINT = 'multipoint',
    MULTILINESTRING = 'multilinestring',
    MULTIPOLYGON = 'multipolygon',
    GEOMETRYCOLLECTION = 'geometrycollection',

    // vector data types
    VECTOR = 'vector',

    // additional data types for mariadb
    UUID = 'uuid',
    INET4 = 'inet4',
    INET6 = 'inet6',
}

/**
 * PostgreSQL / Aurora PostgreSQL 支持的数据类型
 */
export enum PostgresDataTypes {
    INT = 'int',
    INT2 = 'int2',
    INT4 = 'int4',
    INT8 = 'int8',
    SMALLINT = 'smallint',
    INTEGER = 'integer',
    BIGINT = 'bigint',
    DECIMAL = 'decimal',
    NUMERIC = 'numeric',
    REAL = 'real',
    FLOAT = 'float',
    FLOAT4 = 'float4',
    FLOAT8 = 'float8',
    DOUBLE_PRECISION = 'double precision',
    MONEY = 'money',
    CHARACTER_VARYING = 'character varying',
    VARCHAR = 'varchar',
    CHARACTER = 'character',
    CHAR = 'char',
    TEXT = 'text',
    CITEXT = 'citext',
    HSTORE = 'hstore',
    BYTEA = 'bytea',
    BIT = 'bit',
    VARBIT = 'varbit',
    BIT_VARYING = 'bit varying',
    TIMETZ = 'timetz',
    TIMESTAMPTZ = 'timestamptz',
    TIMESTAMP = 'timestamp',
    TIMESTAMP_WITHOUT_TIME_ZONE = 'timestamp without time zone',
    TIMESTAMP_WITH_TIME_ZONE = 'timestamp with time zone',
    DATE = 'date',
    TIME = 'time',
    TIME_WITHOUT_TIME_ZONE = 'time without time zone',
    TIME_WITH_TIME_ZONE = 'time with time zone',
    INTERVAL = 'interval',
    BOOL = 'bool',
    BOOLEAN = 'boolean',
    ENUM = 'enum',
    POINT = 'point',
    LINE = 'line',
    LSEG = 'lseg',
    BOX = 'box',
    PATH = 'path',
    POLYGON = 'polygon',
    CIRCLE = 'circle',
    CIDR = 'cidr',
    INET = 'inet',
    MACADDR = 'macaddr',
    MACADDR8 = 'macaddr8',
    TSVECTOR = 'tsvector',
    TSQUERY = 'tsquery',
    UUID = 'uuid',
    XML = 'xml',
    JSON = 'json',
    JSONB = 'jsonb',
    JSONPATH = 'jsonpath',
    INT4RANGE = 'int4range',
    INT8RANGE = 'int8range',
    NUMRANGE = 'numrange',
    TSRANGE = 'tsrange',
    TSTZRANGE = 'tstzrange',
    DATERANGE = 'daterange',
    INT4MULTIRANGE = 'int4multirange',
    INT8MULTIRANGE = 'int8multirange',
    NUMMULTIRANGE = 'nummultirange',
    TSMULTIRANGE = 'tsmultirange',
    TSTZMULTIRANGE = 'tstzmultirange',
    DATEMULTIRANGE = 'datemultirange',
    GEOMETRY = 'geometry',
    GEOGRAPHY = 'geography',
    CUBE = 'cube',
    LTREE = 'ltree',
    VECTOR = 'vector',
    HALFVEC = 'halfvec',
}

/**
 * SQL Server 支持的数据类型
 */
export enum SqlServerDataTypes {
    INT = 'int',
    BIGINT = 'bigint',
    BIT = 'bit',
    DECIMAL = 'decimal',
    MONEY = 'money',
    NUMERIC = 'numeric',
    SMALLINT = 'smallint',
    SMALLMONEY = 'smallmoney',
    TINYINT = 'tinyint',
    FLOAT = 'float',
    REAL = 'real',
    DATE = 'date',
    DATETIME2 = 'datetime2',
    DATETIME = 'datetime',
    DATETIMEOFFSET = 'datetimeoffset',
    SMALLDATETIME = 'smalldatetime',
    TIME = 'time',
    CHAR = 'char',
    VARCHAR = 'varchar',
    TEXT = 'text',
    NCHAR = 'nchar',
    NVARCHAR = 'nvarchar',
    NTEXT = 'ntext',
    BINARY = 'binary',
    IMAGE = 'image',
    VARBINARY = 'varbinary',
    HIERARCHYID = 'hierarchyid',
    SQL_VARIANT = 'sql_variant',
    TIMESTAMP = 'timestamp',
    UNIQUEIDENTIFIER = 'uniqueidentifier',
    XML = 'xml',
    GEOMETRY = 'geometry',
    GEOGRAPHY = 'geography',
    ROWVERSION = 'rowversion',
    VECTOR = 'vector',
}

/**
 * Oracle 支持的数据类型
 */
export enum OracleDataTypes {
    CHAR = 'char',
    NCHAR = 'nchar',
    NVARCHAR2 = 'nvarchar2',
    VARCHAR2 = 'varchar2',
    LONG = 'long',
    RAW = 'raw',
    LONG_RAW = 'long raw',
    NUMBER = 'number',
    NUMERIC = 'numeric',
    FLOAT = 'float',
    DEC = 'dec',
    DECIMAL = 'decimal',
    INTEGER = 'integer',
    INT = 'int',
    SMALLINT = 'smallint',
    REAL = 'real',
    DOUBLE_PRECISION = 'double precision',
    DATE = 'date',
    TIMESTAMP = 'timestamp',
    TIMESTAMP_WITH_TIME_ZONE = 'timestamp with time zone',
    TIMESTAMP_WITH_LOCAL_TIME_ZONE = 'timestamp with local time zone',
    INTERVAL_YEAR_TO_MONTH = 'interval year to month',
    INTERVAL_DAY_TO_SECOND = 'interval day to second',
    BFILE = 'bfile',
    BLOB = 'blob',
    CLOB = 'clob',
    NCLOB = 'nclob',
    ROWID = 'rowid',
    UROWID = 'urowid',
    SIMPLE_JSON = 'simple-json',
    JSON = 'json',
}

/**
 * CockroachDB 支持的数据类型
 */
export enum CockroachDataTypes {
    ARRAY = 'array',
    BOOL = 'bool',
    BOOLEAN = 'boolean',
    BYTES = 'bytes',
    BYTEA = 'bytea',
    BLOB = 'blob',
    DATE = 'date',
    ENUM = 'enum',
    GEOMETRY = 'geometry',
    GEOGRAPHY = 'geography',
    NUMERIC = 'numeric',
    DECIMAL = 'decimal',
    DEC = 'dec',
    FLOAT = 'float',
    FLOAT4 = 'float4',
    FLOAT8 = 'float8',
    DOUBLE_PRECISION = 'double precision',
    REAL = 'real',
    INET = 'inet',
    INT = 'int',
    INT4 = 'int4',
    INTEGER = 'integer',
    INT2 = 'int2',
    INT8 = 'int8',
    INT64 = 'int64',
    SMALLINT = 'smallint',
    BIGINT = 'bigint',
    INTERVAL = 'interval',
    STRING = 'string',
    CHARACTER_VARYING = 'character varying',
    CHARACTER = 'character',
    CHAR = 'char',
    CHAR_VARYING = 'char varying',
    VARCHAR = 'varchar',
    TEXT = 'text',
    TIME = 'time',
    TIME_WITHOUT_TIME_ZONE = 'time without time zone',
    TIMESTAMP = 'timestamp',
    TIMESTAMPTZ = 'timestamptz',
    TIMESTAMP_WITHOUT_TIME_ZONE = 'timestamp without time zone',
    TIMESTAMP_WITH_TIME_ZONE = 'timestamp with time zone',
    JSON = 'json',
    JSONB = 'jsonb',
    UUID = 'uuid',
}

/**
 * SAP HANA 支持的数据类型
 */
export enum SapDataTypes {
    ALPHANUM = 'alphanum', // removed in SAP HANA Cloud
    ARRAY = 'array',
    BIGINT = 'bigint',
    BINARY = 'binary',
    BLOB = 'blob',
    BOOLEAN = 'boolean',
    CHAR = 'char', // not officially supported, in SAP HANA Cloud: alias for "nchar"
    CLOB = 'clob', // in SAP HANA Cloud: alias for "nclob"
    DATE = 'date',
    DEC = 'dec', // typeorm alias for "decimal"
    DECIMAL = 'decimal',
    DOUBLE = 'double',
    FLOAT = 'float', // database alias for "real" / "double"
    HALF_VECTOR = 'half_vector', // only supported in SAP HANA Cloud, not in SAP HANA 2.0
    INT = 'int', // typeorm alias for "integer"
    INTEGER = 'integer',
    NCHAR = 'nchar', // not officially supported
    NCLOB = 'nclob',
    NVARCHAR = 'nvarchar',
    REAL_VECTOR = 'real_vector', // only supported in SAP HANA Cloud, not in SAP HANA 2.0
    REAL = 'real',
    SECONDDATE = 'seconddate',
    SHORTTEXT = 'shorttext', // removed in SAP HANA Cloud
    SMALLDECIMAL = 'smalldecimal',
    SMALLINT = 'smallint',
    ST_GEOMETRY = 'st_geometry',
    ST_POINT = 'st_point',
    TEXT = 'text', // removed in SAP HANA Cloud
    TIME = 'time',
    TIMESTAMP = 'timestamp',
    TINYINT = 'tinyint',
    VARBINARY = 'varbinary',
    VARCHAR = 'varchar', // in SAP HANA Cloud: alias for "nvarchar"
}

/**
 * Spanner 支持的数据类型
 */
export enum SpannerDataTypes {
    BOOL = 'bool',
    INT64 = 'int64',
    FLOAT64 = 'float64',
    NUMERIC = 'numeric',
    STRING = 'string',
    JSON = 'json',
    BYTES = 'bytes',
    DATE = 'date',
    TIMESTAMP = 'timestamp',
    ARRAY = 'array',
}

/**
 * SQLite (包括 Better-SQLite3, React Native, SQL.js 等) 支持的数据类型
 */
export enum SqliteDataTypes {
    INT = 'int',
    INTEGER = 'integer',
    TINYINT = 'tinyint',
    SMALLINT = 'smallint',
    MEDIUMINT = 'mediumint',
    BIGINT = 'bigint',
    UNSIGNED_BIG_INT = 'unsigned big int',
    INT2 = 'int2',
    INT8 = 'int8',
    CHARACTER = 'character',
    VARCHAR = 'varchar',
    VARYING_CHARACTER = 'varying character',
    NCHAR = 'nchar',
    NATIVE_CHARACTER = 'native character',
    NVARCHAR = 'nvarchar',
    TEXT = 'text',
    CLOB = 'clob',
    BLOB = 'blob',
    REAL = 'real',
    DOUBLE = 'double',
    DOUBLE_PRECISION = 'double precision',
    FLOAT = 'float',
    NUMERIC = 'numeric',
    DECIMAL = 'decimal',
    BOOLEAN = 'boolean',
    DATE = 'date',
    TIME = 'time',
    DATETIME = 'datetime',
    JSON = 'json', // only supported in some SQLite drivers
}

/**
 * 所有数据库数据类型的联合类型
 */
export type AllDataTypes =
    | MysqlDataTypes
    | PostgresDataTypes
    | SqlServerDataTypes
    | OracleDataTypes
    | CockroachDataTypes
    | SapDataTypes
    | SpannerDataTypes
    | SqliteDataTypes;

/**
 * 数据库类型到数据类型枚举的映射
 */
export const DatabaseDataTypesMap = {
    mysql: MysqlDataTypes,
    'aurora-mysql': MysqlDataTypes,
    postgres: PostgresDataTypes,
    'aurora-postgres': PostgresDataTypes,
    'sql-server': SqlServerDataTypes,
    mssql: SqlServerDataTypes,
    oracle: OracleDataTypes,
    cockroachdb: CockroachDataTypes,
    sap: SapDataTypes,
    spanner: SpannerDataTypes,
    sqlite: SqliteDataTypes,
    'better-sqlite3': SqliteDataTypes,
    'react-native': SqliteDataTypes,
    sqljs: SqliteDataTypes,
} as const;

export const ColumnTypes = {
    MYSQL: MysqlDataTypes,
    AURORA_MYSQL: MysqlDataTypes,
    POSTGRES: PostgresDataTypes,
    AURORA_POSTGRES: PostgresDataTypes,
    SQL_SERVER: SqlServerDataTypes,
    MSSQL: SqlServerDataTypes,
    ORACLE: OracleDataTypes,
    COCKROACHDB: CockroachDataTypes,
    SAP: SapDataTypes,
    SPANNER: SpannerDataTypes,
    SQLITE: SqliteDataTypes,
} as const;
