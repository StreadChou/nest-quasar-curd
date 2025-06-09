import path from "path";
import {Importer} from "app/src-electron/app/generator/Importer";

export abstract class AFileGenerator {
  importer: Importer;

  protected constructor() {
    this.importer = new Importer(this);
  }

  /** 是否导出 */
  abstract isExport(): boolean;

  /** 获取所属文件夹路径 */
  abstract getDirPath(): string;

  /** 获取文件名称 */
  abstract getFileName(): string;

  /** class或者interface的name */
  abstract getBaseName(): string;

  /** 获取文件的路径 */
  getFilePath(): string {
    return path.join(this.getDirPath(), this.getFileName());
  }

}
