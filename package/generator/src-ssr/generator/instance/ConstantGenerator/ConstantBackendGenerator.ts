import {AbstractGenerator} from "app/src-ssr/generator/instance/AbstractGenerator/AbstractGenerator";
import {Table} from "app/src-ssr/types/Table";
import path from "node:path";
import {writeToFile} from "app/src-ssr/app/PathHelper";

export class ConstantBackendGenerator extends AbstractGenerator {
  config: Table
  content: string = "";

  constructor(ctx: any, config: Table) {
    super(ctx);
    this.config = config;
    this.content = config.Constants;

    this.start();
  }

  /** 导出的文件名字 */
  getFileName() {
    return `${this.config.ClassName}Constants.ts`
  }

  /** 文件的路径 */
  getFilePath() {
    return path.join(this.ctx.backend_root, `constants/${this.getFileName()}`)
  }

  start() {
    if (this.content) writeToFile(this.getFilePath(), this.content);
  }
}
