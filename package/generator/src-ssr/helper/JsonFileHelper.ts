import path from "node:path";
import fs from "node:fs";
import {ExportConfig} from "app/src-ssr/types/ExportConfig";
import {InputJson} from "app/src-ssr/types/InputJson";

// 配置文件所在的目录, 主要配置导出和导入目录
export const config_json_path = path.join(process.cwd(), 'test/config.json')

/** 获取配置文件的内容 */
export function getConfigJson(): ExportConfig {
  // 如果文件不存在, 则创建文件
  if (!fs.existsSync(config_json_path)) {
    const defaultConfig: ExportConfig = {
      // 数据表的目录
      input: path.join(process.cwd(), 'test/input.json'),
      // 导出后端目录
      backend: path.join(process.cwd(), 'test/backend'),
      // 导出前端目录
      frontend: path.join(process.cwd(), 'test/frontend'),
    }
    fs.writeFileSync(config_json_path, JSON.stringify(defaultConfig), {});
  }

  const content = JSON.parse(fs.readFileSync(config_json_path).toString());
  return content as ExportConfig
}


/** 获取数据JSON的内容 */
export function getGeneratorJson(): InputJson {
  const config = getConfigJson();
  const generator_json_path = config.input;

  if (!fs.existsSync(generator_json_path)) {
    const defaultConfig = {
      modules: [],
      tables: [],
      templates: {},
    }
    fs.writeFileSync(generator_json_path, JSON.stringify(defaultConfig));
  }
  const content = JSON.parse(fs.readFileSync(generator_json_path).toString());
  content.modules = content.modules || [];
  content.tables = content.tables || [];
  content.templates = content.templates || {};
  return content;

}
