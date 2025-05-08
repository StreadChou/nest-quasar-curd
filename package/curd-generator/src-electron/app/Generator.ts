import fs from "fs";
import {JsonFile, ModulesItem} from "app/type/JsonFileDefine/Index";
import {ModulesGenerator} from "app/src-electron/app/ModulesGenerator";
import {
  ModuleListFileGeneratorBackend
} from "app/src-electron/app/generator/FileGenerator/ModuleListFileGeneratorBackend";
import {
  EntityListFileGeneratorBackend
} from "app/src-electron/app/generator/FileGenerator/EntityListFileGeneratorBackend";
import {
  BaseControllerFileGeneratorBackend
} from "app/src-electron/app/generator/FileGenerator/BaseControllerFileGeneratorBackend";
import {
  BaseServiceFileGeneratorBackend
} from "app/src-electron/app/generator/FileGenerator/BaseServiceFileGeneratorBackend";
import {
  CurdDefineFileGeneratorBackend
} from "app/src-electron/app/generator/FileGenerator/CurdDefineFileGeneratorBackend";

export class Generator {
  json_file_path: string
  backend_path: string
  frontend_path: string
  data: JsonFile;

  /** 所有的模块 */
  modules: Record<string, ModulesGenerator> = {};

  baseControllerFileGeneratorBackend!: BaseControllerFileGeneratorBackend;
  baseServiceFileGeneratorBackend!: BaseServiceFileGeneratorBackend;
  curdDefineFileGeneratorBackend!: CurdDefineFileGeneratorBackend;

  /** module 列表生成 */
  moduleListFileGeneratorBackend!: ModuleListFileGeneratorBackend;
  /** entity 列表生成 */
  entityListFileGeneratorBackend!: EntityListFileGeneratorBackend;

  constructor(data: { json_file_path: string, backend_path: string, frontend_path: string }) {
    this.json_file_path = data.json_file_path
    this.backend_path = data.backend_path
    this.frontend_path = data.frontend_path
    this.data = JSON.parse(fs.readFileSync(this.json_file_path, "utf-8").toString());
    this.initInstance();
  }


  initInstance() {
    this.curdDefineFileGeneratorBackend = new CurdDefineFileGeneratorBackend(this);
    this.moduleListFileGeneratorBackend = new ModuleListFileGeneratorBackend(this);
    this.entityListFileGeneratorBackend = new EntityListFileGeneratorBackend(this);

    this.data = this.data || {};
    this.data.modules = this.data.modules || {};
    for (const module_name in this.data.modules) {
      const module = this.data.modules[module_name] as ModulesItem;
      const instance = new ModulesGenerator(this, module);
      this.modules[instance.moduleData.name as string] = instance;
    }

    this.baseControllerFileGeneratorBackend = new BaseControllerFileGeneratorBackend(this);
    this.baseServiceFileGeneratorBackend = new BaseServiceFileGeneratorBackend(this);

  }

  start() {
    this.baseControllerFileGeneratorBackend.start();
    this.baseServiceFileGeneratorBackend.start();
    this.curdDefineFileGeneratorBackend.start();

    for (const module_name in this.modules) {
      const instance = this.modules[module_name] as ModulesGenerator;
      instance.start();
    }
    this.moduleListFileGeneratorBackend.start();
    this.entityListFileGeneratorBackend.start();
  }

  writeToFile() {
    this.baseControllerFileGeneratorBackend.writeToFile();
    this.baseServiceFileGeneratorBackend.writeToFile();
    this.curdDefineFileGeneratorBackend.writeToFile();

    for (const module_name in this.modules) {
      const instance = this.modules[module_name] as ModulesGenerator;
      instance.writeToFile();
    }
    this.moduleListFileGeneratorBackend.writeToFile();
    this.entityListFileGeneratorBackend.writeToFile();
  }

}
