import {AFileGenerator} from "app/src-electron/app/generator/FileGenerator/AFileGenerator";
import {RootGenerator} from "app/src-electron/app/RootGenerator";
import {ModuleGenerator} from "app/src-electron/app/ModuleGenerator";
import {ModuleConfig} from "app/type/JsonFileDefine/Module";

export class ModuleFile extends AFileGenerator {
  generator: RootGenerator
  modulesGenerator: ModuleGenerator

  constructor(modulesGenerator: ModuleGenerator) {
    super();
    this.generator = modulesGenerator.generator;
    this.modulesGenerator = modulesGenerator;
  }

  get moduleConfig(): ModuleConfig {
    return this.modulesGenerator.moduleConfig;
  }

  /** 是否导出 */
  isExport(): boolean {
    return this.moduleConfig.isExport;
  }

  /** 获取所属文件夹路径 */
  getDirPath(): string {

  }

  /** 获取文件名称 */
  getFileName(): string {

  }

  /** class或者interface的name */
  getBaseName(): string {

  }
}
