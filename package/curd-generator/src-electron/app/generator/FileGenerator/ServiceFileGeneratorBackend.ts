import {Generator} from "app/src-electron/app/Generator";
import {AbstractFileGenerator, ImportType} from "app/src-electron/app/generator/FileGenerator/AbstractFileGenerator";
import {ModelsItem, ModulesItem} from "app/type/JsonFileDefine/Index";
import path from "path";
import {ModelGenerator} from "app/src-electron/app/ModelGenerator";
import {lowercaseFirstLetter} from "app/src-electron/helper/TxtHelper";
import {getTwoTsFileImportPath} from "app/src-electron/helper/PathHelper";

/** service 文件生成 */
export class ServiceFileGeneratorBackend extends AbstractFileGenerator {
  generator: Generator;
  modelGenerator: ModelGenerator;

  private __INS_EXTENDS__: string = "";
  private __INS_CONSTRUCTOR__: string[] = [];
  private __INS_CONSTRUCTOR_CONTENT__: string[] = [];

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
    return path.join(this.generator.backend_path, this.moduleData.name as string, "services");
  }

  getFileName(): string {
    return `${this.modelData.serviceName}.ts`;
  }

  getBaseName(): string {
    return `${this.modelData.serviceName as string}`;
  }

  start() {
    this.addImportFromNestjsCommon("Injectable")


    const entityFileGeneratorBackend = this.modelGenerator.entityFileGeneratorBackend;
    if (entityFileGeneratorBackend.isExport()) {
      const baseServiceFileGeneratorBackend = this.generator.baseServiceFileGeneratorBackend

      const entityBaseName = entityFileGeneratorBackend.getBaseName();
      const fatherBaseName = baseServiceFileGeneratorBackend.getBaseName();
      const repoName = `${lowercaseFirstLetter(entityBaseName)}Repository`

      // 增加继承
      this.__INS_EXTENDS__ = `extends ${fatherBaseName}<${entityBaseName}> `;
      this.addImportFromFileGenerator(baseServiceFileGeneratorBackend);
      this.addImportFromFileGenerator(entityFileGeneratorBackend)
      this.__INS_CONSTRUCTOR_CONTENT__.push(`super(${repoName});`)


      this.addImportFromNestjsTypeorm("InjectRepository");
      this.addImportFromTypeOrm("Repository");
      this.__INS_CONSTRUCTOR__.push(`@InjectRepository(${entityBaseName}) private ${repoName}: Repository<${entityBaseName}>`)

    }


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
    content = this.replaceCustomerInfo(raw, content, "CONSTRUCTOR");
    content = this.replaceCustomerInfo(raw, content, "CONTENT");

    if (this.__INS_CONSTRUCTOR__.length <= 0) {
      content = content.replace(/__INS_CONSTRUCTOR__/g, "")
    } else {
      content = content.replace(/__INS_CONSTRUCTOR__/g, this.__INS_CONSTRUCTOR__.map(ele => `        ${ele}`).join(",\n"));
    }

    if (this.__INS_CONSTRUCTOR_CONTENT__.length <= 0) {
      content = content.replace(/__INS_CONSTRUCTOR_CONTENT__/g, "")
    } else {
      content = content.replace(/__INS_CONSTRUCTOR_CONTENT__/g, this.__INS_CONSTRUCTOR_CONTENT__.map(ele => `        ${ele}`).join(",\n"));
    }

    if (this.__INS_EXTENDS__.length <= 0) {
      content = content.replace(/__INS_EXTENDS__/g, "")
    } else {
      content = content.replace(/__INS_EXTENDS__/g, this.__INS_EXTENDS__);
    }

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

@Injectable()
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
  }


}
