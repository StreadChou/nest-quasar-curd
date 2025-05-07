import {Generator} from "app/src-electron/app/Generator";
import {ModelsItem} from "app/type/JsonFileDefine/Index";
import {ModulesGenerator} from "app/src-electron/app/ModulesGenerator";
import {ModelFileGeneratorBackend} from "app/src-electron/app/generator/FileGenerator/ModelFileGeneratorBackend";
import {
  ControllerFileGeneratorBackend
} from "app/src-electron/app/generator/FileGenerator/ControllerFileGeneratorBackend";
import {ServiceFileGeneratorBackend} from "app/src-electron/app/generator/FileGenerator/ServiceFileGeneratorBackend";

export class ModelGenerator {
  generator: Generator
  modulesGenerator: ModulesGenerator
  modelData: ModelsItem

  /** Entity 文件生成器 */
  modelFileGeneratorBackend!: ModelFileGeneratorBackend;
  /** Controller 文件生成器 */
  controllerFileGeneratorBackend!: ModelFileGeneratorBackend;
  /** Service 文件生成器 */
  serviceFileGeneratorBackend!: ServiceFileGeneratorBackend;

  constructor(generator: Generator, modulesGenerator: ModulesGenerator, model: ModelsItem) {
    this.generator = generator;
    this.modulesGenerator = modulesGenerator;
    this.modelData = model;

    this.initInstance();
  }


  initInstance() {
    this.modelFileGeneratorBackend = new ModelFileGeneratorBackend(this.generator, this);
    this.controllerFileGeneratorBackend = new ControllerFileGeneratorBackend(this.generator, this);
    this.serviceFileGeneratorBackend = new ServiceFileGeneratorBackend(this.generator, this);
  }

  start() {

    this.modelFileGeneratorBackend.start();
    this.controllerFileGeneratorBackend.start();
    this.serviceFileGeneratorBackend.start();
  }

  writeToFile() {
    this.modelFileGeneratorBackend.writeToFile();
    this.controllerFileGeneratorBackend.writeToFile();
    this.serviceFileGeneratorBackend.writeToFile();

  }
}
