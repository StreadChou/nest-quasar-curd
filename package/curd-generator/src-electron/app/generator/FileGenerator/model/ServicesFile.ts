import {AFileGenerator} from "app/src-electron/app/generator/FileGenerator/AFileGenerator";
import {ModelGenerator} from "app/src-electron/app/ModelGenerator";
import {ModuleConfig} from "app/type/JsonFileDefine/Module";
import {RootGenerator} from "app/src-electron/app/RootGenerator";
import {ModuleGenerator} from "app/src-electron/app/ModuleGenerator";
import {ModelConfig} from "app/type/JsonFileDefine/Model";
import {uppercaseFirstLetter} from "app/src-electron/helper/TxtHelper";
import path from "path";
import {AServicesFile} from "app/src-electron/app/generator/FileGenerator/common/AServicesFile";
import {AControllerFile} from "app/src-electron/app/generator/FileGenerator/common/AControllerFile";

export class ServicesFile extends AFileGenerator {
  generator: RootGenerator;
  moduleGenerator: ModuleGenerator;
  modelGenerator: ModelGenerator;

  constructor(modelGenerator: ModelGenerator) {
    super();
    this.modelGenerator = modelGenerator;
    this.moduleGenerator = modelGenerator.moduleGenerator;
    this.generator = this.moduleGenerator.generator;
  }

  get modelConfig(): ModelConfig {
    return this.modelGenerator.modelConfig;
  }

  get moduleConfig(): ModuleConfig {
    return this.moduleGenerator.moduleConfig;
  }

  override start() {
    this.content_list.push(...this.getTemplate());


    const aControllerFile = this.generator.findFile((ele => ele instanceof AControllerFile)) as AControllerFile;
    const aServicesFile = this.generator.findFile((ele => ele instanceof AServicesFile)) as AServicesFile;

    let isExtends = false;

    for (const index in this.content_list) {
      let item = this.content_list[index] as string;

      if (item.includes("__INJECTABLE_DECORATOR__")) {
        this.importer.addImportFromNestjsCommon("Injectable")
        item = item.replace("__INJECTABLE_DECORATOR__", "@Injectable()")
      }

      if (item.includes("__INS_EXTENDS__")) {
        this.importer.addImportFromFileGenerator(aServicesFile)
        isExtends = true;
        item = item.replace("__INS_EXTENDS__", `extends ${aServicesFile.getBaseName()}`)
      }
      if (item.includes("__INS_CONSTRUCTOR__")) {
        if (!isExtends) {
          item = item.replace("__INS_CONSTRUCTOR__", "")
        } else {
          item = item.replace("__INS_CONSTRUCTOR__", "")
        }
      }
      if (item.includes("__INS_CONSTRUCTOR_CONTENT__")) {
        if (!isExtends) {
          item = item.replace("__INS_CONSTRUCTOR_CONTENT__", "")
        } else {
          item = item.replace("__INS_CONSTRUCTOR_CONTENT__", "        super()")
        }
      }

      if (item.includes("__BASE_NAME__")) {
        item = item.replace("__BASE_NAME__", this.getBaseName())
      }
      this.content_list[index] = item;
    }
  }

  getBaseName(): string {
    const className = (this.modelConfig.serviceName as string).trim();

    if (this.isExport() && !className) {
      throw new Error(`${this.modelConfig.name} 期望导出 service 但是没有定义 name`)
    }

    return className;
  }

  getDirPath(): string {
    let name = this.moduleConfig.name || this.moduleConfig.fileName as string;
    name = uppercaseFirstLetter(name);
    return path.join(this.generator.backend_path, name);
  }

  getFileName(): string {
    const className = this.getBaseName();
    return `${className}.ts`;
  }

  isExport(): boolean {
    if ("exportService" in this.modelConfig) return this.modelConfig.exportService;
    return true;
  }


  getTemplate(): string[] {
    const string = `
// CUSTOMER IMPORT START
// CUSTOMER IMPORT END

__INJECTABLE_DECORATOR__
// CUSTOMER DECORATOR START
// CUSTOMER DECORATOR END
export class __BASE_NAME__ __INS_EXTENDS__{
    constructor(
__INS_CONSTRUCTOR__
        // CUSTOMER CONSTRUCTOR START
        // CUSTOMER CONSTRUCTOR END
    ) {
__INS_CONSTRUCTOR_CONTENT__
        // CUSTOMER CONTENT_CONTENT START
        // CUSTOMER CONTENT_CONTENT END
    }

    // CUSTOMER CONTENT START
    // CUSTOMER CONTENT END
}
`
    return string.split("\n")
  }
}

