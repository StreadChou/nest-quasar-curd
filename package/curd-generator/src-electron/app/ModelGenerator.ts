import {ModuleGenerator} from "app/src-electron/app/ModuleGenerator";
import {ModelConfig} from "app/type/JsonFileDefine/Model";
import {AFileGenerator} from "app/src-electron/app/generator/FileGenerator/AFileGenerator";
import {ControllerFile} from "app/src-electron/app/generator/FileGenerator/model/ControllerFile";
import {RootGenerator} from "app/src-electron/app/RootGenerator";
import {ServicesFile} from "app/src-electron/app/generator/FileGenerator/model/ServicesFile";

export class ModelGenerator {
  generator: RootGenerator
  moduleGenerator: ModuleGenerator
  modelConfig: ModelConfig

  /** 生成文件列表 */
  fileList: Array<AFileGenerator> = [];

  constructor(modulesGenerator: ModuleGenerator, model: ModelConfig) {
    this.generator = modulesGenerator.generator;
    this.moduleGenerator = modulesGenerator;
    this.modelConfig = model;

    this.initInstance();
  }


  initInstance() {
    this.fileList.push(new ControllerFile(this));
    this.fileList.push(new ServicesFile(this));
  }

  start() {
    for (const file of this.fileList) {
      file.start();
    }
  }

  writeToFile() {
    for (const file of this.fileList) {
      file.writeToFile();
    }
  }
}
