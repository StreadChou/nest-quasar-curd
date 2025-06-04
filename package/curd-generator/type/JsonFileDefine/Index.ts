import {ProjectConfig} from "app/type/JsonFileDefine/Project";
import {CollectConfig} from "app/type/JsonFileDefine/Collect";
import {ModuleConfig} from "app/type/JsonFileDefine/Module";

export interface JsonFile {
  /** 项目设置 */
  project: ProjectConfig;
  /** 集合设置 */
  collect: CollectConfig;
  /** Module 设置 */
  modules: Record<string, ModuleConfig>


}
