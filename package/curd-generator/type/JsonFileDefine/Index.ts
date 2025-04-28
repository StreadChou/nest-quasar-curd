export interface JsonFile {
  /** 模块 */
  modules?: Record<string, ModulesItem>
}


export interface ModulesItem {
  /** 模型名字 */
  name?: string;
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

}
