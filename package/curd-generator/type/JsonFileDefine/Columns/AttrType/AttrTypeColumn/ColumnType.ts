/**
 * Any column type column can be.
 */
export enum ColumnType {
  "int" = "int",
  "integer" = "integer",
  "bigint" = "bigint",

  "float" = "float",
  "double" = "double",
  "decimal" = "decimal",

  "uuid" = "uuid",

  "varchar" = "varchar",
  "text" = "text",
  "boolean" = "boolean",
  "char" = "char",
  "nchar" = "nchar",
  "blob" = "blob",

  "varbinary" = "varbinary",
  "binary" = "binary",


  "timestamp" = "timestamp",
  "datetime" = "datetime",
  "date" = "date",


  "json" = "json",
  "jsonb" = "jsonb",
  "enum" = "enum",
  "simple-enum" = "simple-enum",
}

export interface ColumnTypeConfigIc<key> {
  /** q-select 选择值 */
  value: key,
  /** q-select 选择展示 */
  label: string,

  /** 对应 typescript 数据类型 */
  type: string,
  /** 是否需要导入, json和enum 一般情况下不是基础类型, typescript的数据类型是其他enum或者interface */
  needImport: boolean;
}

export const ColumnTypeConfig: { [key in ColumnType]: ColumnTypeConfigIc<key> } = {
  [ColumnType.int]: {
    value: ColumnType.int,
    label: "整数",
    type: "number",
    needImport: false,
  },
  [ColumnType.integer]: {
    value: ColumnType.integer,
    label: "整数",
    type: "number",
    needImport: false,
  },
  [ColumnType.bigint]: {
    value: ColumnType.bigint,
    label: "长整数",
    type: "number",
    needImport: false,
  },
  [ColumnType.float]: {
    value: ColumnType.float,
    label: "浮点数",
    type: "number",
    needImport: false,
  },
  [ColumnType.double]: {
    value: ColumnType.double,
    label: "双精度浮点数",
    type: "number",
    needImport: false,
  },
  [ColumnType.decimal]: {
    value: ColumnType.decimal,
    label: "高精度浮点数",
    type: "number",
    needImport: false,
  },
  [ColumnType.uuid]: {
    value: ColumnType.uuid,
    label: "UUID",
    type: "string",
    needImport: false,
  },
  [ColumnType.varchar]: {
    value: ColumnType.varchar,
    label: "可变字符串",
    type: "string",
    needImport: false,
  },
  [ColumnType.text]: {
    value: ColumnType.text,
    label: "文本",
    type: "string",
    needImport: false,
  },
  [ColumnType.boolean]: {
    value: ColumnType.boolean,
    label: "布尔值",
    type: "boolean",
    needImport: false,
  },
  [ColumnType.char]: {
    value: ColumnType.char,
    label: "定长字符",
    type: "string",
    needImport: false,
  },
  [ColumnType.nchar]: {
    value: ColumnType.nchar,
    label: "Unicode字符",
    type: "string",
    needImport: false,
  },
  [ColumnType.blob]: {
    value: ColumnType.blob,
    label: "二进制数据",
    type: "Uint8Array",
    needImport: false,
  },
  [ColumnType.varbinary]: {
    value: ColumnType.varbinary,
    label: "可变二进制",
    type: "Uint8Array",
    needImport: false,
  },
  [ColumnType.binary]: {
    value: ColumnType.binary,
    label: "定长二进制",
    type: "Uint8Array",
    needImport: false,
  },
  [ColumnType.timestamp]: {
    value: ColumnType.timestamp,
    label: "时间戳",
    type: "Date",
    needImport: false,
  },
  [ColumnType.datetime]: {
    value: ColumnType.datetime,
    label: "日期时间",
    type: "Date",
    needImport: false,
  },
  [ColumnType.date]: {
    value: ColumnType.date,
    label: "日期",
    type: "Date",
    needImport: false,
  },
  [ColumnType.json]: {
    value: ColumnType.json,
    label: "JSON",
    type: "any", // 可按需改为 interface
    needImport: true,
  },
  [ColumnType.jsonb]: {
    value: ColumnType.jsonb,
    label: "JSONB",
    type: "any", // 可按需改为 interface
    needImport: true,
  },
  [ColumnType.enum]: {
    value: ColumnType.enum,
    label: "枚举",
    type: "any", // 可按需改为 enum
    needImport: true,
  },
  [ColumnType["simple-enum"]]: {
    value: ColumnType["simple-enum"],
    label: "简单枚举",
    type: "any", // 可按需改为 enum
    needImport: true,
  },
}

export const ColumnTypeArr = Object.values(ColumnType);


export const WithLengthColumnType = ["character varying", "varying character", "char varying", "nvarchar", "national varchar", "character", "native character", "varchar", "char", "nchar", "national char", "varchar2", "nvarchar2", "alphanum", "shorttext", "raw", "binary", "varbinary", "string"];
export const WithWidthColumnType = ["tinyint" , "smallint" , "mediumint" , "int" , "bigint"];
