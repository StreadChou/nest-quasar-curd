import {ModelConfig} from "app/type/JsonFileDefine/Model";

/** Module 设置 */
export interface ModuleConfig {
  /** 唯一标识/名字 */
  name: string;

  /** module 文件名字, 默认使用 name 字段 */
  fileName?: string;
  /** 类对象, 默认使用 name 字段 */
  className?: string;

  /** 是否导出 */
  isExport: boolean;
  /** 是否加入到 ModuleList 中 */
  toList: boolean;
  /** 是否全局 */
  isGlobal: boolean;

  /** 模型 */
  models: Record<string, ModelConfig>;
}
