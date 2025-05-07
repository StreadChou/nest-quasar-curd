import {Generator} from "app/src-electron/app/Generator";
import {ModelsItem} from "app/type/JsonFileDefine/Index";
import {ModulesGenerator} from "app/src-electron/app/ModulesGenerator";
import {EntityFileGeneratorBackend} from "app/src-electron/app/generator/FileGenerator/EntityFileGeneratorBackend";
import {
  ControllerFileGeneratorBackend
} from "app/src-electron/app/generator/FileGenerator/ControllerFileGeneratorBackend";
import {ServiceFileGeneratorBackend} from "app/src-electron/app/generator/FileGenerator/ServiceFileGeneratorBackend";

export class ModelGenerator {
  generator: Generator
  modulesGenerator: ModulesGenerator
  modelData: ModelsItem

  /** Entity 文件生成器 */
  entityFileGeneratorBackend!: EntityFileGeneratorBackend;
  /** Controller 文件生成器 */
  controllerFileGeneratorBackend!: EntityFileGeneratorBackend;
  /** Service 文件生成器 */
  serviceFileGeneratorBackend!: ServiceFileGeneratorBackend;

  constructor(generator: Generator, modulesGenerator: ModulesGenerator, model: ModelsItem) {
    this.generator = generator;
    this.modulesGenerator = modulesGenerator;
    this.modelData = model;

    this.initInstance();
  }


  initInstance() {
    this.entityFileGeneratorBackend = new EntityFileGeneratorBackend(this.generator, this);
    this.controllerFileGeneratorBackend = new ControllerFileGeneratorBackend(this.generator, this);
    this.serviceFileGeneratorBackend = new ServiceFileGeneratorBackend(this.generator, this);
  }

  start() {

    this.entityFileGeneratorBackend.start();
    this.controllerFileGeneratorBackend.start();
    this.serviceFileGeneratorBackend.start();
  }

  writeToFile() {
    this.entityFileGeneratorBackend.writeToFile();
    this.controllerFileGeneratorBackend.writeToFile();
    this.serviceFileGeneratorBackend.writeToFile();

  }
}
