import {ModelConfig} from "app/type/JsonFileDefine/Model";

/** Module 设置 */
export interface ModuleConfig {
  /** 唯一标识/名字 */
  name: string;

  /** 是否导出 */
  isExport: boolean;
  /** 是否加入到 ModuleList 中 */
  toList: boolean;
  /** 是否全局 */
  isGlobal: boolean;

  /** 模型 */
  models: Record<string, ModelConfig>;
}
