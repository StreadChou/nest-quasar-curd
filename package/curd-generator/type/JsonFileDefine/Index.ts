export interface JsonFile {
  /** 模块 */
  modules?: Record<string, ModulesItem>
}


export interface ModulesItem {
  /** 模型 */
  models?: Record<string, ModelsItem>;

  /** 是否使用typeOrm导出 */
  typeOrmFeature?: boolean;

}


export interface ModelsItem {

}
