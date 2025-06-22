import {JsonFile} from "app/type/JsonFileDefine/Index";
import {ModuleGenerator} from "app/src-electron/app/ModuleGenerator";
import {ModuleConfig} from "app/type/JsonFileDefine/Module";
import {getAbsolutePath} from "app/src-electron/helper/PathHelper";
import fs from "fs";

export class RootGenerator {
  json_file_path: string
  json_data: JsonFile;
  /** 后端地址 */
  backend_path: string;
  /** 前端地址 */
  frontend_path: string;


  /** 所有的模块 */
  modules: Record<string, ModuleGenerator> = {};

  constructor(json_file_path: string, data: JsonFile) {
    this.json_file_path = json_file_path
    this.json_data = data;
    this.initInstance();
    this.backend_path = getAbsolutePath(this.json_file_path, data.project.backend_path);
    this.frontend_path = getAbsolutePath(this.json_file_path, data.project.frontend_path);
  }

  initInstance() {
    for (const module_name in this.json_data.modules) {
      const item = this.json_data.modules[module_name] as ModuleConfig;
      this.modules[module_name] = new ModuleGenerator(this, item);
    }
  }

  start() {
    for (const item of Object.values(this.modules)) {
      item.start();
    }
  }

  writeToFile() {
    for (const item of Object.values(this.modules)) {
      item.writeToFile();
    }
  }

}


const target = `/Users/stread/Project/002_Stread/nest-quasar-curd/example/test.nqcurd`
const json_string = fs.readFileSync(target).toString();
const json_data: JsonFile = JSON.parse(json_string);
const generator = new RootGenerator(target, json_data);

generator.start();
generator.writeToFile();
