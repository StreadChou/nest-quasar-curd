import {Generator} from "app/src-electron/app/Generator";
import {ModelsItem} from "app/type/JsonFileDefine/Index";
import {ModulesGenerator} from "app/src-electron/app/ModulesGenerator";
import {ModelFileGeneratorBackend} from "app/src-electron/app/generator/FileGenerator/ModelFileGeneratorBackend";

export class ModelGenerator {
  generator: Generator
  modulesGenerator: ModulesGenerator
  modelData: ModelsItem

  /** 文件生成器 */
  modelFileGeneratorBackend!: ModelFileGeneratorBackend;

  constructor(generator: Generator, modulesGenerator: ModulesGenerator, model: ModelsItem) {
    this.generator = generator;
    this.modulesGenerator = modulesGenerator;
    this.modelData = model;

    this.initInstance();
  }


  initInstance() {
    this.modelFileGeneratorBackend = new ModelFileGeneratorBackend(this.generator, this);
  }

  start() {

    this.modelFileGeneratorBackend.start();
  }

  writeToFile() {
    this.modelFileGeneratorBackend.writeToFile();
    
  }
}
