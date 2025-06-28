import {ModuleConfig} from "app/type/JsonFileDefine/Module";
import {ModelGenerator} from "app/src-electron/app/ModelGenerator";
import {AFileGenerator} from "app/src-electron/app/generator/FileGenerator/AFileGenerator";
import {ModuleFile} from "app/src-electron/app/generator/FileGenerator/module/ModuleFile";
import {RootGenerator} from "app/src-electron/app/RootGenerator";
import {ModelConfig} from "app/type/JsonFileDefine/Model";

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
    for (const key in this.moduleConfig.models) {
      const item = this.moduleConfig.models[key] as ModelConfig;
      this.models[key] = new ModelGenerator(this, item);
    }
  }

  start() {
    for (const file of this.fileList) {
      file.start();
    }
    for (const key in this.models) {
      this.models[key]?.start();
    }
  }

  writeToFile() {
    for (const file of this.fileList) {
      file.writeToFile();
    }
    for (const key in this.models) {
      this.models[key]?.writeToFile();
    }
  }

}
