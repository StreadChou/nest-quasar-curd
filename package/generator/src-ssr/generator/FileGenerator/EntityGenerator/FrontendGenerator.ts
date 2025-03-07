import {AbsEntityGenerator} from "app/src-ssr/generator/FileGenerator/EntityGenerator/AbsEntityGenerator";
import path from "node:path";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {Table} from "app/src-ssr/types/Table";
import {AbsColumnsGeneratorCtx} from "app/src-ssr/generator/ColumnGenerator/AbsColumnsGeneratorCtx";

export class FrontendGenerator extends AbsEntityGenerator {
  columnsGenerator: AbsColumnsGeneratorCtx[] = [];

  constructor(ctx: GeneratorCtx, config: Table) {
    super(ctx, config);
    this.addColumnsGenerator();
  }

  /** 文件的路径 */
  getFilePath() {
    return path.join(this.ctx.frontend_root, `entities/${this.getFileName()}`)
  }


  getFileContent(): string {
    return "";
  }

  override isFrontend(): boolean {
    return true;
  }
}
