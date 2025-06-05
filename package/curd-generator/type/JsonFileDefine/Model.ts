import {AttrConfig} from "app/type/JsonFileDefine/Attr";

export interface ModelConfig {
  /** 唯一标识/名字 */
  name: string;

  /** 数据库的表名 */
  dbName: string;
  /** 是否加入到 module 的 imports 中 */
  joinModuleImports: boolean;

  /** 是否导出controller */
  exportController: boolean;
  /** controller的名字 */
  controllerClassName?: string;
  /** curd的路径 */
  curdPath?: string;
  /** 是否加入到 module 的 controllers 中 */
  joinModuleControllers?: boolean;


  /** 是否导出service */
  exportService: boolean;
  /** service的名字 */
  serviceName?: string;
  /** 是否加入到 module 的 providers 中 */
  joinModuleProviders?: boolean;
  /** 是否加入到 module 的 exports 中 */
  joinModuleExports?: boolean;


  /** 是否导出 Interface  */
  exportInterface: boolean;

  /** 字段列表 */
  attrs: Array<AttrConfig>;

  /** 宏定义 */
  constant: Array<ConstantConfig>
}


export interface ConstantConfig{
  name: string;
  value: string;
  exports: Array<{ name: string, isDefault: boolean }>
}
