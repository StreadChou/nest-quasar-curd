import {Generator} from "app/src-electron/app/Generator";
import {AbstractFileGenerator, ImportType} from "app/src-electron/app/generator/FileGenerator/AbstractFileGenerator";
import path from "path";
import {getTwoTsFileImportPath} from "app/src-electron/helper/PathHelper";
import {ModulesGenerator} from "app/src-electron/app/ModulesGenerator";
import {ModelGenerator} from "app/src-electron/app/ModelGenerator";

/** entityList 文件生成 */
export class EntityListFileGeneratorBackend extends AbstractFileGenerator {
  generator: Generator;
  /** entity 列表 */
  entityStringList: string[] = [];

  constructor(generator: Generator) {
    super();
    this.generator = generator;
  }


  isExport() {
    if ("toEntityList" in this.generator.data) return this.generator.data.toEntityList
    return true;
  }

  getDirPath(): string {
    return path.join(this.generator.backend_path);
  }

  getFileName(): string {
    return `EntityList.ts`;
  }

  getBaseName(): string {
    return `EntityList`;
  }

  start() {
    for (const module_string in this.generator.modules) {
      const item = this.generator.modules[module_string] as ModulesGenerator;
      for (const model_string in item.models) {
        const model = item.models[model_string] as ModelGenerator;
        const entityFileGeneratorBackend = model.entityFileGeneratorBackend;
        const baseName = entityFileGeneratorBackend.getBaseName();
        const filePath = entityFileGeneratorBackend.getFilePath();
        const importPath = getTwoTsFileImportPath(this.getFilePath(), filePath);
        this.addImport(importPath, ImportType.ImportItem, baseName);
        this.entityStringList.push(baseName)
      }
    }
  }

  writeToFile() {
    if (!this.isExport) return null;

    let content = this.getTemplate();
    content = content.replace(/__BASE_NAME__/g, this.getBaseName())

    if (this.entityStringList.length <= 0) {
      content = content.replace(/__ENTITY_LIST__/g, "")
    } else {
      content = content.replace(/__ENTITY_LIST__/g, this.entityStringList.map(ele => `  ${ele}`).join("\n"));
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
    __ENTITY_LIST__
]
`
  }


}
