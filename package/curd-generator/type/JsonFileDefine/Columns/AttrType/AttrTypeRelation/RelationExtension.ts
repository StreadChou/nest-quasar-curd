import {ImportDataIc} from "app/type/TypescriptImport/ImportType";

export interface RelationExtension {
  /** 关联的目标 */
  target?: ImportDataIc;
  /** 目标的key值 */
  targetKey?: string;
  /** 是否使用 JoinColumn */
  JoinColumn?: boolean;
}
