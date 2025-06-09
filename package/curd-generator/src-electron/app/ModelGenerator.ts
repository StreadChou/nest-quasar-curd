import {ModuleGenerator} from "app/src-electron/app/ModuleGenerator";
import {ModelConfig} from "app/type/JsonFileDefine/Model";

export class ModelGenerator {
  generator: Generator
  moduleGenerator: ModuleGenerator
  modelData: ModelConfig

  constructor(generator: Generator, modulesGenerator: ModuleGenerator, model: ModelConfig) {
    this.generator = generator;
    this.moduleGenerator = modulesGenerator;
    this.modelData = model;

    this.initInstance();
  }


  initInstance() {

  }

  start() {
  }

  writeToFile() {

  }
}
