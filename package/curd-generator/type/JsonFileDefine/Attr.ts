import {ColumnsType} from "app/type/JsonFileDefine/Columns/ColumnsType";

export interface AttrConfig {
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
  column_Type?: string;

}
