import {AFileGenerator} from "app/src-electron/app/generator/FileGenerator/AFileGenerator";
import {RootGenerator} from "app/src-electron/app/RootGenerator";
import {ModuleGenerator} from "app/src-electron/app/ModuleGenerator";
import {ModuleConfig} from "app/type/JsonFileDefine/Module";
import path from "path";
import {uppercaseFirstLetter} from "app/src-electron/helper/TxtHelper";

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

  override start() {
    this.content_list.push(...this.getTemplate());
    for (const index in this.content_list) {
      const item = this.content_list[index] as string;

      if (item.includes("__MODULE_DECORATOR__")) {
        this.importer.addImportFromNestjsCommon("Module")
        this.content_list[index] = item.replace("__MODULE_DECORATOR__", "@Module")
      }

      if (item.includes("__IMPORTS_CONTENT__")) {
        this.content_list[index] = item.replace("__IMPORTS_CONTENT__", "")
      }
      if (item.includes("__CONTROLLERS_CONTENT__")) {
        this.content_list[index] = item.replace("__CONTROLLERS_CONTENT__", "")
      }
      if (item.includes("__PROVIDERS_CONTENT__")) {
        this.content_list[index] = item.replace("__PROVIDERS_CONTENT__", "")
      }
      if (item.includes("__EXPORTS_CONTENT__")) {
        this.content_list[index] = item.replace("__EXPORTS_CONTENT__", "")
      }

      if (item.includes("__GLOBAL_DECORATOR__")) {
        this.importer.addImportFromNestjsCommon("Global")
        this.content_list[index] = item.replace("__GLOBAL_DECORATOR__", "@Global()")
      }

      if (item.includes("__BASE_NAME__")) {
        this.content_list[index] = item.replace("__BASE_NAME__", this.getBaseName())
      }


    }
  }

  /** 是否导出 */
  isExport(): boolean {
    return this.moduleConfig.isExport;
  }

  /** 获取所属文件夹路径 */
  getDirPath(): string {
    let name = this.moduleConfig.name || this.moduleConfig.fileName as string;
    name = uppercaseFirstLetter(name);
    return path.join(this.generator.backend_path, name);
  }

  /** 获取文件名称 */
  getFileName(): string {
    let name = this.moduleConfig.name || this.moduleConfig.fileName as string;
    name = uppercaseFirstLetter(name);
    return `${name}.ts`;
  }

  /** class或者interface的name */
  getBaseName(): string {
    return this.moduleConfig.name || this.moduleConfig.className as string
  }

  getTemplate(): string[] {
    const string = `// CUSTOMER IMPORT START
// CUSTOMER IMPORT END

__MODULE_DECORATOR__({
    imports: [
__IMPORTS_CONTENT__
        // CUSTOMER IMPORTS START
        // CUSTOMER IMPORTS END
    ],
    controllers: [
__CONTROLLERS_CONTENT__
        // CUSTOMER CONTROLLERS START
        // CUSTOMER CONTROLLERS END
    ],
    providers: [
__PROVIDERS_CONTENT__
        // CUSTOMER PROVIDERS START
        // CUSTOMER PROVIDERS END
    ],
    exports: [
__EXPORTS_CONTENT__
        // CUSTOMER EXPORTS START
        // CUSTOMER EXPORTS END
    ],
})
__GLOBAL_DECORATOR__
// CUSTOMER DECORATOR START
// CUSTOMER DECORATOR END
export class __BASE_NAME__ {
}
`
    return string.split("\n")
  }
}
