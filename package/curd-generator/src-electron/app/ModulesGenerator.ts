import {Generator} from "app/src-electron/app/Generator";
import {ModelGenerator} from "app/src-electron/app/ModelGenerator";
import {ModuleFileGeneratorBackend} from "app/src-electron/app/generator/FileGenerator/ModuleFileGeneratorBackend";
import {ModuleConfig} from "app/type/JsonFileDefine/Module";
import {ModelConfig} from "app/type/JsonFileDefine/Model";

export class ModulesGenerator {
  generator: Generator
  moduleData: ModuleConfig

  /** 模型列表 */
  models: Record<string, ModelGenerator> = {};
  /** 文件生成器 */
  moduleFileGeneratorBackend!: ModuleFileGeneratorBackend;

  constructor(generator: Generator, module: ModuleConfig) {
    this.generator = generator;
    this.moduleData = module;
    this.initInstance();
  }

  initInstance() {
    this.moduleData = this.moduleData || {};
    this.moduleData.models = this.moduleData.models || {};
    for (const model_name in this.moduleData.models) {
      const model = this.moduleData.models[model_name] as ModelConfig;
      const instance = new ModelGenerator(this.generator, this, model)
      this.models[instance.modelData.name as string] = instance;
    }
    this.moduleFileGeneratorBackend = new ModuleFileGeneratorBackend(this.generator, this);
  }

  start() {
    for (const model_name in this.models) {
      const instance = this.models[model_name] as ModelGenerator;
      instance.start();
    }
    this.moduleFileGeneratorBackend.start();
  }

  writeToFile() {
    this.moduleFileGeneratorBackend.writeToFile();

    for (const model_name in this.models) {
      const instance = this.models[model_name] as ModelGenerator;
      instance.writeToFile();
    }
  }
}
