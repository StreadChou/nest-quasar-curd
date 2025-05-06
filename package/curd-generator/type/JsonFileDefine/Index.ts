export interface JsonFile {
  /** 模块 */
  modules?: Record<string, ModulesItem>
  /** 是否导出 ModulesList */
  toModulesList?: boolean;
  /** 是否导出 ModelList */
  toModelList?: boolean;
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

  /** 是否导出controller */
  exportController?: boolean;
  /** controller的名字 */
  controllerName?: string;
  /** curd的路径 */
  curdPath?: string;


  /** 是否导出service */
  exportService?: boolean;
  /** service的名字 */
  serviceName?: string;

}
