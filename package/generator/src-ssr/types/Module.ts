export interface Module {
  /** module的名字 */
  name: string;
  /** 包含哪些table */
  tables: Array<String>;
  /** restful 接口 */
  restful: string;
}
