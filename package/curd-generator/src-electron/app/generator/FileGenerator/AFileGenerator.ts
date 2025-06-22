import path from "path";
import {Importer} from "app/src-electron/app/generator/Importer";
import fs from "fs";

export abstract class AFileGenerator {
  importer: Importer;
  /** 文件的内容 */
  content_list: string[] = [];

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


  /** 开始 */
  abstract start(): void;

  writeToFile() {
    const dir_path = this.getDirPath();
    if (!fs.existsSync(dir_path)) fs.mkdirSync(dir_path, {recursive: true});

    const filePath = this.getFilePath();
    const content = this.content_list.join("\n");
    fs.writeFileSync(filePath, content);
  }

}
