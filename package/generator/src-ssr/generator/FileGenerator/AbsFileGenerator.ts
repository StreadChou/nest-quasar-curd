import {getImportPath, writeToFile} from "app/src-ssr/helper/PathHelper";

/** TS 文件生成器 */
export abstract class AbsFileGenerator {
  /** 导入: ImportType.ImportAnyAs */
  protected ImportAnyAsRecord: Record<string, string> = {}
  /** 导入: ImportType.ImportDefault */
  protected ImportDefaultRecord: Record<string, string> = {}
  /** 导入: ImportType.ImportItem */
  protected ImportItemRecord: Record<string, Set<string>> = {}


  /** 文件路径 */
  abstract getFilePath(): string;

  /** 获取文件内容 */
  abstract getFileContent(): string;

  /** 开始 */
  abstract start(): void;


  public writeToFile() {
    const file_path = this.getFilePath();
    const content = this.getFileContent();
    return writeToFile(file_path, content);
  }


  /** 获取导入的代码 */
  public getImportStringList(): string[] {
    let reply: string[] = [];

    const file_path = this.getFilePath();

    for (const target_path in this.ImportAnyAsRecord) {
      const import_path = getImportPath(file_path, target_path)
      reply.push(`import * as ${this.ImportAnyAsRecord[target_path]} from '${import_path}'`)
    }

    for (const target_path in this.ImportItemRecord) {
      const import_path = getImportPath(file_path, target_path)
      reply.push(`import ${this.ImportItemRecord[target_path]} from '${import_path}'`)
    }

    for (const target_path in this.ImportItemRecord) {
      const import_path = getImportPath(file_path, target_path)
      const itemsSet = this.ImportItemRecord[target_path];
      if (!itemsSet) continue;
      const item_string = Array.from(itemsSet).join(", ");
      reply.push(`import {${item_string}} from '${import_path}'`)
    }

    return reply;
  }

  /** 增加一个导入, 如果对方是TS文件, 则是TS的绝对路径, 如果对方是 package 包, 则是包的名字 */
  public addImport(targetAbsPath: string, importTpe: ImportType, name: string) {
    switch (importTpe) {
      case ImportType.ImportAnyAs: {
        if (!this.ImportAnyAsRecord[targetAbsPath]) {
          this.ImportAnyAsRecord[targetAbsPath] = name;
          break;
        }
        // 如果多次导入, 并且name不一致, 就报错
        if (this.ImportAnyAsRecord[targetAbsPath] !== name) {
          throw new Error(`多次通过${importTpe}从${targetAbsPath}导入, 但是 name 不一致`);
        }
        break;
      }
      case ImportType.ImportDefault: {
        if (!this.ImportDefaultRecord[targetAbsPath]) {
          this.ImportDefaultRecord[targetAbsPath] = name;
          break;
        }
        // 如果多次导入, 并且name不一致, 就报错
        if (this.ImportDefaultRecord[targetAbsPath] !== name) {
          throw new Error(`多次通过${importTpe}从${targetAbsPath}导入, 但是 name 不一致`);
        }
        break;
      }
      case ImportType.ImportItem: {
        this.ImportItemRecord[targetAbsPath] = this.ImportItemRecord[targetAbsPath] || new Set();
        this.ImportItemRecord[targetAbsPath].add(name);
        break;
      }

      default:
        throw new Error(`导入了未知的类型: ${importTpe}`);
    }
  }
}


export enum ImportType {
  /** import * as xxx from 'xxx' */
  ImportAnyAs = "ImportAnyAs",
  /** import xxx from 'xxx' */
  ImportDefault = "ImportDefault",
  /** import { xxx } from 'xxx' */
  ImportItem = "ImportItem",
}
