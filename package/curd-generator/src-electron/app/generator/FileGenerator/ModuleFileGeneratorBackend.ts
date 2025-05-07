import {Generator} from "app/src-electron/app/Generator";
import {ModulesGenerator} from "app/src-electron/app/ModulesGenerator";
import {AbstractFileGenerator, ImportType} from "app/src-electron/app/generator/FileGenerator/AbstractFileGenerator";
import {ModulesItem} from "app/type/JsonFileDefine/Index";
import path from "path";
import {ModelGenerator} from "app/src-electron/app/ModelGenerator";
import {getTwoTsFileImportPath} from "app/src-electron/helper/PathHelper";

/** module文件生成 */
export class ModuleFileGeneratorBackend extends AbstractFileGenerator {
  generator: Generator;
  modulesGenerator: ModulesGenerator

  TYPE_ORM_FOR_FEATURE: string[] = [];
  IMPORTS_CONTENT: string[] = [];
  CONTROLLERS_CONTENT: string[] = [];
  PROVIDERS_CONTENT: string[] = [];
  EXPORTS_CONTENT: string[] = [];


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

    for (const model_string in this.modulesGenerator.models) {
      const model = this.modulesGenerator.models[model_string] as ModelGenerator;
      const modelData = model.modelData;

      const entityFileGeneratorBackend = model.entityFileGeneratorBackend;
      if (entityFileGeneratorBackend.isExport()) {
        const joinModuleImports = "joinModuleImports" in modelData ? modelData.joinModuleImports : true;
        if (joinModuleImports) {
          const baseName = entityFileGeneratorBackend.getBaseName();
          const filePath = entityFileGeneratorBackend.getFilePath();
          const importPath = getTwoTsFileImportPath(this.getFilePath(), filePath);
          this.addImport(importPath, ImportType.ImportItem, baseName);
          this.TYPE_ORM_FOR_FEATURE.push(baseName)
        }
      }

      const controllerFileGeneratorBackend = model.controllerFileGeneratorBackend;
      if (controllerFileGeneratorBackend.isExport()) {
        const joinModuleControllers = "joinModuleControllers" in modelData ? modelData.joinModuleControllers : true;
        if (joinModuleControllers) {
          const baseName = controllerFileGeneratorBackend.getBaseName();
          const filePath = controllerFileGeneratorBackend.getFilePath();
          const importPath = getTwoTsFileImportPath(this.getFilePath(), filePath);
          this.addImport(importPath, ImportType.ImportItem, baseName);
          this.CONTROLLERS_CONTENT.push(baseName)
        }
      }

      const serviceFileGeneratorBackend = model.serviceFileGeneratorBackend;
      if (serviceFileGeneratorBackend.isExport()) {
        const baseName = serviceFileGeneratorBackend.getBaseName();
        const filePath = serviceFileGeneratorBackend.getFilePath();
        const importPath = getTwoTsFileImportPath(this.getFilePath(), filePath);

        const joinModuleProviders = "joinModuleProviders" in modelData ? modelData.joinModuleProviders : true;
        if (joinModuleProviders) {
          this.addImport(importPath, ImportType.ImportItem, baseName);
          this.PROVIDERS_CONTENT.push(baseName)
        }

        const joinModuleExports = "joinModuleExports" in modelData ? modelData.joinModuleExports : true;
        if (joinModuleExports) {
          this.addImport(importPath, ImportType.ImportItem, baseName);
          this.EXPORTS_CONTENT.push(baseName)
        }

      }
    }
    if (this.TYPE_ORM_FOR_FEATURE.length > 0) {
      this.addImport("@nestjs/typeorm", ImportType.ImportItem, "TypeOrmModule")
      this.IMPORTS_CONTENT.push(`TypeOrmModule.forFeature([${this.TYPE_ORM_FOR_FEATURE.join(", ")}])`)
    }


  }

  writeToFile() {
    if (!this.isExport) return null;

    let raw = this.loadRawContent();

    let content = this.getTemplate();
    content = content.replace(/__BASE_NAME__/g, this.getBaseName())
    content = content.replace(/__IS_GLOBAL__/g, this.moduleData.isGlobal ? "@Global()" : "")


    if (this.IMPORTS_CONTENT.length <= 0) {
      content = content.replace(/__IMPORTS_CONTENT__/g, "")
    } else {
      content = content.replace(/__IMPORTS_CONTENT__/g, this.IMPORTS_CONTENT.map(ele => `        ${ele}`).join(",\n"));
    }

    if (this.CONTROLLERS_CONTENT.length <= 0) {
      content = content.replace(/__CONTROLLERS_CONTENT__/g, "")
    } else {
      content = content.replace(/__CONTROLLERS_CONTENT__/g, this.CONTROLLERS_CONTENT.map(ele => `        ${ele}`).join(",\n"));
    }

    if (this.PROVIDERS_CONTENT.length <= 0) {
      content = content.replace(/__PROVIDERS_CONTENT__/g, "")
    } else {
      content = content.replace(/__PROVIDERS_CONTENT__/g, this.PROVIDERS_CONTENT.map(ele => `        ${ele}`).join(",\n"));
    }

    if (this.EXPORTS_CONTENT.length <= 0) {
      content = content.replace(/__EXPORTS_CONTENT__/g, "")
    } else {
      content = content.replace(/__EXPORTS_CONTENT__/g, this.EXPORTS_CONTENT.map(ele => `        ${ele}`).join(",\n"));
    }


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
  }


}
