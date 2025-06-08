import {ColumnOptions} from "app/type/JsonFileDefine/Columns/AttrType/AttrTypeColumn/ColumnOptions";
import {AttrType} from "app/type/JsonFileDefine/Columns/AttrType/AttrType";
import {AttrColumnDecoratorType, AttrRelationDecoratorType} from "app/type/JsonFileDefine/Columns/ColumnsType";
import {RelationOptions} from "app/type/JsonFileDefine/Columns/AttrType/AttrTypeRelation/RelationOptions";
import {RelationExtension} from "app/type/JsonFileDefine/Columns/AttrType/AttrTypeRelation/RelationExtension";

export interface AttrConfig {
  /** 字段名 */
  name: string;
  /** 字段类型-普通字段还是关系字段 */
  attrTpe: AttrType;

  /** 装饰器类型 */
  attrDecoratorType: AttrColumnDecoratorType | AttrRelationDecoratorType;

  /** 如果 column 数据, 则使用的option */
  columnOptions: ColumnOptions;
  /** 如果 relation 数据, 则使用的option */
  relationOptions: RelationOptions;
  /** 如果 relation 数据, 附加数据是什么 */
  relationExtension: RelationExtension;


  /** 字段备注 */
  mark?: string;
}
