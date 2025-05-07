import {Generator} from "app/src-electron/app/Generator";
import {AbstractFileGenerator} from "app/src-electron/app/generator/FileGenerator/AbstractFileGenerator";
import {ModelsItem, ModulesItem} from "app/type/JsonFileDefine/Index";
import path from "path";
import {ModelGenerator} from "app/src-electron/app/ModelGenerator";

/** model文件生成 */
export class EntityFileGeneratorBackend extends AbstractFileGenerator {
  generator: Generator;
  modelGenerator: ModelGenerator;

  constructor(generator: Generator, modulesGenerator: ModelGenerator) {
    super();
    this.generator = generator;
    this.modelGenerator = modulesGenerator;
  }

  get moduleData(): ModulesItem {
    return this.modelGenerator.modulesGenerator.moduleData;
  }

  get modelData(): ModelsItem {
    return this.modelGenerator.modelData;
  }

  isExport() {
    return true;
  }

  getDirPath(): string {
    return path.join(this.generator.backend_path, this.moduleData.name as string, "entity");
  }

  getFileName(): string {
    return `${this.modelData.entityClassName}.ts`;
  }

  getBaseName(): string {
    return `${this.modelData.entityClassName as string}`;
  }

  start() {
    this.addImportFromTypeOrm("Entity")
    //
    // if (this.moduleData.isGlobal) {
    //   this.addImportFromNestjsCommon("Global")
    // }
  }

  writeToFile() {
    if (!this.isExport) return null;

    let raw = this.loadRawContent();
    let content = this.getTemplate();
    content = content.replace(/__BASE_NAME__/g, this.getBaseName())

    content = this.replaceCustomerInfo(raw, content, "IMPORT");
    content = this.replaceCustomerInfo(raw, content, "DECORATOR");
    content = this.replaceCustomerInfo(raw, content, "CONTENT");

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

@Entity({

})
// CUSTOMER DECORATOR START
// CUSTOMER DECORATOR END
export class __BASE_NAME__ {

// CUSTOMER CONTENT START
// CUSTOMER CONTENT END
}
`
  }


}
