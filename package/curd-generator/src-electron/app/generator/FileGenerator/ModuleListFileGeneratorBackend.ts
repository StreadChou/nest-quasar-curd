import {Generator} from "app/src-electron/app/Generator";
import {AbstractFileGenerator, ImportType} from "app/src-electron/app/generator/FileGenerator/AbstractFileGenerator";
import path from "path";
import {ModulesGenerator} from "app/src-electron/app/ModulesGenerator";
import {getTwoTsFileImportPath} from "app/src-electron/helper/PathHelper";

/** moduleList 文件生成 */
export class ModuleListFileGeneratorBackend extends AbstractFileGenerator {
  generator: Generator;
  /** module 列表 */
  MODULE_LIST_CONTENT: string[] = [];

  constructor(generator: Generator) {
    super();
    this.generator = generator;
  }


  isExport() {
    if ("toModulesList" in this.generator.data) return this.generator.data.toModulesList
    return true;
  }

  getDirPath(): string {
    return path.join(this.generator.backend_path);
  }

  getFileName(): string {
    return `ModuleList.ts`;
  }

  getBaseName(): string {
    return `ModuleList`;
  }

  start() {
    for (const string in this.generator.modules) {
      const item = this.generator.modules[string] as ModulesGenerator;
      const moduleFileGeneratorBackend = item.moduleFileGeneratorBackend;
      const baseName = moduleFileGeneratorBackend.getBaseName();
      const filePath = moduleFileGeneratorBackend.getFilePath();
      const importPath = getTwoTsFileImportPath(this.getFilePath(), filePath);
      this.addImport(importPath, ImportType.ImportItem, baseName);
      this.MODULE_LIST_CONTENT.push(baseName)
    }
  }

  writeToFile() {
    if (!this.isExport) return null;

    let content = this.getTemplate();
    content = content.replace(/__BASE_NAME__/g, this.getBaseName())

    if (this.MODULE_LIST_CONTENT.length <= 0) {
      content = content.replace(/__MODULE_LIST_CONTENT__/g, "")
    } else {
      content = content.replace(/__MODULE_LIST_CONTENT__/g, this.MODULE_LIST_CONTENT.map(ele=> `  ${ele}`).join("\n"));
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

export const __BASE_NAME__ = [
    __MODULE_LIST_CONTENT__
]
`
  }


}
