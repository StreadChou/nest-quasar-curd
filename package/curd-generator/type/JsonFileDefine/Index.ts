export interface JsonFile {
  /** 项目名称 */
  name?: string;
  /** 创建时间 */
  created_at?: number;
  /** 更新时间 */
  updated_at?: number;

  /** 模块 */
  modules?: Record<string, ModulesItem>
  /** 是否导出 ModulesList */
  toModulesList?: boolean;
  /** 是否导出 toEntityList */
  toEntityList?: boolean;
}


export interface ModulesItem {
  /** 唯一标识/名字 */
  name?: string;
  /** 模块名字 */
  moduleName?: string;

  /** 是否导出 */
  isExport?: boolean;
  /** 是否加入到 ModuleList 中 */
  toList?: boolean;
  /** 是否全局 */
  isGlobal?: boolean;

  /** 模型 */
  models?: Record<string, ModelsItem>;
}


export interface ModelsItem {
  /** 唯一标识/名字 */
  name?: string;
  /** 模型名字 */
  entityClassName?: string;


  /** 数据库的表名 */
  dbName?: string;
  /** 是否加入到 module 的 imports 中 */
  joinModuleImports?: boolean;

  /** 是否导出controller */
  exportController?: boolean;
  /** controller的名字 */
  controllerClassName?: string;
  /** curd的路径 */
  curdPath?: string;
  /** 是否加入到 module 的 controllers 中 */
  joinModuleControllers?: boolean;


  /** 是否导出service */
  exportService?: boolean;
  /** service的名字 */
  serviceName?: string;
  /** 是否加入到 module 的 providers 中 */
  joinModuleProviders?: boolean;
  /** 是否加入到 module 的 exports 中 */
  joinModuleExports?: boolean;

  /** 字段列表 */
  attrs?: Array<ModelAttrItem>;
}


export interface ModelAttrItem {
  name?: string;
  mark?: string;
  /** 字段类型 */
  columnsType?: ColumnsType;
  /** 是否使用自定义的option */
  useCustomerOption?: boolean;
  /** 自定义的option */
  customerOption?: string;
  /** 通用数据列 */
  columnCommonOptions?: {
    select?: boolean;
    name?: string;
    primary?: boolean;
    generated?: boolean | "increment" | "uuid" | "rowid" | "identity";
    unique?: boolean;
    nullable?: boolean;
    default?: any;
    onUpdate?: string;
    comment?: string;
    array?: boolean;
    transformer?: string;
  };
  ColumnWithLengthOptions?: {
    length?: string | number;
  }
  ColumnWithWidthOptions?: {
    width?: number;
    zerofill?: boolean;
    unsigned?: boolean;
  }
  ColumnNumericOptions?: {
    precision?: number;
    scale?: number;
    zerofill?: boolean;
    unsigned?: boolean;
  }


  /** columnsType 为 Column 的时候需要一个数据类型 */
  column_Type?: WithLengthColumnType | WithWidthColumnType;


}


/** 字段类型 */
export enum ColumnsType {
  Column = "Column",
  CreateDateColumn = "CreateDateColumn",
  DeleteDateColumn = "DeleteDateColumn",
  ObjectIdColumn = "ObjectIdColumn",
  PrimaryColumn = "PrimaryColumn",
  PrimaryGeneratedColumn = "PrimaryGeneratedColumn",
  UpdateDateColumn = "UpdateDateColumn",
  VersionColumn = "VersionColumn",
  ViewColumn = "ViewColumn",
  VirtualColumn = "VirtualColumn",
}

export const ColumnsTypeOption: { [key in ColumnsType]: { value: key, label: string } } = {
  [ColumnsType.Column]: {value: ColumnsType.Column, label: "普通列"},
  [ColumnsType.CreateDateColumn]: {value: ColumnsType.CreateDateColumn, label: "创建时间列"},
  [ColumnsType.DeleteDateColumn]: {value: ColumnsType.DeleteDateColumn, label: "软删除时间列"},
  [ColumnsType.ObjectIdColumn]: {value: ColumnsType.ObjectIdColumn, label: "MongoDB ObjectId 列"},
  [ColumnsType.PrimaryColumn]: {value: ColumnsType.PrimaryColumn, label: "主键列"},
  [ColumnsType.PrimaryGeneratedColumn]: {value: ColumnsType.PrimaryGeneratedColumn, label: "自增主键列"},
  [ColumnsType.UpdateDateColumn]: {value: ColumnsType.UpdateDateColumn, label: "更新时间列"},
  [ColumnsType.VersionColumn]: {value: ColumnsType.VersionColumn, label: "版本号列（用于乐观锁）"},
  [ColumnsType.ViewColumn]: {value: ColumnsType.ViewColumn, label: "视图列"},
  [ColumnsType.VirtualColumn]: {value: ColumnsType.VirtualColumn, label: "虚拟列（不会持久化）"},
};


/** 带有长度的数据类型 */
export enum WithLengthColumnType {
  CharacterVarying = "character varying",
  VaryingCharacter = "varying character",
  CharVarying = "char varying",
  Nvarchar = "nvarchar",
  NationalVarchar = "national varchar",
  Character = "character",
  NativeCharacter = "native character",
  Varchar = "varchar",
  Char = "char",
  Nchar = "nchar",
  NationalChar = "national char",
  Varchar2 = 'varchar2',
  Nvarchar2 = 'nvarchar2',
  Alphanum = 'alphanum',
  Shorttext = 'shorttext',
  Raw = 'raw',
  Binary = 'binary',
  Varbinary = 'varbinary',
  String = 'string',
}


/** 带有宽度的数据类型 */
export enum WithWidthColumnType {
  Tinyint = "tinyint",
  Smallint = "smallint",
  Mediumint = "mediumint",
  Int = "int",
  Bigint = "bigint",
}

export enum WithPrecisionColumnType {
  Float = 'float',
  Double = 'double',
  Dec = 'dec',
  Decimal = 'decimal',
  Smalldecimal = 'smalldecimal',
  Fixed = 'fixed',
  Numeric = 'numeric',
  Real = 'real',
  DoublePrecision = 'double precision',
  Number = 'number',
  Datetime = 'datetime',
  Datetime2 = 'datetime2',
  Datetimeoffset = 'datetimeoffset',
  Time = 'time',
  TimeWithTimeZone = 'time with time zone',
  TimeWithoutTimeZone = 'time without time zone',
  Timestamp = 'timestamp',
  TimestampWithoutTimeZone = 'timestamp without time zone',
  TimestampWithTimeZone = 'timestamp with time zone',
  TimestampWithLocalTimeZone = 'timestamp with local time zone',
}
