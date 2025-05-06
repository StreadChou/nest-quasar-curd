import {Generator} from "app/src-electron/app/Generator";
import {ModulesGenerator} from "app/src-electron/app/ModulesGenerator";
import {AbstractFileGenerator} from "app/src-electron/app/generator/FileGenerator/AbstractFileGenerator";
import {ModulesItem} from "app/type/JsonFileDefine/Index";
import path from "path";
import fs from "fs";

/** module文件生成 */
export class ModuleFileGeneratorBackend extends AbstractFileGenerator {
  generator: Generator;
  modulesGenerator: ModulesGenerator

  constructor(generator: Generator, modulesGenerator: ModulesGenerator) {
    super();
    this.generator = generator;
    this.modulesGenerator = modulesGenerator;
  }

  get moduleData(): ModulesItem {
    return this.modulesGenerator.moduleData;
  }

  isExport() {
    if ("isExport" in this.moduleData) return this.moduleData.isExport
    return true;
  }

  getDirPath(): string {
    return path.join(this.generator.backend_path, this.moduleData.name as string);
  }

  getFileName(): string {
    return `${this.moduleData.name}Module.ts`;
  }

  getBaseName(): string {
    return `${this.moduleData.name as string}Module`;
  }

  start() {
    this.addImportFromNestjsCommon("Module")

    if (this.moduleData.isGlobal) {
      this.addImportFromNestjsCommon("Global")
    }

  }

  writeToFile() {
    if (!this.isExport) return null;

    let raw = this.loadRawContent();

    let content = this.getTemplate();
    content = content.replace(/__BASE_NAME__/g, this.getBaseName())
    content = content.replace(/__IS_GLOBAL__/g, this.moduleData.isGlobal ? "@Global()" : "")

    content = this.replaceCustomerInfo(raw, content, "IMPORTS");
    content = this.replaceCustomerInfo(raw, content, "CONTROLLERS");
    content = this.replaceCustomerInfo(raw, content, "PROVIDERS");
    content = this.replaceCustomerInfo(raw, content, "EXPORTS");
    content = this.replaceCustomerInfo(raw, content, "IMPORT");
    content = this.replaceCustomerInfo(raw, content, "DECORATOR");

    const import_string = this.getImportStringList();
    content = `${import_string.join('\n')}${content}`;

    this.writeFileContent(content);
  }


  getTemplate(): string {
    return this._template();
  }

  _template(): string {
    return `
// CUSTOMER IMPORT START
// CUSTOMER IMPORT END

@Module({
    imports: [

        // CUSTOMER IMPORTS START
        // CUSTOMER IMPORTS END
    ],
    controllers: [

        // CUSTOMER CONTROLLERS START
        // CUSTOMER CONTROLLERS END
    ],
    providers: [

        // CUSTOMER PROVIDERS START
        // CUSTOMER PROVIDERS END
    ],
    exports: [

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
  }


}
