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

@Module({
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
// CUSTOMER DECORATOR START
// CUSTOMER DECORATOR END
__IS_GLOBAL__
export class __BASE_NAME__ {
}
`
    return string.split("\n")
  }
}
