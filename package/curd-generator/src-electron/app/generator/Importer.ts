import {ImportType} from "app/type/TypescriptImport/ImportType";
import {getImportPath, getTwoTsFileImportPath} from "app/src-electron/helper/PathHelper";
import {AFileGenerator} from "app/src-electron/app/generator/FileGenerator/AFileGenerator";

export class Importer {
  self: { getFilePath: () => string };
  /** 导入: ImportType.ImportAnyAs */
  protected ImportAnyAsRecord: Record<string, string> = {}
  /** 导入: ImportType.ImportDefault */
  protected ImportDefaultRecord: Record<string, string> = {}
  /** 导入: ImportType.ImportItem */
  protected ImportItemRecord: Record<string, Set<string>> = {}

  constructor(self: { getFilePath: () => string }) {
    this.self = self;
  }


  public addImportFromFileGenerator(target: AFileGenerator, importTpe: ImportType = ImportType.ImportItem) {
    const importPath = getTwoTsFileImportPath(this.self.getFilePath(), target.getFilePath());
    this.addImport(importPath, importTpe, target.getBaseName());
  }


  /** 获取导入的代码 */
  public getImportStringList(): string[] {
    let reply: string[] = [];

    const self_path = this.self.getFilePath();

    for (const target_path in this.ImportAnyAsRecord) {
      const import_path = getImportPath(self_path, target_path)
      reply.push(`import * as ${this.ImportAnyAsRecord[target_path]} from '${import_path}'`)
    }

    for (const target_path in this.ImportDefaultRecord) {
      const import_path = getImportPath(self_path, target_path)
      reply.push(`import ${this.ImportDefaultRecord[target_path]} from '${import_path}'`)
    }

    for (const target_path in this.ImportItemRecord) {
      const import_path = getImportPath(self_path, target_path)
      const itemsSet = this.ImportItemRecord[target_path];
      if (!itemsSet) continue;
      const item_string = Array.from(itemsSet).join(", ");
      reply.push(`import {${item_string}} from '${import_path}'`)
    }

    return reply;
  }


  public addImportFromNestjsCommon(name: string, importTpe: ImportType = ImportType.ImportItem) {
    this.addImport("@nestjs/common", importTpe, name);
  }

  public addImportFromNestjsTypeorm(name: string, importTpe: ImportType = ImportType.ImportItem) {
    this.addImport("@nestjs/typeorm", importTpe, name);
  }

  public addImportFromTypeOrm(name: string, importTpe: ImportType = ImportType.ImportItem) {
    this.addImport("typeorm", importTpe, name);
  }

  /** 增加一个导入, 如果对方是TS文件, 则是TS的绝对路径, 如果对方是 package 包, 则是包的名字 */
  public addImport(targetPathString: string, importTpe: ImportType, name: string) {
    switch (importTpe) {
      case ImportType.ImportAnyAs: {
        if (!this.ImportAnyAsRecord[targetPathString]) {
          this.ImportAnyAsRecord[targetPathString] = name;
          break;
        }
        // 如果多次导入, 并且name不一致, 就报错
        if (this.ImportAnyAsRecord[targetPathString] !== name) {
          throw new Error(`多次通过${importTpe}从${targetPathString}导入, 但是 name 不一致`);
        }
        break;
      }
      case ImportType.ImportDefault: {
        if (!this.ImportDefaultRecord[targetPathString]) {
          this.ImportDefaultRecord[targetPathString] = name;
          break;
        }
        // 如果多次导入, 并且name不一致, 就报错
        if (this.ImportDefaultRecord[targetPathString] !== name) {
          throw new Error(`多次通过${importTpe}从${targetPathString}导入, 但是 name 不一致`);
        }
        break;
      }
      case ImportType.ImportItem: {
        this.ImportItemRecord[targetPathString] = this.ImportItemRecord[targetPathString] || new Set();
        this.ImportItemRecord[targetPathString].add(name);
        break;
      }

      default:
        throw new Error(`导入了未知的类型: ${importTpe}`);
    }
  }
}
