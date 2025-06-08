import {Generator} from "app/src-electron/app/Generator";
import {ModulesGenerator} from "app/src-electron/app/ModulesGenerator";
import {EntityFileGeneratorBackend} from "app/src-electron/app/generator/FileGenerator/EntityFileGeneratorBackend";
import {
  ControllerFileGeneratorBackend
} from "app/src-electron/app/generator/FileGenerator/ControllerFileGeneratorBackend";
import {ServiceFileGeneratorBackend} from "app/src-electron/app/generator/FileGenerator/ServiceFileGeneratorBackend";
import {ModelConfig} from "app/type/JsonFileDefine/Model";
import {EntityFileGenerator} from "app/src-electron/app/generator/FileGenerator/model/EntityFileGenerator";

export class ModelGenerator {
  generator: Generator
  modulesGenerator: ModulesGenerator
  modelData: ModelConfig

  /** Entity 文件生成器 */
  entityFileGenerator!: EntityFileGenerator;
  /** Controller 文件生成器 */
  controllerFileGeneratorBackend!: EntityFileGeneratorBackend;
  /** Service 文件生成器 */
  serviceFileGeneratorBackend!: ServiceFileGeneratorBackend;

  constructor(generator: Generator, modulesGenerator: ModulesGenerator, model: ModelConfig) {
    this.generator = generator;
    this.modulesGenerator = modulesGenerator;
    this.modelData = model;

    this.initInstance();
  }


  initInstance() {
    this.entityFileGenerator = new EntityFileGenerator(this.generator, this);

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
