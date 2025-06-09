import {ModuleConfig} from "app/type/JsonFileDefine/Module";
import {ModelGenerator} from "app/src-electron/app/ModelGenerator";
import {AFileGenerator} from "app/src-electron/app/generator/FileGenerator/AFileGenerator";
import {ModuleFile} from "app/src-electron/app/generator/FileGenerator/module/ModuleFile";
import {RootGenerator} from "app/src-electron/app/RootGenerator";

export class ModuleGenerator {
  generator: RootGenerator
  moduleConfig: ModuleConfig

  /** 模型列表 */
  models: Record<string, ModelGenerator> = {};
  /** 生成文件列表 */
  fileList: Array<AFileGenerator> = [];

  constructor(generator: RootGenerator, moduleConfig: ModuleConfig) {
    this.generator = generator;
    this.moduleConfig = moduleConfig;
    this.initInstance();
  }

  initInstance() {
    this.fileList.push(new ModuleFile(this));
  }

  start() {
  }

  writeToFile() {
  }
}
