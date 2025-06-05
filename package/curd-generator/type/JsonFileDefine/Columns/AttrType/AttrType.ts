/** 字段类型 */
export enum AttrType {
  /** 字段 */
  Column = "Column",
  /** 关系 */
  Relation = "Relation",
}

export const AttrTypeArray = Object.values(AttrType);
