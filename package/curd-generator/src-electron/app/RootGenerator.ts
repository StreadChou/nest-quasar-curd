import {JsonFile} from "app/type/JsonFileDefine/Index";
import {ModuleGenerator} from "app/src-electron/app/ModuleGenerator";
import {ModuleConfig} from "app/type/JsonFileDefine/Module";

export class RootGenerator {
  json_file_path: string
  json_data: JsonFile;

  /** 所有的模块 */
  modules: Record<string, ModuleGenerator> = {};

  constructor(json_file_path: string, data: JsonFile) {
    this.json_file_path = json_file_path
    this.json_data = data;
    this.initInstance();
  }

  get backend_path() {
    return "";
  }

  get frontend_path() {
    return "";
  }


  initInstance() {
    for (const module_name in this.json_data.modules) {
      const item = this.json_data.modules[module_name] as ModuleConfig;
      this.modules[module_name] = new ModuleGenerator(this, item);
    }
  }

  start() {

  }

  writeToFile() {

  }

}
