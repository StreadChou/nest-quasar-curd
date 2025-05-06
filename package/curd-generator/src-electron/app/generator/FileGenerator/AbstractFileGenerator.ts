import path from "path";
import fs from "fs";
import {getImportPath} from "app/src-electron/helper/PathHelper";

export abstract class AbstractFileGenerator {
  /** 导入: ImportType.ImportAnyAs */
  protected ImportAnyAsRecord: Record<string, string> = {}
  /** 导入: ImportType.ImportDefault */
  protected ImportDefaultRecord: Record<string, string> = {}
  /** 导入: ImportType.ImportItem */
  protected ImportItemRecord: Record<string, Set<string>> = {}

  abstract isExport(): boolean;

  /** 获取文件夹路径 */
  abstract getDirPath(): string;

  /** 获取文件名称 */
  abstract getFileName(): string;

  /** class或者interface的name */
  abstract getBaseName(): string;


  /** 获取文件的路径 */
  getFilePath(): string {
    return path.join(this.getDirPath(), this.getFileName());
  }


  /** 获取原本的内容 */
  loadRawContent() {
    if (!fs.existsSync(this.getFilePath())) return ""
    return fs.readFileSync(this.getFilePath(), "utf-8").toString();
  }

  /** 替换用户自定义的内容 */
  replaceCustomerInfo(raw: string, content: string, key: string) {
    const pattern = new RegExp(
      `(\\s// CUSTOMER ${key} START)([\\s\\S]*?)(// CUSTOMER ${key} END)`,
      'g'
    );
    const matchRes = raw.match(pattern);
    if (!matchRes) return content;
    content = content.replace(pattern, matchRes[0])


    return content;
  }


  writeFileContent(content: string) {
    const dir_path = this.getDirPath();
    if (!fs.existsSync(dir_path)) fs.mkdirSync(dir_path, {recursive: true});
    const file_path = this.getFilePath();
    fs.writeFileSync(file_path, content);
  }

  /** 获取导入的代码 */
  public getImportStringList(): string[] {
    let reply: string[] = [];

    const file_path = this.getFilePath();

    for (const target_path in this.ImportAnyAsRecord) {
      const import_path = getImportPath(file_path, target_path)
      reply.push(`import * as ${this.ImportAnyAsRecord[target_path]} from '${import_path}'`)
    }

    for (const target_path in this.ImportDefaultRecord) {
      const import_path = getImportPath(file_path, target_path)
      reply.push(`import ${this.ImportDefaultRecord[target_path]} from '${import_path}'`)
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


  public addImportFromNestjsCommon(name: string, importTpe: ImportType = ImportType.ImportItem) {
    this.addImport("@nestjs/common", importTpe, name);
  }

  public addImportFromTypeOrm(name: string, importTpe: ImportType = ImportType.ImportItem) {
    this.addImport("typeorm", importTpe, name);
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

