import {SimpleColumnType} from "app/src-ssr/types/SimpleColumnType";

export interface Table {
  /** 备注名称 */
  Name: string;
  /** 类的名字 */
  ClassName: string;
  /** restful 接口 */
  Restful: string;

  /** 数据表内容 */
  Constants: string;

  /** 字段列表 */
  columns: Record<string, TableColumns>,
}


export interface TableColumns {
  /** 字段名称 */
  name: string,

  /** 是否必填 */
  nullable: boolean;
  /** 文档不可重复 */
  unique: boolean;

  /** 数据类型 */
  dataType: ColumnType;

  /** 展示排序 */
  sort?: number;

  /** 数据扩展 */
  extension?: TableColumnsExtension;
  /** 是否分离数据扩展 */
  splitExtension?: boolean;
  /** 数据扩展-后端 */
  extension_backend?: TableColumnsExtension;
  /** 数据扩展-前端 */
  extension_frontend?: TableColumnsExtension;
}


export interface TableColumnsExtension {
  uuid?: boolean; // IncrementId: 是否使用 uuid 作为主键
  dbType?: SimpleColumnType; // 数据库子类型
  length?: number; // 长度
  default?: string | number | null;

  type_string?: string; // 类型定义, 这个key是什么类型, 默认是any,
  interface_string?: string; // 如果 type_string 是interface, 则会使用  interface_string 作为类型
  type_import?: Array<[string, string]>; // 导入,

  relation?: string; // 关联到哪个表;
  joinColumn?: string; // 是否使用 JoinColumn;
}


export enum ColumnType {
  /** 自增ID */
  IncrementId = "IncrementId",
  /** 创建时间 */
  CreatedTime = "CreatedTime",
  /** 更新时间 */
  UpdatedTime = "UpdatedTime",


  /** 数字 */
  Number = "number",
  /** 创建时间 */
  Date = "Date",
  /** 字符 */
  String = "string",
  /** Boolean 类型 */
  Boolean = "boolean",


  /** 复杂JSON数据 */
  Json = "Json",
  /** 枚举 */
  Enum = "Enum",

  /** 关系: 多对多 */
  RelationManyToMany = "RelationManyToMany",
  /** 关系: 多对一 */
  RelationManyToOne = "RelationManyToOne",
  /** 关系: 一对多 */
  RelationOneToMany = "RelationOneToMany",
  /** 关系: 一对一 */
  RelationOneToOne = "RelationOneToOne",
}


export const ColumnTypeOptions: Record<ColumnType, { value: ColumnType, label: string, type_string?: string }> = {
  [ColumnType.Number]: {value: ColumnType.Number, label: "基础:数字", type_string: "number"},
  [ColumnType.Date]: {value: ColumnType.Date, label: "基础:日期", type_string: "Date"},
  [ColumnType.String]: {value: ColumnType.String, label: "基础:字符串", type_string: "string"},
  [ColumnType.Boolean]: {value: ColumnType.Boolean, label: "基础:布尔值", type_string: "boolean"},

  [ColumnType.Json]: {value: ColumnType.Json, label: "扩展:JSON"},
  [ColumnType.Enum]: {value: ColumnType.Enum, label: "扩展:枚举"},

  [ColumnType.RelationManyToMany]: {value: ColumnType.RelationManyToMany, label: "关系: 多对多"},
  [ColumnType.RelationManyToOne]: {value: ColumnType.RelationManyToOne, label: "关系: 多对一"},
  [ColumnType.RelationOneToMany]: {value: ColumnType.RelationOneToMany, label: "关系: 一对多"},
  [ColumnType.RelationOneToOne]: {value: ColumnType.RelationOneToOne, label: "关系: 一对一"},

  [ColumnType.IncrementId]: {value: ColumnType.IncrementId, label: "类型:自增ID"},
  [ColumnType.CreatedTime]: {value: ColumnType.CreatedTime, label: "类型:创建时间", type_string: "Date"},
  [ColumnType.UpdatedTime]: {value: ColumnType.UpdatedTime, label: "类型:更新时间", type_string: "Date"},

}


export const defaultIdColumn: TableColumns = {
  /** 字段名称 */
  name: "自增ID",

  /** 是否必填 */
  nullable: true,
  /** 文档不可重复 */
  unique: true,

  /** 数据类型 */
  dataType: ColumnType.IncrementId,
}


export const defaultCreatedColumns: TableColumns = {
  /** 字段名称 */
  name: "创建时间",

  /** 是否必填 */
  nullable: true,
  /** 文档不可重复 */
  unique: false,
  /** 数据类型 */
  dataType: ColumnType.CreatedTime,
}


export const defaultUpdatedColumns: TableColumns = {
  /** 字段名称 */
  name: "更新时间",

  /** 是否必填 */
  nullable: true,
  /** 文档不可重复 */
  unique: false,
  /** 数据类型 */
  dataType: ColumnType.UpdatedTime,
}
