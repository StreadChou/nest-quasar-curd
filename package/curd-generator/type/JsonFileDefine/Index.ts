export interface JsonFile {
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
  type?: string;
}
