import {AbsFileGenerator} from "app/src-ssr/generator/FileGenerator/AbsFileGenerator";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {Table} from "app/src-ssr/types/Table";
import path from "node:path";

export abstract class AbsDataTableGenerator extends AbsFileGenerator {
  config: Table;
  env: "backend" | "frontend"

  constructor(ctx: GeneratorCtx, config: Table, env: "backend" | "frontend") {
    super(ctx);
    this.config = config;
    this.env = env;
  }

  abstract getFileName(): string;

  /** 文件的路径 */
  getFilePath() {
    if (this.env === "frontend") {
      return path.join(this.ctx.frontend_root, `constants/${this.getFileName()}`)
    }
    if (this.env === "backend") {
      return path.join(this.ctx.backend_root, `constants/${this.getFileName()}`)
    }

    return ""
  }

  getFileContent(): string {
    return this.config.Constants;
  }

}
